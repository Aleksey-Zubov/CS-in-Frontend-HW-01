exports.binary = function(num)  {
  const str = new Uint32Array([num])[0].toString(2);
  return '0b' + str.padStart(32, '0').replace(/(.{4})(?!$)/g, '$1_');
}


