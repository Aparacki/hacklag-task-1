import React, { Component } from "react";

import { calcOuterRec } from "./utils/Utils";

import ImageRotate from "./ImageRotate";
import ImageGrayscale from "./ImageGrayscale";

// css
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

import { ImageState as ImageProps } from "./ImageTypes";

export interface imgSize {
   full: number[];
   prev: number[];
}
interface pixels {
   w: number;
   h: number;
   size: number;
}

interface State {
   prevSize: number[];
   angle: number;
   grayscale: number;
   pixels: pixels;
   imgIsLoaded: boolean;
}

interface Props {
   img: ImageProps;
}

class ImageCanvas extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = {
         prevSize: [0, 0],
         angle: 0,
         grayscale: 0,
         pixels: {
            w: 0,
            h: 0,
            size: 0
         },
         imgIsLoaded: false
      };
   }

   private previewCanvasRef = React.createRef<HTMLCanvasElement>();
   private fullCanvasRef = React.createRef<HTMLCanvasElement>();
   private imageRef = React.createRef<HTMLImageElement>();

   public componentDidMount = () => {
            console.log('didmount')
      const { img } = this.props;
      let width: number = 300;
      let height: number = (width * img.imgSize[1]) / img.imgSize[0];
      if (img.imgSize[1] > img.imgSize[0]) {
         height = 300;
         width = (height * img.imgSize[0]) / img.imgSize[1];
      }
      console.log();
      this.setState({
         prevSize: [width, height]
      });

      this.setCanvasArea(this.previewCanvasRef, [width, height]);
      this.handleCanvas(this.previewCanvasRef, this.imageRef);
   };
   public componentDidUpdate = ():void => {
      console.log('didupdate')
      this.handleCanvas(this.previewCanvasRef, this.imageRef);
   }

   public setCanvasArea = (canvasRef: any, size: number[]): void => {
      const edge: number = Math.sqrt(size[0] ** 2 + size[1] ** 2);
      const canvas: any = canvasRef.current;

      canvas.width = edge;
      canvas.height = edge;
      canvas.style.width = "400px"; // show at 50% on screen
      canvas.style.height = "400px";
   };

   public handleRotate = (e: any, value: number): void => {
      this.setState({ angle: value }, () => {});
   };

   public handleGrayscale = (e: any, value: number): void => {
      this.setState({ grayscale: value }, () => {});
   };

   public handlePixels = (): void => {
      const { img } = this.props;
      const { angle } = this.state;
      const boundary = calcOuterRec(angle, img.imgSize[0], img.imgSize[1]);
      const pixels = {
         w: parseInt(boundary[0].toFixed(0)),
         h: parseInt(boundary[1].toFixed(0)),
         size: parseInt((boundary[0] * boundary[1]).toFixed(0))
      };

      this.setState({ pixels });
   };

   public handleCanvas = (canvasRef: any, imageRef: any): void => {
            console.log('handle canvas')
      const { prevSize, angle, grayscale } = this.state;
      // console.log('draw canvas ', canvas)
      // console.log('draw canvas ', myImage)
      // console.log('widx x height ', canvas.width , ' x ', canvas.height)
      // console.log('draw canvas ', myImage)
      const canvas = canvasRef.current;
      const myImage = imageRef.current;

      const ctx: any = canvas.getContext("2d");

      ctx.save(); //saves the state of canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.filter = `grayscale(${grayscale}%`;
      ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
      ctx.drawImage(
         myImage,
         (canvas.width - prevSize[0]) / 2,
         (canvas.height - prevSize[1]) / 2,
         prevSize[0],
         prevSize[1]
      );
      ctx.restore();
   };

   public handleDownloadClick = (e: any): void => {
      e.preventDefault();
      // const { imgSize, imgSrcExt, angle } = this.state;
      // const canvas: any = this.fullCanvasRef.current;
      // // crop canvas size to fit the image
      // const outerRec = calcOuterRec(angle, imgSize.full[0], imgSize.full[1]);
      // this.setCanvasArea(imgSize.full);
      // this.handleCanvas(outerRec, true);
      // this.setCanvasArea(imgSize.prev);
      // // const imageData64 = canvas.toDataURL("image/" + imgSrcExt);
      // // const myFilename = "previewFile." + imgSrcExt;
      // this.handleCanvas();
      // // file to be uploaded
      // // const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      // // console.log(myNewCroppedFile);
      // // download file
      // downloadBase64File(imageData64, myFilename);
      // this.handleClearToDefault()
   };

   public handleClearToDefault = (): void => {
      // if (e) e.preventDefault()
      const canvas: any = this.previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.setState({
         angle: 0,
         grayscale: 0,
         pixels: {
            w: 0,
            h: 0,
            size: 0
         },
         imgIsLoaded: false
      });
      // this.fileInputRef.current.value = null
   };

   public render(): JSX.Element {
      const { imgIsLoaded } = this.state;
      return (
         <>
            <>
            {      console.log('render')}
               <canvas
                  ref={this.previewCanvasRef}
                  style={{ background: "green" }}
               />
               <ImageRotate
                  onChange={this.handleRotate}
                  value={this.state.angle}
               />
               <ImageGrayscale
                  onChange={this.handleGrayscale}
                  value={this.state.grayscale}
               />
               {this.state.pixels.w} x {this.state.pixels.h} ={" "}
               {this.state.pixels.size}
            </>
            }
            <Button
               variant="contained"
               color="secondary"
               disabled={!imgIsLoaded}
               onClick={this.handleClearToDefault}
            >
               Clear
               <DeleteIcon />
            </Button>
            <Button
               variant="contained"
               color="primary"
               disabled={!imgIsLoaded}
               onClick={this.handleDownloadClick}
            >
               Save
               <SaveIcon />
            </Button>
            <canvas ref={this.fullCanvasRef} style={{ display: "none" }} />
            <img
               ref={this.imageRef}
               src={this.props.img.imgSrc}
               style={{ display: "none" }}
            />
         </>
      );
   }
}

export default ImageCanvas;
