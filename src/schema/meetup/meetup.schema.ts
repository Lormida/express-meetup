import { object, string, array, TypeOf, date, z } from 'zod'

const payload = {
  body: object({
    name: string({
      required_error: 'A meetup must have a name',
    }).max(40, 'Name should be less than 40 characters long'),
    description: string({
      required_error: 'A meetup must have a description',
    })
      .min(3, 'Description should be at least 3 characters long')
      .max(255, 'Description should be less than 120 characters long'),
    tags: array(
      string({
        required_error: 'A meetup must have tags',
      })
    ).min(2),
    place: string().optional(),
    time: date({
      invalid_type_error: "It's not a date",
      required_error: 'Meetup must have a time',
    }),
  }),
}

// For patch request
const payloadOptional = {
  body: object({
    name: string({
      required_error: 'A meetup must have a name',
    })
      .max(40, 'Name should be less than 40 characters long')
      .optional(),
    description: string({
      required_error: 'A meetup must have a description',
    })
      .min(3, 'Description should be at least 3 characters long')
      .max(255, 'Description should be less than 120 characters long')
      .optional(),
    tags: array(
      string({
        required_error: 'A meetup must have tags',
      })
    )
      .min(2)
      .optional(),
    place: string().optional(),
    time: date({
      invalid_type_error: "It's not a date",
      required_error: 'Meetup must have a time',
    }).optional(),
  }),
}
// TODO check date validator

const params = {
  params: object({
    meetupId: string().regex(new RegExp(/^[0-9a-fA-F]{24}$/), 'Incorrect ID mongoDB'),
  }),
}

export const createMeetupSchema = object({
  ...payload,
})

export const updateMeetupSchema = object({
  ...payloadOptional,
  ...params,
})

export const deleteMeetupSchema = object({
  ...params,
})

export const getMeetupSchema = object({
  ...params,
})

export type CreateMeetupInput = TypeOf<typeof createMeetupSchema>
export type UpdateMeetupInput = TypeOf<typeof updateMeetupSchema>
export type GetMeetupInput = TypeOf<typeof getMeetupSchema>
export type DeleteMeetupInput = TypeOf<typeof deleteMeetupSchema>
