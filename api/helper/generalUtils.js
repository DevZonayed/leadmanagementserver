function isDate(date) {
  if (date == null) {
    return false;
  }
  return new Date(date).toString() !== "Invalid Date" && !isNaN(new Date(date));
}

module.exports = { isDate };
