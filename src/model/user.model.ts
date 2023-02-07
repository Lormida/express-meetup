import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { RoleDocument } from './role.model'

export interface UserInput {
  email: string
  name: string
  password: string
  roles: [RoleDocument['_id']]
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  const user = this as UserDocument

  if (!user.isModified('password')) {
    return next()
  }

  user.password = await bcrypt.hash(user.password, 10)
  return next()
})

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as UserDocument

  try {
    return await bcrypt.compare(candidatePassword, user.password)
  } catch (e) {
    return false
  }
}

userSchema.pre(/^find/, function () {
  this.populate({ path: 'roles', select: 'value -_id' })
})

userSchema.index({ email: 1, name: 1 })

const UserModel = mongoose.model<UserDocument>('User', userSchema)

export default UserModel
