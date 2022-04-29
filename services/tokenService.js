import { sign, verify } from '../utils/jwtHelpers.js';
import { tokenTypes } from '../config/tokens.js';

import { RefreshTokenModel } from '../models/index.js';
import moment from 'moment';
import httpStatus from 'http-status';

import APIError from '../utils/APIError.js';

const generateToken = async (userId, loginTime, expires, type) => {
  const payload = {
    userId,
    loginTime: new Date(loginTime.valueOf()),
    exp: expires.unix(),
    type,
   };
   let token = await sign(payload, process.env.JWT_SECRET);
   return token;
};

const saveRefreshToken = async (userId, loginTime, token) => {
  await RefreshTokenModel.findOneAndUpdate(
    { userRef: userId },
    {
      loginTime: new Date(loginTime.valueOf()),
      token: token,
    },
    {
      upsert: true,
    }
    );
};

const clearRefreshToken = async (token) => {
  await RefreshTokenModel.findOneAndDelete({ token: token });
};

const generateAuthTokens = async (user) => {
  const loginTime = moment();
  let accessTokenExpiresAt = loginTime
  .clone()
  .add(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
  
  const accessToken = await generateToken(
    user._id,
    loginTime,
    accessTokenExpiresAt,
    tokenTypes.ACCESS,
    );
    
  let refreshTokenExpiresAt = loginTime
    .clone()
    .add(process.env.REFRESH_TOKEN_EXPIRATION_DAYS, 'days');

  const refreshToken = await generateToken(
    user._id,
    loginTime,
    refreshTokenExpiresAt,
    tokenTypes.REFRESH,
  );
 
  await saveRefreshToken(user._id, loginTime, refreshToken);
  
  return {
    accessToken,
    refreshToken,
  };
};

const generateAccessTokenFromRefreshTokenPayload = async ({
  userId,
  loginTime,
  platform,
}) => {
  const now = moment();
  let accessTokenExpiresAt = now.add(
    process.env.ACCESS_TOKEN_EXPIRATION_MINUTES,
    'minutes'
  );

  const accessToken = await generateToken(
    userId,
    moment(loginTime),
    accessTokenExpiresAt,
    tokenTypes.ACCESS,
    platform
  );

  return accessToken;
};

const verifyRefreshToken = async (token) => {
  let tokenPayload = await verify(token, process.env.JWT_SECRET);
  if (!tokenPayload || tokenPayload.type !== tokenTypes.REFRESH)
    throw new APIError(httpStatus.FORBIDDEN, 'Invalid Refresh Token - logout');

  let refreshTokenExists = await RefreshTokenModel.exists({ token: token });
  if (!refreshTokenExists)
    throw new APIError(httpStatus.FORBIDDEN, 'Invalid Refresh Token - logout');

  return tokenPayload;
};

export {
  generateAuthTokens,
  clearRefreshToken,
  verifyRefreshToken,
  generateAccessTokenFromRefreshTokenPayload,
 };
