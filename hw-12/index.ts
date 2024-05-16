const persons = [
  {age: 12, name: 'Bob'},
  {age: 32, name: 'Bob'},
  {age: 42, name: 'Ben'},
  {age: 42, name: 'Jack'},
  {age: 42, name: 'Sam'},
  {age: 56, name: 'Bill'}
];


function indexOf(arr: any[], cb: any) {
  let first = 0;
  let last = arr.length -1
  let position = -1
  let middle

  while (first <= last) {
    middle = Math.floor((first + last) / 2)
    if (cb(arr[middle]) === 0) {
      position = middle
      last = middle - 1      
    } else if (cb(arr[middle]) < 0) {
      first = middle + 1
    } else if (cb(arr[middle]) > 0) {
      last = middle - 1
    }
  }
  console.log(position)
  return position
}

function lastIndexOf(arr: any[], cb: any) {
  let first = 0;
  let last = arr.length -1
  let position = -1
  let middle

  while (first <= last) {
    middle = Math.floor((first + last) / 2)
    if (cb(arr[middle]) === 0) {
      position = middle
      first = middle + 1      
    } else if (cb(arr[middle]) < 0) {
      first = middle + 1
    } else if (cb(arr[middle]) > 0) {
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

