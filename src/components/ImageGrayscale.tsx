import React, { SFC, ReactNode } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";

interface Props {
	value: number;
	onChange(e: any, value: number): void;
}

const ImageGrayscale: SFC<Props> = ({ value, onChange }) => (
	<>
		<Typography id="label">Black and White</Typography>
		<Slider
			min={0}
			max={100}
			step={1}
			value={value}
			aria-labelledby="label"
			onChange={onChange}
		/>
	</>
);

export default ImageGrayscale;
