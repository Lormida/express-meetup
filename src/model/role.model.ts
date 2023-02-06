import mongoose from 'mongoose'

export interface RoleDocument extends mongoose.Document {
  value: string
}

const roleSchema = new mongoose.Schema({
  value: {
    type: String,
    unique: true,
    required: true,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
})

const RoleModel = mongoose.model<RoleDocument>('Role', roleSchema)

export default RoleModel
