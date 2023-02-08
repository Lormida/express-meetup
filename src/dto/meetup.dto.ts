import { MeetupDocument } from '../model/meetup.model'

export class MeetupDTO {
  id: string
  name: string
  description: string
  tags: string[]
  place?: string
  time: Date
  host: string
  createdAt: Date
  updatedAt: Date

  constructor(model: MeetupDocument) {
    this.id = model._id
    this.name = model.name
    this.description = model.description
    this.tags = model.tags
    this.place = model.place
    this.host = model.host
    this.time = model.time
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
  }
}
