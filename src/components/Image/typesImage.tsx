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
   invert:number;
   huerotate:number;
   pixels: Pixels;
}

export interface ImageCanvasProps {
   img: ImageState;
   imgRef: any;
   fullCanvasRef: any;
   handleDownload():void
}

export interface Pixels {
   w: number;
   h: number;
   size: number;
}