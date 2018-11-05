export const maxSize: number = 2500000; // bytes
export const acceptedFileTypes: string =
    "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
export const acceptedFileTypesArray: any = acceptedFileTypes.split(",").map(item => {
    return item.trim();
});
