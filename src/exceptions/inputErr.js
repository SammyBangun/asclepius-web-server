const ClientError = require("../exceptions/clientErr");

class InputError extends ClientError {
  constructor(message) {
    super(message);
    this.name = "InputError";
  }
}

module.exports = InputError;
