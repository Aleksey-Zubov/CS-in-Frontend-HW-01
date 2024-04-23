type VectorTypes = 
Uint8Array |
Uint8ClampedArray |
Int8Array |
Uint16Array |
Int16Array |
Uint32Array |
Int32Array |
Float32Array |
Float64Array |
BigUint64Array |
BigInt64Array;

type ConstructorTypes = 
Uint8ArrayConstructor |
Int8ArrayConstructor|
Uint8ClampedArrayConstructor |
Uint16ArrayConstructor |
Int16ArrayConstructor |
Uint32ArrayConstructor |
Int32ArrayConstructor |
Float32ArrayConstructor |
Float64ArrayConstructor |
BigUint64ArrayConstructor |
BigInt64ArrayConstructor

class Vector {
  capacity: number;
  length: number;
  buffer: VectorTypes;
  TypedArray: ConstructorTypes

  constructor(TypedArray: ConstructorTypes, capacity: number) {
    this.capacity = capacity;
    this.length = 0;
    this.TypedArray = TypedArray;
 
    this.buffer = new this.TypedArray(capacity);
  }

  push(element: number) {
    if (this.length === this.capacity) {
      const prevBuffer = this.buffer
      const newCap = this.capacity * 2
      this.buffer = new this.TypedArray(newCap)

      prevBuffer.forEach((elem, idx) => this.buffer[idx] = elem)

      this.capacity = newCap
    }

    this.buffer[this.length] = element
    this.length++
  }

  pop() {
    const lastElem = this.buffer[this.length - 1]
    this.buffer[this.length - 1] = 0
    return lastElem
  }

  shrinkToFit() {
    let newCap = 0

    this.buffer = this.buffer.filter((elem) => {
      if (elem !== 0 ) {
        newCap++
        return elem
      }
    })

    this.capacity = newCap
    this.length = newCap
  }

  *values() {
    for (let value of this.buffer) {
      yield value
    }
  }
}

const vector = new Vector(Uint8Array, 5)

vector.push(1)
vector.push(2)
vector.push(3)
vector.push(4)

console.log(vector.buffer)

const i = vector.values()

console.log(i.next())
console.log(i.next())
console.log(i.next())
console.log(i.next())
