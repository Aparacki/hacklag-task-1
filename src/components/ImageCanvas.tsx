import React, { Component } from "react";

import { calcOuterRec, calcPrevImgSize } from "./utils/Utils";

import ImageRotate from "./ImageRotate";
import ImageGrayscale from "./ImageGrayscale";

// css
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

import {
   ImageCanvasState as State,
   ImageState as ImageProps
} from "./ImageTypes";

interface Props {
   img: ImageProps;
   imgRef: any;
   fullCanvasRef: any;
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
         }
      };
   }

   private previewCanvasRef = React.createRef<HTMLCanvasElement>();

   public componentDidMount = () => {
      console.log("__canvas didmount");
      const prevSize = calcPrevImgSize(300, this.props.img.imgSize);
      const pixels = this.handlePixels();
      this.setCanvasArea(this.previewCanvasRef, prevSize);

      this.setState({
         prevSize,
         pixels
      });
   };

   public componentDidUpdate = (): void => {
      console.log("__canvas didupdate");
      const { angle, grayscale } = this.state;
      this.handleCanvas(this.previewCanvasRef, angle, grayscale);
      this.handleFullsizeCanvas();
   };

   public componentWillUnmount = () => {
      console.log("__canvas wil unmount");
      this.handleClearToDefault();
   };

   public setCanvasArea = (canvasRef: any, size?: number[]): void => {
      if (!size) size = this.state.prevSize;
      const edge: number = Math.sqrt(size[0] ** 2 + size[1] ** 2);
      const canvas: any = canvasRef.current;

      canvas.width = edge;
      canvas.height = edge;
      canvas.style.width = "200px"; // show at 50% on screen
      canvas.style.height = "200px";
   };

   public handleRotate = (value: number): void => {
      this.handleCanvas(this.previewCanvasRef, value, this.state.grayscale);
      console.log("__handle rotate");
   };

   public handleRotateEnd = (angle: number): void => {
      this.setState({ angle }, () => {
         this.handleCanvas(this.previewCanvasRef, angle, this.state.grayscale);
      });
      console.log("__handle rotate dragend");
   };

   public handleGrayscale = (value: number): void => {
      this.handleCanvas(this.previewCanvasRef, this.state.angle, value);
      console.log("__handle GRAYSCALE");
   };

   public handleGrayscaleEnd = (grayscale: number): void => {
      this.setState({ grayscale }, () => {
         this.handleCanvas(this.previewCanvasRef, this.state.angle, grayscale);
      });
      console.log("__handle GRAYSCALE dragend");
   };

   public handlePixels = (
      angle: number = 360
   ): { w: number; h: number; size: number } => {
      const { img } = this.props;
      const boundary = calcOuterRec(angle, img.imgSize[0], img.imgSize[1]);
      const pixels = {
         w: parseInt(boundary[0].toFixed(0)),
         h: parseInt(boundary[1].toFixed(0)),
         size: parseInt((boundary[0] * boundary[1]).toFixed(0))
      };
      return pixels;
   };

   public handleCanvas = (
      canvasRef: any,
      angle: number,
      grayscale: number,
      size?: number[]
   ): void => {
      console.log("__canvas handle");
      // const { prevSize, angle, grayscale } = this.state;
      const { prevSize } = this.state;
      if (!size) size = prevSize;

      const canvas = canvasRef.current;
      const myImage = this.props.imgRef.current;

      const ctx: any = canvas.getContext("2d");

      ctx.save(); //saves the state of canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.filter = `grayscale(${grayscale}%`;
      ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
      ctx.drawImage(
         myImage,
         (canvas.width - size[0]) / 2,
         (canvas.height - size[1]) / 2,
         size[0],
         size[1]
      );
      ctx.restore();
   };

   public handleFullsizeCanvas = (): void => {
      const { angle, grayscale } = this.state;
      const { img, fullCanvasRef } = this.props;
      const canvasSize = calcOuterRec(
         this.state.angle,
         img.imgSize[0],
         img.imgSize[1]
      );

      this.setCanvasArea(fullCanvasRef, canvasSize);
      this.handleCanvas(fullCanvasRef, angle, grayscale, canvasSize);

      console.log("__canvas FULL");
   };

   public handleClearToDefault = (): void => {
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
         }
      });
   };

   public render(): JSX.Element {
      return (
         <>
            <>
               {console.log("__canvas render")}
               <canvas
                  ref={this.previewCanvasRef}
                  style={{ background: "green" }}
               />
               <ImageRotate
                  onChange={this.handleRotate}
                  onDragEnd={this.handleRotateEnd}
               />
               <ImageGrayscale
                  onChange={this.handleGrayscale}
                  onDragEnd={this.handleGrayscaleEnd}
               />
               {this.state.pixels.w} x {this.state.pixels.h} ={" "}
               {this.state.pixels.size}
            </>
            }
            <Button
               variant="contained"
               color="secondary"
               onClick={this.handleClearToDefault}
            >
               Clear
               <DeleteIcon />
            </Button>
            <Button variant="contained" color="primary">
               Save
               <SaveIcon />
            </Button>
         </>
      );
   }
}

export default ImageCanvas;
