export const defaultBooleanToTrue = (value: boolean | undefined | null): boolean => {
    // reminder: null == undefined
    return value == undefined ? true : value;
};
