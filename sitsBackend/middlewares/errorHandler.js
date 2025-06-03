// global error handler
// middleware/errorHandlerMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
// Usage in your main server file
// import express from 'express';
// import { errorHandler } from './middlewares/errorHandler.js';