import { array, object, string, TypeOf, z } from 'zod'

const payload = {
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email({ message: 'Invalid email address' }),
    name: string({
      required_error: 'Name is required',
    }),
    password: string({
      required_error: 'Password is required',
    })
      .min(6, 'Password should be at least 6 characters long')
      .max(20, 'Password should be less than 20 characters long'),
  }),
  roles: array(string(z.enum(['USER', 'ADMIN']))),
}

export const createUserSchema = object({
  ...payload,
})

export type CreateUserInput = TypeOf<typeof createUserSchema>
