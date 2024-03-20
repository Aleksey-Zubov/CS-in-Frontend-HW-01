const { binary } = require('./helpers')


class BCD {
  numbers = [];
  
  constructor(num) {
    this.isNegative = false
    this.bcdValue = 0
    this.num = num
    this.lengthOfNumber = Math.floor(Math.log10(Math.abs(this.num))) + 1
    
    this.#decimalToBcd(num)
  }

  #decimalToBcd(num) {
    if (num < 0) {
      num *= -1
      this.isNegative = true
    }
    let bcdNum = 0
    let shiftForRemaining = 0
    let i = 1

    while (num > 0) {
      let remaining = this.isNegative ? 9 - (num % 10) : num % 10
      remaining <<= shiftForRemaining
      bcdNum |= remaining
      num = Math.floor(num / 10)     
      shiftForRemaining += 4
      i++
    }

    
    this.bcdValue = bcdNum
    return bcdNum
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


    return this.bcdValue
  }

  get(index) {
    let idx = index >= 0 ? index : this.lengthOfNumber + index
    const pos = 4 * (this.lengthOfNumber - idx)
    const mask = this.#createMask(4, pos)
    const rightShft = pos - 4
    return (this.bcdValue & mask) >>> rightShft
  }
  
  add(summand) {
    let bcdA = this.bcdValue
    let bcdB = this.#decimalToBcd(summand)

    // console.log(binary(bcdA), "A")
    // console.log(binary(bcdB), "B")

    if (bcdA === 0 || bcdB === 0) {
      this.bcdValue = bcdA || bcdB
      // console.log(binary(this.bcdValue), 'RESULT')
      return this.bcdValue
    }

    let tempSumShift = 4    
    let sum = 0

    while ((bcdA !== 0) || (bcdB !== 0)) {

      // console.log(binary(bcdA), "BEFORE MASK A")
      const maskA = bcdA & this.#createMask(4, 4) // Берем последние 4 бита (цифру) от слагаемого А
      // console.log(binary(maskA), "AFTER MASK A")

      // console.log(binary(bcdB), "BEFORE MASK B")
      const maskB = bcdB & this.#createMask(4, 4) // Берем последние 4 бита (цифру) от слагаемого B
      // console.log(binary(maskB), "AFTER MASK B")

      let tempSum = (this.binaryAddition(maskA, maskB)) // Промежуточная сумма последних цифр слагаемых
      // console.log(binary(tempSum), "TEMP SUM")

      if(tempSum > 9) { // Если промежуточная сумма последних цифр слагаемых > 9 прибавлем 6 (дополнение до 9)
        tempSum = this.binaryAddition(tempSum, 6)
        // console.log(binary(tempSum), "TEMP SUM > 6")
      }

      tempSum <<= tempSumShift - 4 // Cдвигаем промежуточную сумму в нужный разряд
      // console.log(binary(tempSum), "TEMP SUM << 4")
      sum = this.binaryAddition(sum, tempSum) // складываем промежуточную сумму с результатом прошлой итерации
      // console.log(binary(sum), "SUM + TEMP_SUM")
      bcdA >>>= 4 // Cдвигаем биты слагаемого А чтобы цифры из следующего разряда оказались последними
      // console.log(binary(bcdA), "BCD A >>> 4")
      bcdB >>>= 4 // Cдвигаем биты слагаемого B чтобы цифры из следующего разряда оказались последними
      // console.log(binary(bcdB), "BCD B >>> 4")
      tempSumShift += 4 // Увеличаваем сдвиг (разряд) для промежуточной суммы

      // console.log((bcdA !== 0) && (bcdB !== 0), "WHILE COND")
    }

    // console.log(binary(sum), 'RESULT')
    
    this.bcdValue = sum
    return sum
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

}

const n = new BCD(1234567);

console.log(binary(n.valueOf()))

