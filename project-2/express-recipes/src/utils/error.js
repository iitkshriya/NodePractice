class CustomError extends Error {
  constructor({ statusCode, message }) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, req, res, next) => {
  let { statusCode, message } = err;

  console.error(message);

  if (!statusCode) statusCode = 500;

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = {
  CustomError,
  handleError
};
