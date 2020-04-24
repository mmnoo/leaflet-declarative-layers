export const defaultBooleanToTrue = (
  value: boolean | undefined | null,
): boolean => {
  // reminder: null == undefined
  // tslint:disable-next-line: triple-equals
  return value == undefined ? true : value
}
