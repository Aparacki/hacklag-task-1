import React, { SFC, ReactNode } from "react";

interface CrimesMapMarkerProps {
	lat: number;
	lng: number;
	text: string;
}
const CrimesMapMarker = ({ lat, lng, text }: CrimesMapMarkerProps) => (
	<div>
		<b>test</b>
		<img
			style={{ width: "30px", height: "50px" }}
			src="https://www.abyssantosuitesandspa.com/wp-content/uploads/2017/02/google-maps-marker-for-residencelamontagne-hi.png"
		/>
	</div>
);

export default CrimesMapMarker;
