const { binary, binary64 } = require('./helpers')


class BCD {
  numbers = [];
  
  constructor(num) {
    this.isNegative = false
    this.bcdValue = 0
    this.num = num
    
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

  #bcdToDecimal(bcdNum) {
    let tempBcd = bcdNum
    let result = 0
    let power = 0

    while (tempBcd !== 0) {
    const lastDigit = tempBcd & this.#createMask(4, 4)
    result += lastDigit * (10 ** power)
    power++
    tempBcd >>>= 4
    }

    return result
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
    let res = BigInt(this.numbers[0])
    let overBit = res & BigInt(this.#createMask(1, 31))                     // находим бит заполнености
    res ^= overBit                                                          // Убираем бит заполнености
     
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

  get(enterIndex) {
    let numbersIndex = 0
    let digitIndex = 0

    if (enterIndex < 0) {
      numbersIndex = Math.floor(enterIndex / 7) + n.numbers.length
      digitIndex = 6 + ((enterIndex + 1) % 7)
    } else {
      numbersIndex = Math.floor(enterIndex / 7)
      digitIndex = enterIndex % 7
    } 

    let pos = 28 - (digitIndex * 4)
    let mask = this.numbers[numbersIndex] & this.#createMask(4, pos)

    return mask >> pos - 4    
  }
  
  add(summand) {
    let bcdA_Arr = this.numbers
    let bcdB_Arr = this.#decimalToBcd(summand) // summand
    bcdA_Arr.forEach((bcd, index)=> console.log(binary(bcd), `BCD_A_ARR_[${index}]`))
    bcdB_Arr.forEach((bcd, index)=> console.log(binary(bcd), `BCD_B_ARR_[${index}]`))
    console.log('----------------')


    let a_length = bcdA_Arr.length
    let b_length = bcdB_Arr.length
    let a_i_last = bcdA_Arr.length - 1
    let b_i_last = bcdB_Arr.length - 1
    let main_i = a_length >= b_length ? a_length - 1 : b_length - 1

    let sum = []
    let tempSumShift = 4

    while (main_i >= 0) { // Цикл итераций по ячейкам самого длинного из массивов А и В
      let bcdA = bcdA_Arr[a_i_last]
      let bcdB = bcdB_Arr[b_i_last]

      

      while ((bcdA !== 0) || (bcdB !== 0)) {

        console.log(binary(bcdA), "BEFORE MASK A")
        const maskA = bcdA & this.#createMask(4, 4) // Берем последние 4 бита (цифру) от слагаемого А
        console.log(binary(maskA), "AFTER MASK A")

        console.log(binary(bcdB), "BEFORE MASK B")
        const maskB = bcdB & this.#createMask(4, 4) // Берем последние 4 бита (цифру) от слагаемого B
        console.log(binary(maskB), "AFTER MASK B")

        let tempSum = (this.binaryAddition(maskA, maskB)) // Промежуточная сумма последних цифр слагаемых
        console.log(binary(tempSum), "TEMP SUM")

        if(tempSum > 9) { // Если промежуточная сумма последних цифр слагаемых > 9 прибавлем 6 (дополнение до 9)
          tempSum = this.binaryAddition(tempSum, 6)
          console.log(binary(tempSum), "TEMP SUM > 6")
        }

        tempSum <<= tempSumShift - 4 // Cдвигаем промежуточную сумму в нужный разряд
        console.log(binary(tempSum), "TEMP SUM << 4")
        sum = this.binaryAddition(sum, tempSum) // складываем промежуточную сумму с результатом прошлой итерации
        console.log(binary(sum), "------SUM + TEMP_SUM--------")
        bcdA >>>= 4 // Cдвигаем биты слагаемого А чтобы цифры из следующего разряда оказались последними
        console.log(binary(bcdA), "BCD A >>> 4")
        bcdB >>>= 4 // Cдвигаем биты слагаемого B чтобы цифры из следующего разряда оказались последними
        console.log(binary(bcdB), "BCD B >>> 4")
        tempSumShift += 4 // Увеличаваем сдвиг (разряд) для промежуточной суммы
      }
      
      main_i--
      a_i_last--
      b_i_last--
    }

    

    console.log(binary(sum))
    // let bcdA = this.bcdValue
    // let bcdB = this.#decimalToBcd(summand)

    // console.log(binary(bcdA), "A")
    // console.log(binary(bcdB), "B")

    // if (bcdA === 0 || bcdB === 0) {
    //   this.bcdValue = bcdA || bcdB
    //   // console.log(binary(this.bcdValue), 'RESULT')
    //   return this.bcdValue
    // }

    // let tempSumShift = 4    
    // let sum = 0

    // while ((bcdA !== 0) || (bcdB !== 0)) {

    //   // console.log(binary(bcdA), "BEFORE MASK A")
    //   const maskA = bcdA & this.#createMask(4, 4) // Берем последние 4 бита (цифру) от слагаемого А
    //   // console.log(binary(maskA), "AFTER MASK A")

    //   // console.log(binary(bcdB), "BEFORE MASK B")
    //   const maskB = bcdB & this.#createMask(4, 4) // Берем последние 4 бита (цифру) от слагаемого B
    //   // console.log(binary(maskB), "AFTER MASK B")

    //   let tempSum = (this.binaryAddition(maskA, maskB)) // Промежуточная сумма последних цифр слагаемых
    //   // console.log(binary(tempSum), "TEMP SUM")

    //   if(tempSum > 9) { // Если промежуточная сумма последних цифр слагаемых > 9 прибавлем 6 (дополнение до 9)
    //     tempSum = this.binaryAddition(tempSum, 6)
    //     // console.log(binary(tempSum), "TEMP SUM > 6")
    //   }

    //   tempSum <<= tempSumShift - 4 // Cдвигаем промежуточную сумму в нужный разряд
    //   // console.log(binary(tempSum), "TEMP SUM << 4")
    //   sum = this.binaryAddition(sum, tempSum) // складываем промежуточную сумму с результатом прошлой итерации
    //   // console.log(binary(sum), "SUM + TEMP_SUM")
    //   bcdA >>>= 4 // Cдвигаем биты слагаемого А чтобы цифры из следующего разряда оказались последними
    //   // console.log(binary(bcdA), "BCD A >>> 4")
    //   bcdB >>>= 4 // Cдвигаем биты слагаемого B чтобы цифры из следующего разряда оказались последними
    //   // console.log(binary(bcdB), "BCD B >>> 4")
    //   tempSumShift += 4 // Увеличаваем сдвиг (разряд) для промежуточной суммы

    //   // console.log((bcdA !== 0) && (bcdB !== 0), "WHILE COND")
    // }

    // console.log(binary(sum), 'RESULT')
    
    // this.bcdValue = sum
    // return sum
  }

  substract(substracted) {
    let subs = 99 - substracted
    let sum = this.add(subs)
    console.log(binary(sum))
  }

  multiply(multptiplier) {
    if (multptiplier === 0 || this.bcdValue === 0) {
      this.bcdValue = 0
      return 0
    }
    let decimalValue = this.#bcdToDecimal(this.bcdValue)
    let iterator = multptiplier - 1
    let result = 0
  
    while (iterator > 0) {
      result = this.add(decimalValue)
      iterator--
    }

    this.bcdValue = result
    return result
  }

  shiftNumbers(arr) {
    arr.forEach((bcd, i) => console.log(binary(bcd), `[${i}]`))

    
  }

}

const n = new BCD(1234567_1234567_1234567n);

n.numbers.forEach((bcd, i) =>  console.log(binary(bcd), `numbers [${i}]`))

console.log(binary(n.get(-21)))

// console.log(binary64(n.valueOf()), 'valueOf')


// new BCD(1234567_1234567n);
// 0001_0010_0011_0100_0101_0110_0111_0001_0010_0011_0100_0101_0110_0111
// 0001_0010_0011_0100_0101_0110_0111_0001_0010_0011_0100_0101_0110_0111

// 0b1100_1000_0111_0110_0101_0100_0011_0010

// -1110111100010011010101111001110
// -11101111000100110101011110011010111100010011010101111001110

// let a = 0b0001_0010_0011_0100

// console.log(binary(a))
// console.log(binary(Math.floor(a / 2)), 'Math.floor(a / 2)')
// console.log(binary(a >> 2), 'a >> 2')





