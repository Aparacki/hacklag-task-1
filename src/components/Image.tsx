import React, { Component } from "react";
import Dropzone from "react-dropzone";

import {
   base64StringtoFile,
   downloadBase64File,
   extractImageFileExtensionFromBase64,
   image64toCanvasRef
} from "./utils/ImageUtils";
import { calcOuterRec, verifyFile } from "./utils/Utils";
import * as image from "./utils/ImageUploadOptions";

import { State, imgSize } from "./types";

// css
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";

class Image extends Component<{}, State> {
   constructor(props: {}) {
      super(props);
      this.state = {
         imgSrc: "",
         imgSrcExt: "",
         imgSize: {
            full: [0, 0],
            prev: [0, 0]
         },
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

   private imagePreviewCanvasRef = React.createRef<HTMLCanvasElement>();
   private imageFullCanvasRef = React.createRef<HTMLCanvasElement>();
   private imageRef = React.createRef<HTMLImageElement>();

   public handleOnDrop = (files: any[], rejectedFiles: any[]): void => {
      if (rejectedFiles && rejectedFiles.length > 0) {
         verifyFile(rejectedFiles);
      }

      if (files && files.length > 0) {
         const isVerified = verifyFile(files);
         if (isVerified) {
            // imageBase64Data
            const currentFile: Blob = files[0];
            const myFileItemReader = new FileReader();

            myFileItemReader.onload = this.loadHandler;
            myFileItemReader.onerror = this.loadErrorHandler;

            myFileItemReader.readAsDataURL(currentFile);
         }
      }
   };

   public loadHandler = (e: any) => {
      const myImage: any = this.imageRef.current;
      const myResult: any = e.target.result;
      myImage.src = myResult;

      myImage.onload = () => {
         // set prev image sizes
         let width: number = 300;
         let height: number =
            (width * myImage.naturalHeight) / myImage.naturalWidth;
         if (myImage.naturalHeight > myImage.naturalWidth) {
            height = 300;
            width = (height * myImage.naturalWidth) / myImage.naturalHeight;
         }

         const size: imgSize = {
            full: [myImage.naturalWidth, myImage.naturalHeight],
            prev: [width, height]
         };

         this.setState({
            imgSrc: myResult,
            imgSrcExt: extractImageFileExtensionFromBase64(myResult),
            imgSize: size,
            imgIsLoaded: true
         });

         this.setCanvasArea(size.prev);
         this.handleCanvas();
      };
   };

   public loadErrorHandler = (e: any) => {
      alert('Error while uploading')
   }

   public setCanvasArea = (size: number[]): void => {
      const edge: number = Math.sqrt(size[0] ** 2 + size[1] ** 2);
      const canvas: any = this.imagePreviewCanvasRef.current;

      canvas.width = edge;
      canvas.height = edge;
      canvas.style.width = "400px"; // show at 50% on screen
      canvas.style.height = "400px";
   };

   public handleRotate = (e: any, value: number): void => {
      this.setState({ angle: value }, () => {
         this.handleCanvas();
      });
   };

   public handleGrayscale = (e: any, value: number): void => {
      this.setState({ grayscale: value }, () => {
         this.handleCanvas();
      });
   };

   public handlePixels = (): void => {
      const { imgSize, imgSrcExt, angle } = this.state;
      const boundary = calcOuterRec(angle, imgSize.full[0], imgSize.full[1]);
      const pixels = {
         w: parseInt(boundary[0].toFixed(0)),
         h: parseInt(boundary[1].toFixed(0)),
         size: parseInt((boundary[0] * boundary[1]).toFixed(0))
      };

      this.setState({ pixels });
   };

   public handleCanvas = (canvasSize?: number[], fullSize?: boolean): void => {
      const { imgSize, angle, grayscale } = this.state;
      const myImage: any = this.imageRef.current;
      let canvas: any = this.imagePreviewCanvasRef.current;
      let size = imgSize.prev;

      if (fullSize) {
         size = imgSize.full;
         canvas = this.imageFullCanvasRef.current;
      }

      if (canvasSize) {
         canvas.width = canvasSize[0];
         canvas.height = canvasSize[1];
      }

      const ctx: any = canvas.getContext("2d");

      this.handlePixels();

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

   public handleDownloadClick = (e: any): void => {
      e.preventDefault();
      const { imgSize, imgSrcExt, angle } = this.state;
      const canvas: any = this.imageFullCanvasRef.current;
      // crop canvas size to fit the image
      const outerRec = calcOuterRec(angle, imgSize.full[0], imgSize.full[1]);
      this.setCanvasArea(imgSize.full);
      this.handleCanvas(outerRec, true);
      this.setCanvasArea(imgSize.prev);
      const imageData64 = canvas.toDataURL("image/" + imgSrcExt);
      const myFilename = "previewFile." + imgSrcExt;
      this.handleCanvas();
      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      // console.log(myNewCroppedFile);
      // download file
      downloadBase64File(imageData64, myFilename);
      // this.handleClearToDefault()
   };

   public handleClearToDefault = (): void => {
      // if (e) e.preventDefault()
      const canvas: any = this.imagePreviewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.setState({
         imgSrc: "",
         imgSrcExt: "",
         imgSize: {
            full: [0, 0],
            prev: [0, 0]
         },
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
            {!imgIsLoaded ? (
               <Grid>
                  <Dropzone
                     onDrop={this.handleOnDrop}
                     accept={image.acceptedFileTypes}
                     multiple={false}
                     maxSize={image.maxSize}
                     style={{
                        width: "400px",
                        height: "400px",
                        borderWidth: "2px",
                        borderColor: 'rgb(102, 102, 102")',
                        borderStyle: "dashed",
                        borderRadius: "5px",
                        background: "#ebebeb"
                     }}
                  >
                     Drop image here or click to upload
                  </Dropzone>
               </Grid>
            ) : (
               <>
                  <canvas
                     ref={this.imagePreviewCanvasRef}
                     style={{ background: "#ebebeb" }}
                  />
                  <Typography id="label">
                     Rotate {this.state.angle}
                     deg
                  </Typography>
                  <Slider
                     min={0}
                     max={360}
                     value={this.state.angle}
                     aria-labelledby="label"
                     step={1}
                     onChange={this.handleRotate}
                  />
                  <Typography id="label">Black and White</Typography>
                  <Slider
                     min={0}
                     max={100}
                     step={1}
                     value={this.state.grayscale}
                     aria-labelledby="label"
                     onChange={this.handleGrayscale}
                  />
                  {this.state.pixels.w} x {this.state.pixels.h} ={" "}
                  {this.state.pixels.size}
               </>
            )}
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
            <canvas ref={this.imageFullCanvasRef} style={{ display: "none" }} />
            <img ref={this.imageRef} src="" style={{ display: "none" }} />
         </>
      );
   }
}

export default Image;
