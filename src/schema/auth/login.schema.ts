import { object, string, TypeOf } from 'zod'

const payload = {
  body: object({
    email: string({
      required_error: 'Email is required field',
    }).email({ message: 'Invalid email address' }),
    password: string({
      required_error: 'Password is required field',
    })
      .min(6, 'Password should be at least 6 characters long')
      .max(20, 'Password should be less than 20 characters long'),
  }),
}

export const loginUserSchema = object({
  ...payload,
})

export type LoginUserInput = TypeOf<typeof loginUserSchema>
