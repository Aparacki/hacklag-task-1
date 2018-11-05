import * as image from "./ImageUploadOptions";

export function verifyFile(files: any[]) {
    if (files && files.length > 0) {
        const currentFile: any = files[0];
        const currentFileType: string = currentFile.type;
        const currentFileSize: number = currentFile.size;
        if (currentFileSize > image.maxSize) {
            alert(
                "This file is not allowed. " +
                    currentFileSize +
                    " bytes is too large. Max image size is " + image.maxSize
            );
            return false;
        }
        if (!image.acceptedFileTypesArray.includes(currentFileType)) {
            alert("This file is not allowed. Only images are allowed.");
            return false;
        }
        return true;
    }

}

export function calcOuterRec(ang: number, w: number, h: number) {
    if (ang > 90 && ang < 180) {
        ang = 90 - Math.abs(90 - ang);
    }
    if (ang >= 180 && ang < 270) {
        ang = ang - 180;
    }

    if (ang >= 270) {
        ang = 360 - ang;
    }
    var t = (ang * Math.PI) / 180; // Convert to radians

    var x = Math.sin(t) * h + Math.cos(t) * w; // The bounding box width
    var y = Math.sin(t) * w + Math.cos(t) * h;
    return [x, y];
}
