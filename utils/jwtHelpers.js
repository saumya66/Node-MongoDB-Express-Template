import jwt from 'jsonwebtoken';

const sign = async (payload, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
};

const verify = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};

export { sign, verify };
