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

class Dequeue {
  buffer: VectorTypes;
  length: number;
  first: number | null;
  last: number | null;

  constructor(TypedArray: ConstructorTypes, capacity: number) {
    this.buffer = new TypedArray(capacity)
    this.length = 0;
    this.first = null
    this.last = null
  }

  pushRight(value: number) {
    if (this.last === null) {
      this.last = Math.floor(this.buffer.length / 2)
      this.first = this.last
      this.buffer[this.last] = value
      return
    }
   this.last++
   this.buffer[this.last] = value
  }

  pushLeft(value: number) {
    if (this.first === null) {
      this.first = Math.floor(this.buffer.length / 2)
      this.last = this.first
      this.buffer[this.first] = value
      return
    }

    this.first--
    this.buffer[this.first] = value
  }

  popRight() {
    if (this.last === null) {
      return
    }
   return this.buffer[this.last--]
  }

  popLeft() {
    if (this.first === null) {
      return
    }
   return this.buffer[this.first++]
  }
}

const d = new Dequeue(Uint8Array, 5)
d.pushRight(3)
d.pushLeft(2)
d.pushRight(4)
console.log(d.buffer)
console.log(d.popRight())