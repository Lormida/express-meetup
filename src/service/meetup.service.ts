import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import MeetupModel, { MeetupDocument, MeetupInput } from '../model/meetup.model'

class MeetupService {
  /** Function is not using - instead of it is using HandlerFactory getAll */
  // findAllMeetups = (options: QueryOptions = { lean: true }) => MeetupModel.find({}, options)

  createMeetup = (input: MeetupInput) => MeetupModel.create(input)

  findMeetup = (query: FilterQuery<MeetupDocument>, options: QueryOptions = { lean: true }) =>
    MeetupModel.findOne(query, {}, options)

  findAndUpdateMeetup = (
    query: FilterQuery<MeetupDocument>,
    update: UpdateQuery<MeetupDocument>,
    options: QueryOptions
  ) => MeetupModel.findOneAndUpdate(query, update, options)

  findAndDeleteMeetup = (query: FilterQuery<MeetupDocument>) => MeetupModel.findOneAndDelete(query)
}

const meetupService = new MeetupService()
export default meetupService
