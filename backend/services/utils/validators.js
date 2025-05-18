exports.isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
exports.isValidCarNumber = (carNumber) =>
  /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/.test(carNumber);
