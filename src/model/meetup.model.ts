import mongoose, { Schema, model } from 'mongoose'

const meetupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A meetup must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A meetup name must have less or equal then 40 characters'],
      minlength: [3, 'A meetup name must have more or equal then 3 characters']
    },
    description: {
      type: String,
      required: [true, 'A meetup must have a description'],
      minlength: [3, 'A meetup must have a description at least from 3 symbols'],
      manlength: [255, 'A meetup must have a description maximum is from 255 symbols']

    },
    tags: {
      type: [String],
      required: [true, 'A meetup must have tags'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    host: [
      {
        //@ts-ignore
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
meetupSchema.virtual('slug').get(function () {
  return this.name.split(' ').map(el => el.toLowerCase()).join('-');
});


meetupSchema.index({ name: 1, createdAt: 1 });

export default model('meetup', meetupSchema);