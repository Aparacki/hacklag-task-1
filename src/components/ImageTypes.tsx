export interface ImageState {
   imgSrc: string;
   imgSrcExt: string;
   imgSize: number[];
}

export interface ImageCanvasState {
   prevSize: number[];
   angle: number;
   grayscale: number;
   pixels: pixels;
}

interface pixels {
   w: number;
   h: number;
   size: number;
}