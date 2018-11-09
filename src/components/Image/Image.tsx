import React, { Component } from "react";
import ImageCanvas from "./ImageCanvas";
import {
   base64StringtoFile,
   downloadBase64File,
   extractImageFileExtensionFromBase64
} from "./utils/imageUtils";

// types
import { ImageState as State, ImageProps as Props } from "./typesImage";

class Image extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = {
         imgSrc: "",
         imgSize: [0, 0]
      };
   }

   private imageRef = React.createRef<HTMLImageElement>();
   private fullCanvasRef = React.createRef<HTMLCanvasElement>();

   public componentDidUpdate = () => {
      // console.log("_image did update")
   };

   public componentWillUnmount = () => {
      // console.log("_image will unmount")
      this.handleClearToDefault();
   };

   // Load image and get its properties
   public loadImageHandler = (e: any) => {
      const myImage: any = e.target;
      const { imgSrc, imgType } = this.props;
      // console.log(imgSrc);
      const size = [myImage.naturalWidth, myImage.naturalHeight];

      this.setState({
         imgSrc,
         imgSize: size
      });
   };

   // transform full size canvas to file and download it
   public handleDownload = ():void => {
      const canvas: any = this.fullCanvasRef.current;
      const imageData64: string | null = canvas.toDataURL(this.props.imgType);
      const imgExt = extractImageFileExtensionFromBase64(imageData64);
      const myFilename = "previewFile." + imgExt;
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      downloadBase64File(imageData64, myFilename);
   };

   public handleClearToDefault = (): void => {
      this.setState({
         imgSrc: "",
         imgSize: [0, 0]
      });
   };

   public render(): JSX.Element {
      return (
         <>
            {this.state.imgSize[0] > 0 ? (
               <>
                  <ImageCanvas
                     img={this.state}
                     imgRef={this.imageRef as any}
                     fullCanvasRef={this.fullCanvasRef as any}
                     handleDownload={this.handleDownload}
                  >
                  </ImageCanvas>
               </>
            ) : null}
            )}
            <canvas ref={this.fullCanvasRef} style={{ display: "none" }} />
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
