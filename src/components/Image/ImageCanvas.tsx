import React, { Component } from "react";

import { calcCropRec, calcPrevImgSize } from "./utils/imageCanvasUtils";

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
   ImageCanvasProps as Props
} from "./typesImage";

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
      // console.log("__canvas didmount");
      const prevSize = calcPrevImgSize(300, this.props.img.imgSize);
      const pixels = this.handlePixels();
      this.setCanvasArea(this.previewCanvasRef, prevSize);
      this.setState({
         prevSize,
         pixels
      });
   };

   public componentDidUpdate = (): void => {
      // console.log("__canvas didupdate");
      const { angle, grayscale } = this.state;
      this.handleCanvas(this.previewCanvasRef);
   };

   public componentWillUnmount = () => {
      this.handleReset();
   };

// set max area to draw
   public setCanvasArea = (canvasRef: any, size?: number[]): void => {
      if (!size) size = this.state.prevSize;
      const edge: number = Math.sqrt(size[0] ** 2 + size[1] ** 2);
      const canvas: any = canvasRef.current;

      canvas.width = edge;
      canvas.height = edge;
      canvas.style.width = "200px";
      canvas.style.height = "200px";
   };

   public handleRotate = (e: any, angle: number): void => {
      const pixels = this.handlePixels(angle)
      this.setState({ angle, pixels },);
   };

   public handleGrayscale = (e: any, grayscale: number): void => {
      this.setState({ grayscale });
   };

// calculate size of fullsize image 
   public handlePixels = (
      angle: number = 360
   ): { w: number; h: number; size: number } => {

      const { img } = this.props;
      const boundary = calcCropRec(angle, img.imgSize[0], img.imgSize[1]);
      const pixels = {
         w: parseInt(boundary[0].toFixed(0)),
         h: parseInt(boundary[1].toFixed(0)),
         size: parseInt((boundary[0] * boundary[1]).toFixed(0))
      };

      return pixels;
   };

// draw canvas
   public handleCanvas = (canvasRef: any, size?: number[]): void => {
      const { prevSize, angle, grayscale } = this.state;
      // if (size) {
      //    console.log("__canvas handle fullsize");
      // } else {
      //    console.log("__canvas handle");
      // }
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

// draw fullSize canvas
   public handleFullsizeCanvas = (): void => {
      const { angle, grayscale } = this.state;
      const { img, fullCanvasRef } = this.props;
      const canvasSize = calcCropRec(
         this.state.angle,
         img.imgSize[0],
         img.imgSize[1]
      );
      this.setCanvasArea(fullCanvasRef, canvasSize);
      this.handleCanvas(fullCanvasRef, canvasSize);
   };

   public handleDownload = (): void => {
      this.handleFullsizeCanvas();
      this.props.handleDownload();
   };

   public handleReset = (): void => {
      const canvas: any = this.previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const pixels = this.handlePixels()
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.setState({
         angle: 0,
         grayscale: 0,
         pixels
      });
   };

   public render(): JSX.Element {
      return (
         <>
            <>
               <canvas
                  ref={this.previewCanvasRef}
                  style={{ background: "green" }}
               />
               <ImageRotate
                  value={this.state.angle}
                  onChange={this.handleRotate}
               />
               <ImageGrayscale
                  value={this.state.grayscale}
                  onChange={this.handleGrayscale}
               />
               {this.state.pixels.w} x {this.state.pixels.h} ={" "}
               {this.state.pixels.size}
            </>
            
            <Button
               variant="contained"
               color="secondary"
               onClick={this.handleReset}
            >
               Reset to default
               <DeleteIcon />
            </Button>
            <Button
               variant="contained"
               color="primary"
               onClick={this.handleDownload}
            >
               Save
               <SaveIcon />
            </Button>
         </>
      );
   }
}

export default ImageCanvas;
