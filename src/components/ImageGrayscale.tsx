import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";


interface Props {
	onChange(angle: number): void;	
	onDragEnd(angle: number): void;	
}
class ImageRotate extends Component<Props, {value:number}> {
	constructor(props:Props){
		super(props)
		this.state = {
			value:0
		}
	}
	public handleChange = (e:any,value:number) => {	
		this.setState({
			value
		}, () => {this.props.onChange(this.state.value)})

	}
	public handleDragEnd = () => {
		this.props.onDragEnd(this.state.value)
	}	
   public render(): JSX.Element {
      return (
         <>
         <Typography id="label">
			Grayscale {this.state.value}% 
		</Typography>
		<Slider
			min={0}
			max={100}
			value={this.state.value}
			aria-labelledby="label"
			step={1}
			onChange={this.handleChange}
			onDragEnd={this.handleDragEnd}
		/>
         </>
         )
         }	
}


export default ImageRotate;
