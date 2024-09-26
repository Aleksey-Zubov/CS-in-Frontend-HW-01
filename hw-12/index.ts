const persons = [
  {age: 12, name: 'Bob'},
  {age: 32, name: 'Bob'},
  {age: 42, name: 'Ben'},
  {age: 42, name: 'Jack'},
  {age: 42, name: 'Sam'},
  {age: 56, name: 'Bill'}
];


function indexOf(arr: any[], comparator: any) {
  let first = 0;
  let last = arr.length -1
  let position = -1

  while (first <= last) {
   const middle = Math.floor((first + last) / 2)
   const comp = comparator(arr[middle])

    if (comp >= 0) {
      last = middle - 1

      if (comp === 0) {
        position = middle
      }

    } else {
      first = middle + 1
    }
  }
  console.log(position)
  return position
}

function lastIndexOf(arr: any[], comparator: Function) {
  let first = 0;
  let last = arr.length -1
  let position = -1

  while (first <= last) {
    const middle = Math.floor((first + last) / 2)
    const comp = comparator(arr[middle])

    if (comp <= 0) {
      first = middle + 1

      if (comp === 0) {
        position = middle
      }
    } else {
      last = middle - 1
    }
  }
  console.log(position)
  return position
}

indexOf(persons, ({age}: any) => age - 12);
indexOf(persons, ({age}: any) => age - 42);
indexOf(persons, ({age}: any) => age - 56);
indexOf(persons, ({age}: any) => age - 82);


lastIndexOf(persons, ({age}: any) => age - 12);
lastIndexOf(persons, ({age}: any) => age - 42);
lastIndexOf(persons, ({age}: any) => age - 56);
lastIndexOf(persons, ({age}: any) => age - 82);

