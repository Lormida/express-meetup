import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
  value: {
    type: String,
    unique: true,
    required: true,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
})

const RoleModel = mongoose.model('Role', roleSchema)

export default RoleModel