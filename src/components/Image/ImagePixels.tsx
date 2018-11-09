import React, { SFC, ReactNode } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { Pixels } from "./typesImage";
interface Props {
	value: Pixels;
}

const ImagePixels: SFC<Props> = ({ value }) => (
	<>
		<Typography>
			Width: {value.w}
			px
		</Typography>
		<Typography>
			Height: {value.h}
			px
		</Typography>
		<Typography>
			Size: {value.size}
			px
		</Typography>
	</>
);

export default ImagePixels;
