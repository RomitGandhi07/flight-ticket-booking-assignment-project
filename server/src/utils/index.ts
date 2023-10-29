export const pickFromObject = (obj: Record<string, any>, keys: string[]) => {
    return keys.reduce((result: Record<string, any>, key: string) => {
        if(obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}