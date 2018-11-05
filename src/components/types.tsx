export interface State {
   imgSrc: string;
   imgSrcExt: string;
   imgSize: imgSize;
   angle: number;
   grayscale: number;
   pixels: pixels;
   imgIsLoaded: boolean;
}

export interface imgSize {
   full: number[];
   prev: number[];
}
interface pixels {
   w: number;
   h: number;
   size: number
}