export function elementIsIncluded(mainArray: unknown[], secondArray: unknown[]): boolean {
  return mainArray.some((element) => secondArray.includes(element))
}

export function extractRoles(roles: { value: string }[]) {
  return roles.map((el: { value: string }) => el.value)
}
