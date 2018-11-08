import React, { Component } from "react";
import ImageCanvas from "./ImageCanvas";
import {
   base64StringtoFile,
   downloadBase64File,
   extractImageFileExtensionFromBase64,
   image64toCanvasRef
} from "./utils/ImageUtils";

import { image as imageUploadOptions } from "./utils/UploadOptions";

import { ImageState as State } from "./ImageTypes";
interface Props {
   imgSrc: any;
   imgSrcExt: any;
}
class Image extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = {
         imgSrc: "",
         imgSrcExt: "",
         imgSize: [0, 0]
      };
   }

   private imageRef = React.createRef<HTMLImageElement>();

   public loadImageHandler = (e: any) => {
      const myImage: any = e.target
      const { imgSrc, imgSrcExt } = this.props;
      const size = [myImage.naturalWidth, myImage.naturalHeight];

      this.setState({
         imgSrc,
         imgSrcExt,
         imgSize: size
      });
   };

   public componentDidUpdate = () => {
         console.log("_image did update")
   }
   public componentWillUnmount = () => {
         console.log("_image will unmount")

      this.handleClearToDefault()
   }

   public handleClearToDefault = (): void => {
      // if (e) e.preventDefault()
      this.setState({
         imgSrc: "",
         imgSrcExt: "",
         imgSize: [0, 0]
      });
      // this.fileInputRef.current.value = null
   };

   public handleDownloadClick = (imageData64: any): void => {
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
            {this.state.imgSrc ? (
                  <ImageCanvas img={this.state} imgRef={this.imageRef as any}/>
            ) : (
               null
            )}
            )}
            <img
               ref={this.imageRef}
               src={this.props.imgSrc}
               onLoad={this.loadImageHandler}
               style={{ display: "none" }}
            />
         </>
      );
   }
}

export default Image;
