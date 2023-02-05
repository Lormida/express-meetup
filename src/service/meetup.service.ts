import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import MeetupModel, { MeetupDocument, MeetupInput } from "../model/meetup.model";

class MeetupService {
  async createMeetup(input: MeetupInput) {
    return MeetupModel.create(input)
  }

  async findMeetup(
    query: FilterQuery<MeetupDocument>,
    options: QueryOptions = { lean: true }
  ) {
    return MeetupModel.findOne(query, {}, options);
  }

  async findAllMeetups(
    options: QueryOptions = { lean: true }
  ) {
    return MeetupModel.find({}, options);
  }

  async findAndUpdateMeetup(
    query: FilterQuery<MeetupDocument>,
    update: UpdateQuery<MeetupDocument>,
    options: QueryOptions
  ) {
    return MeetupModel.findOneAndUpdate(query, update, options);
  }

  async deleteMeetup(query: FilterQuery<MeetupDocument>) {
    return MeetupModel.deleteOne(query);
  }
}
const meetupService = new MeetupService()

export default meetupService
