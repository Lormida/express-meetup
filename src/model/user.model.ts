import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { RoleDocument } from './role.model'

export interface UserInput {
  email: string;
  nickname: string;
  password: string;
  role: RoleDocument['_id']
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
    minlength: [3, 'A nickname must includes at least 2 symbols'],
    manlength: [40, 'A nickname must includes maximum 40 symbols']
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
}, {
  timestamps: true
})

userSchema.pre('save', async function (next) {
  const user = this as UserDocument

  if (!user.isModified('password')) return next()

  user.password = await bcrypt.hash(user.password, 10)
  return next()
})


userSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as UserDocument

  try {
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (e) {
    return false;
  }
}

userSchema.index({ email: 1, nickname: 1 });

const UserModel = mongoose.model<UserDocument>('User', userSchema)

export default UserModel