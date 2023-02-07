import { Response } from 'express'

export const elementIsIncluded = (mainArray: unknown[], secondArray: unknown[]): boolean =>
  mainArray.some((element) => secondArray.includes(element))

export const extractRoles = (roles: { value: string }[]): string[] => roles.map((el) => el.value)

export const setCookie = (res: Response, key: string, refreshToken: string) => {
  res.cookie(key, refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  })
}
