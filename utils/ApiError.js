class ApiError extends Error {
  constructor(statusCode, message, type = 'API Error', uuid = '') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.uuid = uuid;
  }
}

export default ApiError;
