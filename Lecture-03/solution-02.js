function fizzbuzz(start = 1n) {
  return {
    currentN: start,
    next() {
      if (this.currentN % 15n === 0n) {
        console.log('FizzBuzz');
        return { value: this.currentN++, done: false };
      } else if (this.currentN % 3n === 0n) {
        console.log('Fizz');
        return { value: this.currentN++, done: false };
      } else if (this.currentN % 5n === 0n) {
        console.log('Buzz');
        return { value: this.currentN++, done: false };
      } else {
        console.log(this.currentN);
        return { value: this.currentN++, done: false };
      }
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