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
    let decimalA = this.num
    let decimalB = summand
    // console.log(decimalA, 'original A')
    // console.log(decimalB, 'original B')
    let bcdA = this.#decimalToBcd(decimalA)
    let bcdB = this.#decimalToBcd(decimalB)
    // console.log(binary(bcdA), 'BCD A')
    // console.log(binary(bcdB), 'BCD B')

    let placeForMask = 4
    let sum = 0

    while (decimalA !== 0 && decimalB !== 0) {
      const remainingA = (bcdA & this.#createMask(4, placeForMask)) >>> (placeForMask - 4)
      const remainingB = (bcdB & this.#createMask(4, placeForMask)) >>> (placeForMask - 4)

      let tempSum = (this.binaryAddition(remainingA, remainingB))

      if(tempSum > 9) {
        tempSum = this.binaryAddition(tempSum, 6)
      }

      tempSum <<= placeForMask - 4
      sum = this.binaryAddition(sum, tempSum)
      placeForMask += 4

      decimalA = Math.floor(decimalA / 10)
      decimalB = Math.floor(decimalB / 10)
    }
    
    this.value = sum
    return this.value
  }

  substract(substracted) {
    if (substracted < 0) {
      return this.add(substracted * -1)
    }
  }

  multiply(multptiplier) {
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

const n = new BCD(10);
n.add(20)
// n.add(30)

console.log(binary(n.valueOf()))