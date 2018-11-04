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
   imgSize: number[];
   canvas: number[];
   rotate: number;
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
         imgSize: [0, 0],
         canvas: [0, 0],
         rotate: 0
      };
   }
   private imagePreviewCanvasRef = React.createRef<HTMLCanvasElement>();
   private imageRef = React.createRef<HTMLImageElement>();

   public componentDidMount() {
      console.log("did mount");
      this.setState({});
   }

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
            const canvas: any = this.imagePreviewCanvasRef.current;
            const ctx: any = canvas.getContext("2d");

            myFileItemReader.addEventListener(
               "load",
               () => {
                  myResult = myFileItemReader.result;
                  myImage.src = myResult;

                  myImage.onload = () => {
                     const edge = Math.sqrt(
                        Math.pow(myImage.naturalWidth, 2) +
                           Math.pow(myImage.naturalHeight, 2)
                     );
                     canvas.width = edge;
                     canvas.height = edge;
                     canvas.style.width = "30%"; // show at 50% on screen
                     canvas.style.height = "30%";

                     this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(
                           myResult
                        ),
                        imgSize: [myImage.naturalWidth, myImage.naturalHeight]
                     });
                     // console.log(myImage.naturalWidth, myImage.naturalHeight);
                     ctx.drawImage(
                        myImage,
                        (canvas.width - myImage.naturalWidth) / 2,
                        (canvas.height - myImage.naturalHeight) / 2,
                        myImage.naturalWidth,
                        myImage.naturalHeight
                     );
                     this.handleChangeRotate()
                  };
               },
               false
            );

            myFileItemReader.readAsDataURL(currentFile);
         }
      }
   };
   public handleChangeRotate = (e?: any,canvasSize?:number[]) => {
      // console.log(e.target.value);
      const { imgSize } = this.state;
      let degrees = this.state.rotate
      if(e){
         console.log('event')
      degrees = parseInt(e.target.value)
      }
      this.setState({ rotate: degrees });

      const myImage: any = this.imageRef.current;
      const canvas: any = this.imagePreviewCanvasRef.current;
      const ctx: any = canvas.getContext("2d");

      if(canvasSize){
         canvas.width = canvasSize[0];
         canvas.height = canvasSize[1];
      }
      ctx.save(); //saves the state of canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
      ctx.drawImage(
         myImage,
         (canvas.width - imgSize[0]) / 2,
         (canvas.height - imgSize[1]) / 2,
         imgSize[0],
         imgSize[1]
      );
      ctx.restore();
   };

   public handleDownloadClick = (e: any) => {
      e.preventDefault();
      const {imgSize,  imgSrcExt, rotate } = this.state;
      const canvas: any = this.imagePreviewCanvasRef.current;

      // crop canvas size to fit the image
      const outerRec = calcOuterRec(rotate, imgSize[0], imgSize[1])
      this.handleChangeRotate('',outerRec)

      const imageData64 = canvas.toDataURL("image/" + imgSrcExt);
      const myFilename = "previewFile." + imgSrcExt;

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
         rotate: 0
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
                        value={this.state.rotate}
                        step="2"
                        onChange={this.handleChangeRotate}
                     />
                  </label>
                  <button onClick={this.handleClearToDefault}>Clear</button>
                  <button onClick={this.handleDownloadClick}>Download</button>

               </>
            )}
            <canvas
               ref={this.imagePreviewCanvasRef}
               style={{ background: "#ebebeb" }}
            />
            <br />
                              {this.state.rotate}
                  deg
            <br />
            x: {this.state.canvas[0].toFixed(0)}
            <br />
            y: {this.state.canvas[1].toFixed(0)}
            <img ref={this.imageRef} src="" style={{ display: "none" }} />
         </div>
      );
   }
}

export default App;
