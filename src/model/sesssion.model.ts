import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface SessionDocument extends mongoose.Document {
  user: UserDocument['_id']
  refreshToken: string
  userAgent: string
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
  userAgent: { type: String },
})

const SessionModel = mongoose.model<SessionDocument>('Session', SessionSchema)
export default SessionModel
