class ErrorResponse extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'CUSTOM_ERROR';
  }
}

module.exports = ErrorResponse;
