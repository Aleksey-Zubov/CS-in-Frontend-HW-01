class ListItem<T> {
  value: T;

  prev: ListItem<T> | null = null;
  next: ListItem<T> | null = null;
  
  constructor(value: T, {prev, next}: {prev?: ListItem<T> | null, next?: ListItem<T> | null}) {
    this.value = value;

    if (prev && prev !== null) {
      this.prev = prev;
      prev.next = this;
    }

    if (next && next !== null) {
      this.next = next;
      next.prev = this;
    }
  }
}

class LinkedList<T> {
  first: ListItem<T> | null = null;
  last: ListItem<T> | null = null;

  pushLeft(value: T) {
    const {first} = this;
    this.first = new ListItem(value, {next: first});

    if (this.last === null) {
      this.last = this.first
    }
  }

  popLeft() {
    const {first, last} = this;

    if (first === null || first === last) {
      this.first = null
      this.last = null
    } else {
      this.first = first.next
      this.first!.prev = null
    }

    return first?.value
  }

  pushRight(value: T) {
    const {last} = this;
    this.last = new ListItem(value, {prev: last})

    if (this.first === null) {
      this.first = this.last
    }
  }

  popRight() {
    const {first, last} = this;

    if (last === null || last === first) {
      this.first = null;
      this.last = null;
    } else {
      this.last === last.prev
      this.last!.next === null
    }

    return last?.value
  }
}

const list = new LinkedList<number>();

list.pushRight(1);
list.pushLeft(0);
list.pushRight(2);
list.pushRight(3);
list.pushRight(4);
list.pushRight(5);

list.popLeft();


console.log(list.first)
console.log(list.last)