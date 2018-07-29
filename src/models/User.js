import mongoose from 'mongoose';
import shortid from 'shortid';

const userSchema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
});

const User = mongoose.model('User', userSchema);
export default User;
