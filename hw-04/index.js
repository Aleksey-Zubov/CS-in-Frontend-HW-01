const { binary } = require('./helpers')


class BCD {
  numbers = [];
  
  constructor(num) {
    this.isNegative = false
    this.value = 0
    this.num = num
    this.lengthOfNumber = Math.floor(Math.log10(Math.abs(this.num))) + 1
    
    this.#decimalToBcd(num)
  }

  #decimalToBcd(num) {
    if (num < 0) {
      num *= -1
      this.isNegative = true
    }
      
    const arrayOfDigits = Array.from(String(num), Number);
    this.value = arrayOfDigits.reduce((acc, currentDigit) => {
      const digit = this.isNegative ? 9 - currentDigit : currentDigit
      return (acc << 4) | digit
    }, 0);

    return this.value
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
    return this.value
  }

  get(index) {
    let idx = index >= 0 ? index : this.lengthOfNumber + index
    const pos = 4 * (this.lengthOfNumber - idx)
    const mask = this.#createMask(4, pos)
    const rightShft = pos - 4
    return (this.value & mask) >>> rightShft
  }
  
  add(summand) {   
    let bcdA = this.value
    let bcdB = this.#decimalToBcd(summand)

    if (bcdA === 0 || bcdB === 0) {
      this.value = bcdA || bcdB
      console.log(binary(this.value), 'RESULT')
      return this.value
    }

    let tempSumShift = 4    
    let sum = 0

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
      console.log(binary(sum), "SUM + TEMP_SUM")
      bcdA >>>= 4 // Cдвигаем биты слагаемого А чтобы цифры из следующего разряда оказались последними
      console.log(binary(bcdA), "BCD A >>> 4")
      bcdB >>>= 4 // Cдвигаем биты слагаемого B чтобы цифры из следующего разряда оказались последними
      console.log(binary(bcdB), "BCD B >>> 4")
      tempSumShift += 4 // Увеличаваем сдвиг (разряд) для промежуточной суммы

      console.log((bcdA !== 0) && (bcdB !== 0), "WHILE COND")
    }

    console.log(binary(sum), 'RESULT')
    
    this.value = sum
    return this.value
  }

  substract(substracted) {
    if (substracted < 0) {
      return this.add(substracted * -1)
    }
  }

  multiply(multptiplier) {
    if (multptiplier === 0) {
      this.value = 0
      return this.value
    }
 
    let result = this.value
    let iterator = multptiplier - 1

    while (iterator > 0) {
      result = this.binaryAddition(this.value, result)
      iterator--
    }

    this.value = result
    return this.value
  }

}

const n = new BCD(3);

n.multiply(4)




console.log(binary(n.valueOf()))
