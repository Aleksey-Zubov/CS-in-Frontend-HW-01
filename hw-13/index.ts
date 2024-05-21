class Matrix {
  array: Uint8Array
  rows: number
  cols: number

  constructor(TypedArray: Uint8ArrayConstructor, rows: number, cols: number) {
    this.rows = rows
    this.cols = cols
    this.array = new TypedArray(rows * cols)
  }

  get(row: number, col: number) {
    return this.array[this.#getIndex(row, col)]
  }

  set(row: number, col: number, value: number) {
    return this.array[this.#getIndex(row, col)] = value
  }

  generateValues() {
    this.array = this.array.map((_) => Math.floor(Math.random() * 10))
  }

  #getIndex(row: number, col: number) {
    return row * this.cols + col
  }
}


class Graph {
  adjacencyMatrix: Matrix

  constructor(adjacencyMatrix: Matrix) {
    this.adjacencyMatrix = adjacencyMatrix
  }

  checkAdjacency(node1: number, node2:number) {
    return this.adjacencyMatrix.get(node1, node2) != 0
  }

  createEdge(node1: number, node2:number, weight?: number) {
    const w = weight || 1
    adjacencyMatrix.set(node1, node2, w)
    adjacencyMatrix.set(node2, node1, w)
  }

  removeEdge(node1: number, node2:number) {
    adjacencyMatrix.set(node1, node2, 0)
    adjacencyMatrix.set(node2, node1, 0)
  }

  createArc(node1: number, node2:number, weight?: number) {
    const w = weight || 1
    adjacencyMatrix.set(node1, node2, w)
  }

  removeArc(node1: number, node2:number) {
    adjacencyMatrix.set(node1, node2, 0)
  }

}

const adjacencyMatrix = new Matrix(Uint8Array, 10, 10);

adjacencyMatrix.generateValues()

const graph = new Graph(adjacencyMatrix)

console.log(graph.adjacencyMatrix)

graph.createEdge(0,0, 9)

console.log(graph.adjacencyMatrix)
