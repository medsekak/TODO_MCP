export class ApiError extends Error {

  constructor(statusCode, message) {
    super(message);          // ← appelle le constructeur de Error (classe parente)
    this.statusCode = statusCode;
  }
}