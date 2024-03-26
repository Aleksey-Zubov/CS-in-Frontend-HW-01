const { binary, binary64 } = require('./helpers')


class BCD {
  numbers = [];
  
  constructor(num) {
    this.isNegative = false    
    this.#decimalToBcd(num)
  }

  #decimalToBcd(n) {
    let tempArr = []
    let i = 0
    let numbersCell = 0
    let shiftForFirstCell = 0 // Сдвиг для цифры которую будем вставлять в первую ячейку
    let shiftFotLastCell = 0  // Сдвиг для цифры которую будем вставлять в последнюю (свободную) ячейку

    if (n < 0) {
      n *= -1n
      this.isNegative = true
    }

    while (n > 0n) {
      let digit = this.isNegative ? 9n - (n % 10n) : n % 10n
      digit = Number(digit)
      let digitForFirstCell = digit << shiftForFirstCell

      if (this.isNegative && i == 0) { // Проставляем бит отрицания только на первой итерации
        let negativeBit = 1 << 31
        tempArr[0] |= negativeBit 
      }

      if (i !== 0 && i % 7 === 0) { // На каждой 8ой итерации добавляем ячейку и увеличиваем индекс последней ячейки
        numbersCell++
        tempArr[numbersCell] = 0
      }
     
      if (i >= 7) {
        let k = tempArr.length - 1
        let lastDigitFromPrevCell = 0

        while (k >= 0) {                                                          // Проходим массив с конца и обновляем все ячейки
          let isCellIsFull = (tempArr[k] & this.#createMask(1, 31)) > 0           // Флаг заполнености ячейки
          lastDigitFromPrevCell = tempArr[k - 1] & this.#createMask(4, 4)         // Последняя цифра числа из предыдущей ячейки

          if (isCellIsFull) {                                                     // Если ячейка полна
            let cellInfo = (tempArr[k] & this.#createMask(4, 32))                 // Сохраняем инфу оч числе (бит отрицания и бит наполнености)
            tempArr[k] <<= 4                                                      // Осовобождаем место для цифры из следующей ячейки
            tempArr[k] >>>= 8
            tempArr[k] |= cellInfo                                                // Возращем инфу на место
            lastDigitFromPrevCell <<= 24                                          // Двигаем биты цифры так что совпало с освобожденным местом
            tempArr[k] |= k === 0 ? digitForFirstCell : lastDigitFromPrevCell     // Если это ячейка не первая то вставляем последнюю цифру из предыдушщей ячейки если первая то текущую цифру
          } else {                                                                // Если ячейка не полная то вставляем цифру из предпоследней ячейки
            lastDigitFromPrevCell <<= shiftFotLastCell                            // Сдвигаем биты цифры так чтоб цифра всегда вставлялась вперед чтобы сохранить разряд
            tempArr[k] |= lastDigitFromPrevCell                                   // Прибаляем
          }          
          k--
        }
      } else {
          tempArr[0] |= digitForFirstCell                                          // Первые 7 цифр можно не следить за другими ячейками
      }

      if (shiftForFirstCell < 24) {
        shiftForFirstCell += 4                                                     // Первые семь итераций прибавляем 4 бита для сдвига цифры для первой ячейки, потом сдвиг всегда 24
      }

      if (shiftFotLastCell === 24) {                                              // Сдвиг цифры для последней ячейки, сбрасываем после каждой 7-ой итерации
        shiftFotLastCell = 0
        let overBit = 1 << 30                                                     // Добавляем бит наполнености ячейки
        tempArr[numbersCell] |= overBit
      } else {
        shiftFotLastCell += 4
      }
   
      n = ~~(n / 10n)
      i++
    }

    this.numbers = tempArr
    return tempArr
  }

  #createMask(len, pos) {
    let n = ~0
  
    n <<= 32 - len
    n >>>= 32 - pos
  
    return n
  }

  binaryAddition(a, b) {
    let result = a ^ b
    let carry = a & b;
    let temp_result = 0;
  
    while (carry > 0) {
      carry = carry << 1
      temp_result = result ^ carry
      carry = result & carry
      result = temp_result
    }
  
    return result;
  }

  valueOf() {
    let res = this.numbers[0]
    res = (res << 4) >>> 4
    res = BigInt(res)
     
    if (this.numbers.length < 2) {   
      return res
    } 

    for (let i = 1; i < this.numbers.length; i++) {                         //Обходим numbers начиная со 2-го элемента 
      let tempNum = BigInt(this.numbers[i])                
      let isCellIsFull = (tempNum & BigInt(this.#createMask(1, 31))) > 0n
      if (isCellIsFull) {                                                   // Если ячейка полна 
        let overBit = tempNum & BigInt(this.#createMask(1, 31)) 
        tempNum ^= overBit                                                  // убираем бит заполнености
        res <<= 28n                                                         // двигаем промежуточный результат на 28 бит
        res ^= tempNum                                                      // добавляем биты из ячейки к промежуточному резуьтату
      } else {                                                              // Если ячейка не полная
        let i = 0n
        let lastNumber = 0n                                                 // Сюда будем сохранять число из последней (неполной) ячейки
        while (tempNum > 0n) {                                              // Двигаем биты промежуточного результата
          let lastDigit = tempNum & BigInt(this.#createMask(4, 4))          // берем послденюю цифру из ячейки
          lastDigit <<= i * 4n                                              // сдвигаем ее каждый итерацию на + 4 бита
          tempNum >>= 4n                                                    // убираем 4 битам 
          lastNumber |= lastDigit                                           // сохрянаем последнюю цифру
          res <<= 4n                                                        // двигаем промежуточный результат на 4 бита на каждой итерации
          i++
        }
        res ^= lastNumber
      }
    }
    return res
  }

  get(enterIndex) { // Есть баг, не работает с неполными ячейками
    let numbersIndex = 0
    let digitIndex = 0
    let tempNumbers = this.numbers
    tempNumbers[0] = (tempNumbers[0] << 4) >>> 4

    if (enterIndex < 0) {
      numbersIndex = Math.floor(enterIndex / 7) + tempNumbers.length
      digitIndex = 6 + ((enterIndex + 1) % 7)
    } else {
      numbersIndex = Math.floor(enterIndex / 7)
      digitIndex = enterIndex % 7
    } 

    let pos = 28 - (digitIndex * 4)
    let mask = tempNumbers[numbersIndex] & this.#createMask(4, pos)
    console.log(mask)

    return mask >> pos - 4    
  }
  
  add(summand) {
    let bcdA_Arr = this.numbers
    let bcdB_Arr = this.#decimalToBcd(BigInt(summand)) 

    let a_length = bcdA_Arr.length
    let b_length = bcdB_Arr.length
    let a_i_last = bcdA_Arr.length - 1
    let b_i_last = bcdB_Arr.length - 1
    let main_i = a_length >= b_length ? a_length - 1 : b_length - 1

    let result = [0]
    let tempSumShift = 4

    while (main_i >= 0) {                                   // Цикл итераций по ячейкам самого длинного из массивов А и В
      let bcdA = bcdA_Arr[a_i_last] << 4 >> 4               // Убираем биты заполнености
      let bcdB = bcdB_Arr[b_i_last] << 4 >> 4

      while ((bcdA !== 0) || (bcdB !== 0)) {
        const maskA = bcdA & this.#createMask(4, 4)         // Берем последние 4 бита (цифру) от слагаемого А
        const maskB = bcdB & this.#createMask(4, 4)         // Берем последние 4 бита (цифру) от слагаемого B

        let tempSum = (this.binaryAddition(maskA, maskB))   // Промежуточная сумма последних цифр слагаемых

        if(tempSum > 9) {                                   // Если промежуточная сумма последних цифр слагаемых > 9 прибавлем 6 (дополнение до 9)
          tempSum = this.binaryAddition(tempSum, 6)
        }

        tempSum <<= tempSumShift - 4                        // Cдвигаем промежуточную сумму в нужный разряд
        result[0] = this.binaryAddition(result[0], tempSum) // складываем промежуточную сумму с результатом прошлой итерации
        bcdA >>>= 4                                         // Cдвигаем биты слагаемого А чтобы цифры из следующего разряда оказались последними
        bcdB >>>= 4                                         // Cдвигаем биты слагаемого B чтобы цифры из следующего разряда оказались последними
        tempSumShift += 4                                   // Увеличаваем сдвиг (разряд) для промежуточной суммы
      }
      
      main_i--
      a_i_last--
      b_i_last--
    }
  
    result.forEach((bcd, i) => console.log(binary(bcd), `result [${i}]`))
    this.numbers = result
    return result
  }
}

const n = new BCD(-168n);


// n.numbers.forEach((bcd, i) =>  console.log(binary(bcd), `numbers [${i}]`))

// console.log(binary64(n.valueOf()), 'valueOf')

// console.log(binary(n.get(0))) Есть баг, не работает с неполными ячейками

// n.add(1234)
