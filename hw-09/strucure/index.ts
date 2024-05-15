class Structure {
  struct: any
  constructor(struct: any) {
    this.struct = struct
  }
}

const s = new Structure({
  singing: 7,
  dancing: 7,
  fighting: 7,
})
