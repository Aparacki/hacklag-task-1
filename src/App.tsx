import React, { Component } from "react";
import Dropzone from "react-dropzone";
import ProcessImage from "react-imgpro";

import {
   base64StringtoFile,
   downloadBase64File,
   extractImageFileExtensionFromBase64,
   image64toCanvasRef
} from "./components/utils/ImageUtils";

import calcOuterRec from "./components/utils/CalcRect";
interface IState {
   imgSrc: string;
   imgSrcExt: string;
   imgSize: imgSize;
   angle: number;
   grayscale: number;
   pixels: number;
}

interface imgSize {
   full: number[];
   prev: number[];
}

const imageMaxSize: number = 1000000000; // bytes
const acceptedFileTypes: string =
   "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray: any = acceptedFileTypes.split(",").map(item => {
   return item.trim();
});

class App extends Component<{}, IState> {
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
         pixels: 0
      };
   }
   private imagePreviewCanvasRef = React.createRef<HTMLCanvasElement>();
   private imageFullCanvasRef = React.createRef<HTMLCanvasElement>();
   private imageRef = React.createRef<HTMLImageElement>();

   private verifyFile = (files: any[]) => {
      if (files && files.length > 0) {
         const currentFile: any = files[0];
         const currentFileType: string = currentFile.type;
         const currentFileSize: number = currentFile.size;
         if (currentFileSize > imageMaxSize) {
            alert(
               "This file is not allowed. " +
                  currentFileSize +
                  " bytes is too large"
            );
            return false;
         }
         if (!acceptedFileTypesArray.includes(currentFileType)) {
            alert("This file is not allowed. Only images are allowed.");
            return false;
         }
         return true;
      }
   };

   public handleOnDrop = (files: any[], rejectedFiles: any[]): void => {
      if (rejectedFiles && rejectedFiles.length > 0) {
         this.verifyFile(rejectedFiles);
      }

      if (files && files.length > 0) {
         const isVerified = this.verifyFile(files);
         if (isVerified) {
            // imageBase64Data
            const currentFile = files[0];
            const myFileItemReader = new FileReader();
            let myResult: any;
            const myImage: any = this.imageRef.current;

            myFileItemReader.addEventListener(
               "load",
               () => {
                  myResult = myFileItemReader.result;
                  myImage.src = myResult;

                  myImage.onload = () => {
                     let width = 300;
                     let height = width * myImage.naturalHeight / myImage.naturalWidth
                     if(myImage.naturalHeight > myImage.naturalWidth){
                        height = 300
                        width = height * myImage.naturalWidth / myImage.naturalHeight
                     }
                     const size = {
                        full:[myImage.naturalWidth, myImage.naturalHeight],
                        prev:[width, height]
                     }

                     this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(
                           myResult
                        ),
                        imgSize: size
                     });

                     this.setCanvasArea(size.prev);
                     this.handleCanvas();
                  };
               },
               false
            );

            myFileItemReader.readAsDataURL(currentFile);
         }
      }
   };

   public setCanvasArea = (size:number[]) => {
      const edge = Math.sqrt(size[0] ** 2 + size[1] ** 2);
      const canvas: any = this.imagePreviewCanvasRef.current;

      canvas.width = edge;
      canvas.height = edge;
      canvas.style.width = "400px"; // show at 50% on screen
      canvas.style.height = "400px";
   };

   public handleRotate = (e: any) => {
      const angle: number = e.target.value;
      this.setState({ angle }, () => {
         this.handleCanvas();
      });
   };

   public handleGrayscale = (e: any) => {
      const grayscale = e.target.value;
      this.setState({ grayscale }, () => {
         this.handleCanvas();
      });
   };

   public handlePixels = () => {
      const { imgSize, imgSrcExt, angle } = this.state;
      const boundary = calcOuterRec(angle, imgSize.full[0], imgSize.full[1]);
      const pixels: number = parseInt((boundary[0] * boundary[1]).toFixed(0));
      this.setState({ pixels });
   };

   public handleCanvas = (canvasSize?: number[], fullSize?: boolean) => {
      const { imgSize, angle, grayscale } = this.state;
      const myImage: any = this.imageRef.current;
      let canvas: any = this.imagePreviewCanvasRef.current;     
      let size = imgSize.prev     

      if (fullSize){
         size = imgSize.full    
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
      )
      ctx.restore();

   };

   public handleDownloadClick = (e: any) => {
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

   public handleClearToDefault = () => {
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
         pixels: 0
      });
      // this.fileInputRef.current.value = null
   };

   public render(): JSX.Element {
      const { imgSrc } = this.state;
      return (
         <div className="App">
            {!imgSrc ? (
               <Dropzone
                  onDrop={this.handleOnDrop}
                  accept={acceptedFileTypes}
                  multiple={false}
                  maxSize={imageMaxSize}
               >
                  Drop image here or click to upload
               </Dropzone>
            ) : (
               <>
                  <label>
                     Rotate:
                     <input
                        type="range"
                        id="cowbell"
                        name="cowbell"
                        min="0"
                        max="360"
                        value={this.state.angle}
                        step="2"
                        onChange={this.handleRotate}
                     />
                  </label>
                  <label>
                     Black and White:
                     <input
                        type="range"
                        id="cowbell"
                        name="cowbell"
                        min="0"
                        max="100"
                        value={this.state.grayscale}
                        step="2"
                        onChange={this.handleGrayscale}
                     />
                  </label>
                  {this.state.pixels}
                  px
                  <button onClick={this.handleClearToDefault}>Clear</button>
                  <button onClick={this.handleDownloadClick}>Download</button>
               </>
            )}
            <canvas
               ref={this.imagePreviewCanvasRef}
               style={{ background: "#ebebeb" }}
            />
            <canvas
               ref={this.imageFullCanvasRef}
               style={{ display: "none" }}
            />
            <br />
            {this.state.angle}
            deg
            <img ref={this.imageRef} src="" style={{ display: "none" }} />
         </div>
      );
   }
}

export default App;
