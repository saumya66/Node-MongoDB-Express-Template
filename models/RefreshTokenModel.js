import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const refreshTokenSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  loginTime: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
  platform: {
    type: String,
    required: true,
  },
  fcmToken: {
    type: String,
  },
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
