import mongoose from 'mongoose'
import { UserRole } from '../schema/user/user.schema'

export interface RoleDocument extends mongoose.Document {
  value: string
}

const roleSchema = new mongoose.Schema({
  value: {
    type: String,
    unique: true,
    required: true,
    enum: [UserRole.USER, UserRole.ADMIN],
    default: 'USER',
  },
})

const RoleModel = mongoose.model<RoleDocument>('Role', roleSchema)

export default RoleModel
