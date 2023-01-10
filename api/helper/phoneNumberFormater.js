const formatNumToBd = (number) => {
  let numRegExp = /^(\+8801)|(8801)|(01)|(1)/;
  return number.toString().replace(numRegExp, "01");
};

module.exports = { formatNumToBd };
