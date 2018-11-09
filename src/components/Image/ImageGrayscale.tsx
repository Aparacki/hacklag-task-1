import React, { SFC, ReactNode } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/lab/Slider";
import "../../App.css"

interface Props {
	value:number;
	onChange(e: any, value: number): void;
}

const ImageRotate: SFC<Props> = ({ value, onChange }) => (
	<>
		<Typography id="label">
			Grayscale
		</Typography>
		<Slider className="slider"
			min={0}
			max={100}
			value={value}
			aria-labelledby="label"
			step={1}
			onChange={onChange}
		/>
	</>
);

export default ImageRotate;
