class HashMap {
  bufferCap: number
  buffer: any[]

  constructor(bufferCap: number) {
    this.bufferCap = bufferCap,
    this.buffer = new Array(bufferCap)
  }

  get(key: any) {
    const values = this.buffer[this.#getHash(key)]
    return values.find((elem: any[]) => elem[0] === key)[1]
  }

  set(key: any, value: any) {
    const hash = this.#getHash(key)
    this.buffer[hash] ? this.buffer[hash].push([key, value]) : this.buffer[hash] = [[key, value]]
  }

  has(key: any) {
    const values = this.buffer[this.#getHash(key)]
    return !!values && !!values.length
  }

  delete(key: any) {
    let values = this.buffer[this.#getHash(key)]
    let deletedValue
    values = values.filter(([k, v]: any) => {
      if (k === key) {
        deletedValue = v
      }
      return k !== key 
    })
    if (!values.length) delete this.buffer[this.#getHash(key)]
    return deletedValue
  }

  #getHash(key: any) {
    const prime = 0x811C9DC5;
    let hash = prime;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0) % this.bufferCap
  }
}

const map = new HashMap(120)

map.set('foo', 1)
map.set(42, 10)
console.log(map.get('foo'))
console.log(map.has('foo'))
console.log(map.delete('foo'))
console.log(map.has('foo'))
