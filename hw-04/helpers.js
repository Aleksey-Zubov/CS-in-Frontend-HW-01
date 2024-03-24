exports.binary = function(num)  {
  const str = new Uint32Array([num])[0].toString(2);
  return '0b' + str.padStart(32, '0').replace(/(.{4})(?!$)/g, '$1_');
}


exports.binary64 = function(num)  {
  const str = new BigUint64Array([num])[0].toString(2);
  return '0b' + str.padStart(64, '0').replace(/(.{4})(?!$)/g, '$1_');
}