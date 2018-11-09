export interface ImageState {
   imgSrc: string;
   imgSize: number[];
}

export interface ImageProps {
   imgSrc: string;
   imgType: string;
}

export interface ImageCanvasState {
   prevSize: number[];
   angle: number;
   grayscale: number;
   pixels: pixels;
}

export interface ImageCanvasProps {
   img: ImageState;
   imgRef: any;
   fullCanvasRef: any;
   handleDownload():void
}

interface pixels {
   w: number;
   h: number;
   size: number;
}