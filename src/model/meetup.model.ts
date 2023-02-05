import mongoose, { Schema, model } from 'mongoose'
import { UserDocument } from './user.model'

export interface MeetupInput {
  name: string;
  description: string;
  tags: string[];
  host: UserDocument["_id"];
}

export interface MeetupDocument extends MeetupInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
const meetupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    host: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  }, {
  timestamps: true
}
);

/* meetupSchema.virtual('slug').get(function () {
  return this.name.split(' ').map(el => el.toLowerCase()).join('-');
}); */

meetupSchema.index({ name: 1 });

const MeetupModel = model<MeetupDocument>('Meetup', meetupSchema);
export default MeetupModel