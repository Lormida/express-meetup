export const elementIsIncluded = (mainArray: unknown[], secondArray: unknown[]): boolean =>
  mainArray.some((element) => secondArray.includes(element))

export const extractRoles = (roles: { value: string }[]): string[] => roles.map((el) => el.value)
