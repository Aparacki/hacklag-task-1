import React, { Component } from "react";
import Dropzone from "react-dropzone";
import ImageCanvas from "./ImageCanvas"
import {
   base64StringtoFile,
   downloadBase64File,
   extractImageFileExtensionFromBase64,
   image64toCanvasRef
} from "./utils/ImageUtils";
import { verifyFile } from "./utils/Utils";

import {image as imageUploadOptions } from "./utils/UploadOptions"

import {ImageState as State } from "./ImageTypes"

class Image extends Component<{}, State> {
   constructor(props: {}) {
      super(props);
      this.state = {
         imgSrc: "",
         imgSrcExt: "",
         imgSize: [0, 0],
      };
   }

   private imageRef = React.createRef<HTMLImageElement>();


   public componentDidMount = () => {

   }

   public handleOnDrop = (files: any[], rejectedFiles: any[]): void => {
      if (rejectedFiles && rejectedFiles.length > 0) {
         verifyFile(rejectedFiles, imageUploadOptions);
      }

      if (files && files.length > 0) {
         const isVerified = verifyFile(files, imageUploadOptions);
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
         const size = [myImage.naturalWidth, myImage.naturalHeight]

         this.setState({
            imgSrc: myResult,
            imgSrcExt: extractImageFileExtensionFromBase64(myResult),
            imgSize: size,
         });
      };
   };

   public loadErrorHandler = (e: any) => {
      alert('Error while uploading')
   }

   public handleClearToDefault = (): void => {
      // if (e) e.preventDefault()
      this.setState({
         imgSrc: "",
         imgSrcExt: "",
         imgSize: [0,0]
      });
      // this.fileInputRef.current.value = null
   };

   public handleDownloadClick = (imageData64:any): void => {
      // e.preventDefault();
      // crop canvas size to fit the image
      // const imageData64 = canvas.toDataURL("image/" + this.state.imgSrcExt);
      const myFilename = "previewFile." + this.state.imgSrcExt;
      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      // console.log(myNewCroppedFile);
      // download file
      downloadBase64File(imageData64, myFilename);
      // this.handleClearToDefault()
   };
   public render(): JSX.Element {
      return (
         <>
                  <Dropzone
                     onDrop={this.handleOnDrop}
                     accept={imageUploadOptions.acceptedFileTypes}
                     multiple={false}
                     maxSize={imageUploadOptions.maxSize}
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
               {this.state.imgSrc ?
                  <ImageCanvas  img={this.state} /> 
                  :
                  ''
               }
               

              
            )}
           
            <img ref={this.imageRef} src="" style={{ display: "none" }} />
         </>
      );
   }
}

export default Image;
