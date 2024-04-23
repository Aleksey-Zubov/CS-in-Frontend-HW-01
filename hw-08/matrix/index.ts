type MatrixTypes = 
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

type TypedArray<T> = new (capacity: number) => T;

class Matrix<T extends MatrixTypes> {
  readonly dimension: number[];
  mapping: number[];

  array: T;
  readonly TypedArray: TypedArray<T>
  
  get buffer() {
    return this.array.buffer
  }

  constructor(TypedArray: TypedArray<T>, ...dimension: number[]) {
    if (!dimension.every((value) => value > 1 || value % 1 === 0)) {
			throw new TypeError('Размер матрицы может быть только положительным целым числом');
		}
    this.dimension = dimension;

    // в mapping храним коэффициенты для расчета индекса в одномерном массиве для соответвующего многомерного индекса
    // [1, xSize, xSize * ySize, xSize * ySize * zSize и так далее...]
    
    this.mapping = dimension.map((_, i) => {
      return i === 0 ? 1 : dimension.slice(0, i).reduce((a, b) => a * b, 1);
    })

    this.TypedArray = TypedArray;
    this.array = new TypedArray(dimension.reduce((r, v) => r * v, 1));
  }

  changeMapping(fn: (mapping: this['mapping']) => this['mapping']) {
    this.mapping = fn(this.mapping)
  }

  get(...coords: number[]): T extends BigUint64Array | BigInt64Array ? bigint : number {
    const idx = this.#getIndex(coords);
    return this.array[idx] as any;
  }

  set(...args: [...number[], T extends BigUint64Array | BigInt64Array ? bigint : number]) {
		const idx = this.#getIndex(args.slice(0, -1) as number[]);
		this.array[idx] = args.at(-1) as any;
	}

  *values(): IterableIterator<T extends BigUint64Array | BigInt64Array ? bigint : number> {
		for (const value of this.array) {
			yield value as any;
		}
	}

  #getIndex(coords: number[]): number {
    if (coords.length !== this.dimension.length) {
      throw new TypeError('Координты не соответствуют размерности матрицы')
    }
    // [x + y * xSize + z * xSize * ySize + t * xSize * ySize * zSize и так далее...]
    return coords.reduce((res, value, i) => res + value * this.dimension[i], 0)
  }
}

const matrix = new Matrix(Int32Array, 3, 3, 3)

matrix.set(0,0,0, 1)
matrix.set(1,0,0, 2)
matrix.set(2,0,0, 3)

matrix.set(0,1,0, 4)
matrix.set(1,1,0, 5)
matrix.set(2,1,0, 6)

matrix.set(0,2,0, 7)
matrix.set(1,2,0, 8)
matrix.set(2,2,0, 9)

//------------

matrix.set(0,0,2, 21)
matrix.set(1,0,2, 22)
matrix.set(2,0,2, 23)

matrix.set(0,1,2, 24)
matrix.set(1,1,2, 25)
matrix.set(2,1,2, 26)

matrix.set(0,2,2, 27)
matrix.set(1,2,2, 28)
matrix.set(2,2,2, 29)
