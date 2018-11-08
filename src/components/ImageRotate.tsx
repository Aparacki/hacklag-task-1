import React, { SFC, ReactNode } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";


interface Props {
	value:number;
	onChange(e: any, value: number): void;
}

const ImageRotate: SFC<Props> = ({ value, onChange }) => (
	<>
		<Typography id="label">
			Rotate {value}
			deg
		</Typography>
		<Slider
			min={0}
			max={360}
			value={value}
			aria-labelledby="label"
			step={1}
			onChange={onChange}
		/>
	</>
);

export default ImageRotate;
