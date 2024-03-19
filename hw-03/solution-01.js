function* generateFizzBuzz() {
  let i = 1n
  while(true) {
    if (i % 15n === 0n) {
      console.log('FizzBuzz')
      yield'FizzBuzz'
    } else if (i % 3n === 0n) {
      console.log('Fizz')
      yield 'Fizz'
    } else if (i % 5n === 0n) {
      console.log('Buzz')
      yield 'Buzz'
    } else {
      console.log(i)
      yield i
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