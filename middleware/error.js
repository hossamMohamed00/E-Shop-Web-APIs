/*
 * Error Middleware
 * This middleware will be called if there is an exception
 * Here we add all the logic for dealing with the errors
 */

module.exports = (err, req, res) => {
  //* Log the error
  // console.log(err);
  console.log('Error Here --------------------++-------------------');

  //* Send proper message to the user
  res
    .status(500)
    .json({ success: false, message: 'An error occurred!', error: err });
};
