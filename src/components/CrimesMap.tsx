import React, { SFC, ReactNode } from "react";
import GoogleMapReact from "google-map-react";
import { mapObj } from "./CrimesTypes";
import CrimesMapMarker from "./CrimesMapMarker";

interface Props {
	mapObj: mapObj;
}

const CrimesMap: SFC<Props> = ({ mapObj }) => (
	<div style={{ height: "400px", width: "400px" }}>
		{mapObj.setMarker ? (
			<GoogleMapReact
				bootstrapURLKeys={{
					key: "AIzaSyDAmm_PlRJxysFHCfi8CAyWgQFRhthTJUs"
				}}
				center={mapObj.coords}
				defaultCenter={{ lat: 38.55042047, lng: -121.3914158 }}
				defaultZoom={11}
			>
				<CrimesMapMarker
					lat={mapObj.coords.lat}
					lng={mapObj.coords.lng}
					text={"Kreyser Avrora"}
				/>
			</GoogleMapReact>
		) : (
			<GoogleMapReact
				bootstrapURLKeys={{
					key: "AIzaSyDAmm_PlRJxysFHCfi8CAyWgQFRhthTJUs"
				}}
				defaultCenter={{ lat: 38.55042047, lng: -121.3914158 }}
				defaultZoom={11}
			/>
		)}
	</div>
);

export default CrimesMap;
