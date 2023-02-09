import { array, object, string, TypeOf, z } from 'zod'

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

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
    roles: array(
      z.nativeEnum(UserRole, {
        errorMap: (issue, ctx) => {
          return { message: `${ctx.defaultError}` }
        },
      })
    ),
  }),
}

const payloadOptional = {
  body: object({
    email: string({
      required_error: 'Email is required',
    })
      .email({ message: 'Invalid email address' })
      .optional(),
    name: string({
      required_error: 'Name is required',
    }).optional(),
    password: string({
      required_error: 'Password is required',
    })
      .min(6, 'Password should be at least 6 characters long')
      .max(20, 'Password should be less than 20 characters long')
      .optional(),
    roles: array(
      z.nativeEnum(UserRole, {
        errorMap: (issue, ctx) => {
          return { message: `${ctx.defaultError}` }
        },
      })
    ).optional(),
  }),
}

const params = {
  params: object({
    userId: string().regex(new RegExp(/^[0-9a-fA-F]{24}$/), 'Incorrect ID mongoDB'),
  }),
}

export const createUserSchema = object({
  ...payload,
})

export const updateUserSchema = object({
  ...payloadOptional,
})

export const getUserSchema = object({
  ...params,
})

export type CreateUserInput = TypeOf<typeof createUserSchema>
export type UpdateUserInput = TypeOf<typeof updateUserSchema>
export type GetUserInput = TypeOf<typeof getUserSchema>
