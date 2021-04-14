const express_jwt = require('express-jwt');

function auth() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;
  return express_jwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    //* Exclude some paths
    path: [
      `${api}/users/login`,
      `${api}/users/register`,
      {
        url: /\api\/v1\/products(.*)/, // all product path
        methods: ['GET', 'OPTIONS']
      },
      {
        url: /\api\/v1\/categories(.*)/, // all product path
        methods: ['GET', 'OPTIONS']
      }
    ]
  });
}

//* Helper function
const isRevoked = async (req, payload, done) => {
  if (!payload.isAdmin) {
    /*
    Reject the token -- 
    so if any authorized call and our user is not admin,
     then it will be rejected
    */
    done(null, true);
  } else {
    done();
  }
};

module.exports = auth;
