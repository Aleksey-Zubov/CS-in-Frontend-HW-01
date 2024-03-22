const { binary } = require('./helpers')


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

      if (i !== 0 && i % 7 === 0) { // На каждой 7ой итерации простовляем бит заполнености, увеличиваем индекс последней ячейки и добавляем ячейку
        let overBit = 1 << 30        
        tempArr[numbersCell] |= overBit
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
      } else {
        shiftFotLastCell += 4
      }
   
      n = ~~(n / 10n)
      i++
    }

    this.numbers = tempArr
    return tempArr
  }

  updateFullCells(cellBcd, newBcd) {
    
    newBcd <<= 24
    cellBcd |= cellInfo
    cellBcd |= newBcd
 
   return cellBcd
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

    if (this.numbers.length <= 1) return res

    for (let i = 1; i < this.numbers.length; i++) { // Здесь работаем по алгоритму представления числа в двоичном виде чтобы узнать на сколько бит нужно сдвинуть число из первой ячейки numbers
      let tempNum = this.numbers[i]                 // Число из которого будем доставать биты
        while (tempNum > 0) {
          res <<= 1n                                // Сдвигаем двоичное число из первой ячейки
          tempNum = Math.floor(tempNum / 2)         // Делю число на 2 согласно алгоритму
        }
        res = res ^ BigInt(this.numbers[i])         // С помощью XOR добавляю биты к числу из первой ячейки
    }
    return res
  }

  get(enterIndex) {}
  
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

n.numbers.forEach((bcd) =>  console.log(binary(bcd)))

// n.shiftNumbers(n.numbers)

// n.add(12345678)




// console.log(n.valueOf())
// console.log(n.valueOf().toString(2))
// console.log(0b0000_0001_0010_0011_0100_0101_0110_0111_1000_1001_0000)
// console.log(78187493520..toString(2))

// new BCD(123456789) 
// numbers должен содержать число в фомате BCD разбитое по 7 знаков:
// 0b0000_0001_0010_0011_0100_0101_0110_0111 numbers[0]
// 0b0000_0000_0000_0000_0000_0000_1000_1001 numbers[1]
// valueOf должен возвращать склейку числа bcd из всех ячеек которые занимает:
// 0b0000_0001_0010_0011_0100_0101_0110_0111_1000_1001 --> 4886718345
