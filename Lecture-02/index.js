const instructions = {
  'SET A': 0,
  'PRINT A': 1,
  'IFN A': 2,
  'RET': 3,
  'DEC A': 4,
  'JMP': 5
};

const program = [
  instructions['SET A'],   // Ставим значения аккумулятора                 // step 0
  10,                      // В 10                                         // step 1  
  instructions['PRINT A'], // Выводим значение на экран                    // step 2 
  instructions['IFN A'],   // Если A равно 0                               // step 3 
  instructions['RET'],     // Программа завершается                        // step 4
  0,                       // И возвращает 0                               // step 5
  instructions['DEC A'],   // Уменьшаем A на 1                             // step 6
  instructions['JMP'],     // Устанавливаем курсор выполняемой инструкции  // step 7
  2                        // В значение 2                                 // step 8
];

function execute(program) {
  let step = 0;
  let acc = 0;
  let skipRet = false

  while(true) {
    switch(program[step]) {
      case instructions['SET A']:
        acc = program[step + 1];
        step += 2;
        break;
  
      case instructions['PRINT A']:
        console.log(acc);
        step++;
        break;
  
      case instructions['IFN A']:
        acc !== 0 && (skipRet = true)
        step++
        break;
  
      case instructions['RET']:
        if (!skipRet) {
          return program[step + 1];
        }
        step +=2
        skipRet = false
        break;

  
      case instructions['DEC A']:
        acc--;
        step++;
        break;
  
      case instructions['JMP']:
        step = program[step + 1];
        break;
    }
  }
}

execute(program);
