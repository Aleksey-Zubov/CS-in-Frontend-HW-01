function fizzbuzz(start = 1n) {
  let currentN = start;

  return {
    next() {
      let output = ''
      if (currentN % 3n === 0n) output += 'Fizz'
      if (currentN % 5n === 0n) output += 'Buzz'

      if (output === '') output = currentN

      currentN++

      return { value: output, done: false }
    }
  };
}

const myFizzBuzz = fizzbuzz();

myFizzBuzz.next() // 1n
myFizzBuzz.next() // 2n
myFizzBuzz.next() // Fizz
myFizzBuzz.next() // 4n
myFizzBuzz.next() // Buzz
myFizzBuzz.next() // Fizz