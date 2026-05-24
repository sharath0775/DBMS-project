const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const validatePincode = (pincode) => {
  return pincode && pincode.length >= 5 && pincode.length <= 10;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove potentially harmful characters
  return input.trim().replace(/[<>\"'`;]/g, '');
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePincode,
  sanitizeInput
};
