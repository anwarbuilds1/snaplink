import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error({
    requestId: req.requestId,
    err,
    path: req.originalUrl,
    method: req.method,
  });

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Resources already exist",
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
