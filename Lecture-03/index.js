function* generateFizzBuzz() {
  let i = 1n
  while(true) {
    if (i % 3n === 0n && i % 5n === 0n) {
      yield console.log('FizzBuzz')
    } else if (i % 3n === 0n) {
      yield console.log('Fizz')
    } else if (i % 5n === 0n) {
      yield console.log('Buzz')
    } else {
      yield console.log(i)
    }
    i++
  }
}

const myFizzBuzz = generateFizzBuzz()

myFizzBuzz.next() // 1n
myFizzBuzz.next() // 2n
myFizzBuzz.next() // Fizz
myFizzBuzz.next() // 4n
myFizzBuzz.next() // Buzz
myFizzBuzz.next() // Fizz