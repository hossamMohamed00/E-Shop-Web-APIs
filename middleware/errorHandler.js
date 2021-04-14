/*
 * Error Middleware
 * This middleware will be called if there is an exception or error
 * Here we add all the logic for dealing with the errors
 */

module.exports = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    //! jwt authentication error
    res.status(401).json({
      success: false,
      message: 'The user is not authorized!'
    });
  } else if (err.name === 'ValidationError') {
    //! Validation error
    res.status(400).json({
      success: false,
      message: err
    });
  } else {
    //! General error
    res.status(500).json({
      success: false,
      message: 'Server error!',
      err
    });
  }
};
