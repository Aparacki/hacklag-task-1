import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { Options } from "./utils/Types";
import { uploadOptions } from "./FiledropUploadOptions";

import Image from "./Image";
import Crimes from "./Crimes";

interface State {
   acceptedFileTypes: string;
   acceptedMaxFileSize: number;
   uploadedFile: string;
   uploadedFileType: string;
}
class Dropfile extends Component<{}, State> {
   constructor(props: {}) {
      super(props);
      this.state = {
         acceptedFileTypes: "",
         acceptedMaxFileSize: 0,
         uploadedFile: "",
         uploadedFileType: ""
      };
   }

   public componentDidMount() {
      this.acceptedMaxFileSize();
      this.acceptedFileTypes();
      console.log(this.state);
   }

   public componentDidUpdate() {
      console.log(this.state);
   }

   public acceptedFileTypes = () => {
      const uploadFileTypes = uploadOptions.map(el => {
         return el.acceptedFileTypes;
      });
      this.setState({
         acceptedFileTypes: uploadFileTypes.join()
      });
      // console.log(uploadFileTypes.join())
   };
   public acceptedMaxFileSize = () => {
      const uploadFileSizes = uploadOptions.map(el => {
         return el.maxSize;
      });
      this.setState({
         acceptedMaxFileSize: Math.max(...uploadFileSizes)
      });
      // console.log(uploadFileTypes.join())
   };
   public verifyFile = (files: any[]): boolean => {
      const { acceptedFileTypes, acceptedMaxFileSize } = this.state;

      if (files && files.length > 0) {
         const currentFile: any = files[0];
         const currentFileType: string = currentFile.type;
         const currentFileSize: number = currentFile.size;

         // verifying size
         if (currentFileSize > acceptedMaxFileSize) {
            alert(
               "This file is not allowed. " +
                  currentFileSize +
                  " bytes is too large. Max file size is " +
                  acceptedMaxFileSize
            );
            return false;
         }

         //verifyin type
         ////nie wiem dlaczego include nie działa na typie :string[]
         const acceptedFileTypesArray: any = acceptedFileTypes
            .split(",")
            .map(item => {
               return item.trim();
            });

         if (!acceptedFileTypesArray.includes(currentFileType)) {
            alert("This file is not allowed");
            return false;
         }
         this.setState({ uploadedFileType: currentFileType });
         return true;
      }
      return false;
   };

   public handleOnDrop = (files: any[], rejectedFiles: any[]): void => {
      if (rejectedFiles && rejectedFiles.length > 0) {
         this.verifyFile(rejectedFiles);
         console.log("rejected");
      }

      if (files && files.length > 0) {
         const isVerified = this.verifyFile(files);
         if (isVerified) {
            console.log("trure if verifed");
            const currentFile: Blob = files[0];
            var reader = new FileReader();

            reader.readAsDataURL(currentFile);
            reader.onload = this.loadHandler;
            reader.onerror = this.loadErrorHandler;
         }
      }
   };
   public loadHandler = (e: ProgressEvent | any) => {
      // this.renderCorrespondingComponent();
      // console.log(e.target.result)
   };

   public setCorrespondingComponent = (): string => {
      const { uploadedFileType } = this.state;

      function filterByID(item: any) {
         const acceptedFileTypes: any = item.acceptedFileTypes
            .split(",")
            .map((item: any) => {
               return item.trim();
            });

         if (acceptedFileTypes.includes(uploadedFileType)) {
            return true;
         }
      }
      const uploadFileType: any = uploadOptions.filter(filterByID);

      return uploadFileType[0].name;
   };

   public loadErrorHandler = (e: any) => {
      alert("Error while uploading");
   };

   public render(): JSX.Element {
      return (
         <>
            {this.state.acceptedFileTypes ? (
               <>
                  <Dropzone
                     onDrop={this.handleOnDrop}
                     accept={this.state.acceptedFileTypes}
                     multiple={false}
                     maxSize={this.state.acceptedMaxFileSize}
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
                  {this.state.uploadedFileType
                     ? (() => {
                          switch (this.setCorrespondingComponent()) {
                             case "image":
                                return <Image />;
                             case "csv":
                                return <Crimes />;
                             default:
                                null;
                          }
                       })()
                     : null}
               </>
            ) : null}
         </>
      );
   }
}

export default Dropfile;
