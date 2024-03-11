const instructions = {
  'SET A': 0,
  'PRINT A': 1,
  'IFN A': 2,
  'RET': 3,
  'DEC A': 4,
  'JMP': 5
};

const program = [
  // Ставим значения аккумулятора
  instructions['SET A'],                 //step 0
  // В 10
  10,                                    // step 1
  
  // Выводим значение на экран
  instructions['PRINT A'],               // step 2
  
  // Если A равно 0
  instructions['IFN A'],                 // step 3
  
  // Программа завершается
  instructions['RET'],                   // step 4
  
  // И возвращает 0
  0,                                     // step 5
  
  // Уменьшаем A на 1
  instructions['DEC A'],                 // step 6
  
  // Устанавливаем курсор выполняемой инструкции
  instructions['JMP'],                   // step 7
  
  // В значение 2
  2                                      // step 8
];

function execute(program) {
  let step = 0;
  let acc = 0;

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
        if (acc === 0) {
          step++;
        } else {
          step += 3
        }
        break;
  
      case instructions['RET']:
        return 0;
  
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
