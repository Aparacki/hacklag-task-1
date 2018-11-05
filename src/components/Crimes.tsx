import React, { Component } from "react";
import Dropzone from "react-dropzone";

class Crimes extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.state = {}
  }

  public render(): JSX.Element {
  	return (
  		<span>Crimes</span>
  		)
  }
}

export default Crimes;