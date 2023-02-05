import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import MeetupModel, { MeetupDocument, MeetupInput } from "../model/meetup.model";



export async function createMeetup(input: MeetupInput) {
  return MeetupModel.create(input)
}

export async function findMeetup(
  query: FilterQuery<MeetupDocument>,
  options: QueryOptions = { lean: true }
) {
  return MeetupModel.findOne(query, {}, options);
}

export async function findAllMeetups(
  options: QueryOptions = { lean: true }
) {
  return MeetupModel.find({}, options);
}

export async function findAndUpdateMeetup(
  query: FilterQuery<MeetupDocument>,
  update: UpdateQuery<MeetupDocument>,
  options: QueryOptions
) {
  return MeetupModel.findOneAndUpdate(query, update, options);
}

export async function deleteMeetup(query: FilterQuery<MeetupDocument>) {
  return MeetupModel.deleteOne(query);
}
