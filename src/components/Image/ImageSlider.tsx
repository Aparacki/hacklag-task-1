import React, { SFC, ReactNode } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/lab/Slider";
import "../../App.css"

interface Props {
	value:number;
	max:number;
	onChange(e: any, value: number): void;
}

const ImageSlider: SFC<Props> = ({ value, max, onChange, children }) => (
	<>
		<Typography id="label">
			{children}
		</Typography>
		<Slider className="slider"
			min={0}
			max={max}
			value={value}
			aria-labelledby="label"
			step={1}
			onChange={onChange}
		/>
	</>
);

export default ImageSlider;
