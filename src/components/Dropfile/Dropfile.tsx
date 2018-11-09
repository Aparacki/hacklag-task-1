import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { filedropConfig } from "./filedropConfig";
// types
import { DropfileState as State } from "./typesDropfile";
// Components to be rendered
import Image from "../Image/Image";
import Crimes from "../Crimes/Crimes";
// css
import "../../App.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import DeleteIcon from "@material-ui/icons/Delete";

class Dropfile extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      acceptedFileTypes: "",
      acceptedMaxFileSize: 0,
      uploadedFile: "",
      uploadedMimeType: "",
      dropZoneText: "Drop image or csv file here or click to upload",
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
    // console.log("DROPFILE DID UPDATE");
  }
  //set accepted file types
  public acceptedFileTypes = (): string => {
    const uploadFileTypes = filedropConfig.map(el => {
      return el.acceptedFileTypes;
    });
    return uploadFileTypes.join();
    // console.log(uploadFileTypes.join())
  };

  //set accepted file size
  public acceptedMaxFileSize = (): number => {
    const uploadFileSizes = filedropConfig.map(el => {
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
        console.log(currentFile);
        const uploadedMimeType = files[0].type;
        const dropZoneText =
          files[0].name +
          " - " +
          (files[0].size / 1024).toFixed(0) +
          "kb - " +
          files[0].type;

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
            dropZoneText,
            isLoaded: true
          });
        };

        reader.onerror = function(e) {
          alert("Error while uploading");
        };
      }
    }
  };

  //return file type depends on mime types
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
    const uploadFileType: any = filedropConfig.filter(filterByID);

    return uploadFileType[0].name;
  };

  public handleClearToDefault = (): void => {
    // if (e) e.preventDefault()
    this.setState({
      dropZoneText: "Drop image or csv file here or click to upload",
      isLoaded: false
    });
    // this.fileInputRef.current.value = null
  };

  public render(): JSX.Element {
    const {
      uploadedFile,
      uploadedMimeType,
      dropZoneText,
      isLoaded
    } = this.state;
    return (
      <>
        {this.state.acceptedFileTypes ? (
          <div style={{ padding: "5%", overflow: "hidden" }}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Dropzone
                  onDrop={this.handleOnDrop}
                  className="dropzone"
                  activeClassName="dropzone-active"
                  accept={this.state.acceptedFileTypes}
                  multiple={false}
                  maxSize={this.state.acceptedMaxFileSize}
                >
                  {dropZoneText}
                </Dropzone>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Button
                disabled={!isLoaded}
                  variant="contained"
                  fullWidth={true}
                  onClick={this.handleClearToDefault}
                >
                  Clear all
                  <DeleteIcon />
                </Button>
              </Grid>
              {isLoaded
                ? (() => {
                    switch (this.fileType()) {
                      case "image":
                        return (
                          <Grid item xs={12} sm={12} md={8} lg={6}>
                            <Image
                              imgSrc={uploadedFile}
                              imgType={uploadedMimeType}
                            />
                          </Grid>
                        );
                      case "csv":
                        return (
                          <Grid item xs={12}>
                            <Crimes
                              csvSrc={uploadedFile}
                              csvType={uploadedMimeType}
                            />
                          </Grid>
                        );
                      default:
                        null;
                    }
                  })()
                : null}
            </Grid>
          </div>
        ) : null}
      </>
    );
  }
}

export default Dropfile;
