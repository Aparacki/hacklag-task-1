import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { Options } from "./utils/Types";
import { uploadOptions } from "./FiledropUploadOptions";

// Components to be rendered
import Image from "./Image";
import Crimes from "./Crimes";

interface State {
   acceptedFileTypes: string;
   acceptedMaxFileSize: number;
   uploadedFile: string;
   uploadedMimeType: string;
   isLoaded: boolean;
}
class Dropfile extends Component<{}, State> {
   constructor(props: {}) {
      super(props);
      this.state = {
         acceptedFileTypes: "",
         acceptedMaxFileSize: 0,
         uploadedFile: "",
         uploadedMimeType: "",
         isLoaded: false
      };
   }

   public componentDidMount() {
      const acceptedFileTypes: string = this.acceptedFileTypes();
      const acceptedMaxFileSize: number = this.acceptedMaxFileSize();
      this.setState({
         acceptedFileTypes,
         acceptedMaxFileSize
      });
   }

   public componentDidUpdate() {
      console.log("DROPFILE DID UPDATE");
   }
   //set accepted file types
   public acceptedFileTypes = (): string => {
      const uploadFileTypes = uploadOptions.map(el => {
         return el.acceptedFileTypes;
      });
      return uploadFileTypes.join();
      // console.log(uploadFileTypes.join())
   };

   //set accepted file size
   public acceptedMaxFileSize = (): number => {
      const uploadFileSizes = uploadOptions.map(el => {
         return el.maxSize;
      });
      return Math.max(...uploadFileSizes);
      // console.log(uploadFileTypes.join())
   };

   //verify if file fits requirements
   public verifyFile = (files: any[]): boolean => {
      const { acceptedFileTypes, acceptedMaxFileSize } = this.state;

      if (files && files.length > 0) {
         const currentFile: any = files[0];
         const currentFileType: string = currentFile.type;
         const currentFileSize: number = currentFile.size;

         // verify size
         if (currentFileSize > acceptedMaxFileSize) {
            alert(
               "This file is not allowed. " +
                  currentFileSize +
                  " bytes is too large. Max file size is " +
                  acceptedMaxFileSize
            );
            return false;
         }

         //verify type
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
         return true;
      }
      return false;
   };

   //create file
   public handleOnDrop = (files: any[], rejectedFiles: any[]): void => {
      this.setState({
         isLoaded: false
      });
      if (rejectedFiles && rejectedFiles.length > 0)
         this.verifyFile(rejectedFiles);

      if (files && files.length > 0) {
         const isVerified = this.verifyFile(files);
         if (isVerified) {
            const currentFile: Blob = files[0];
            const uploadedMimeType = files[0].type;
            const reader = new FileReader();

            switch (this.fileType(uploadedMimeType)) {
               case "image":
                  reader.readAsDataURL(currentFile);
                  break;
               case "csv":
                  reader.readAsText(currentFile);
                  break;
               default:
                  reader.readAsDataURL(currentFile);
            }

            reader.onload = (e: ProgressEvent | any) => {
               const uploadedFile = e.target.result;

               this.setState({
                  uploadedFile,
                  uploadedMimeType,
                  isLoaded: true
               });
            };

            reader.onerror = function(e) {
               alert("Error while uploading");
            };
         }
      }
   };

   //return kind of file depends on mime types
   public fileType = (type?: string): string => {
      if (!type) type = this.state.uploadedMimeType;

      function filterByID(item: any) {
         const acceptedFileTypes: any = item.acceptedFileTypes
            .split(",")
            .map((item: any) => {
               return item.trim();
            });

         if (acceptedFileTypes.includes(type)) return true;
      }
      const uploadFileType: any = uploadOptions.filter(filterByID);

      return uploadFileType[0].name;
   };

   public handleClearToDefault = (): void => {
      // if (e) e.preventDefault()
      this.setState({
         acceptedFileTypes: "",
         acceptedMaxFileSize: 0,
         uploadedFile: "",
         uploadedMimeType: "",
         isLoaded: false
      });
      // this.fileInputRef.current.value = null
   };

   public render(): JSX.Element {
      const { uploadedFile, uploadedMimeType, isLoaded } = this.state;
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
                        width: "200px",
                        height: "200px",
                        borderWidth: "2px",
                        borderColor: 'rgb(102, 102, 102")',
                        borderStyle: "dashed",
                        borderRadius: "5px",
                        background: "#ebebeb"
                     }}
                  >
                     Drop image or csv file here or click to upload
                  </Dropzone>
                  {isLoaded
                     ? (() => {
                          switch (this.fileType()) {
                             case "image":
                                return (
                                   <Image
                                      imgSrc={uploadedFile}
                                      imgType={uploadedMimeType}
                                   />
                                );
                             case "csv":
                                return (
                                   <Crimes
                                      csvSrc={uploadedFile}
                                      csvType={uploadedMimeType}
                                   />
                                );
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