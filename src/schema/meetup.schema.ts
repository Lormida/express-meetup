import { object, string, array, TypeOf } from 'zod'

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
  }),
}

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
  }),
}

const params = {
  params: object({
    meetupId: string({
      required_error: 'meetupId is required',
    }),
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
