import React, { SFC, ReactNode } from "react";
import GoogleMapReact from "google-map-react";
import { Map } from "./typesCrimes";
import CrimesMapMarker from "./CrimesMapMarker";

interface Props {
	props:Map
}


const CrimesMap: SFC<Props>= ({ props }) => (
	<div style={{ height: "400px", width: "100%" }}>
		{props.setMarker ? (
			<GoogleMapReact
				bootstrapURLKeys={{
					key: "AIzaSyDAmm_PlRJxysFHCfi8CAyWgQFRhthTJUs"
				}}
				center={props.coords}
				defaultCenter={{ lat: 38.55042047, lng: -121.3914158 }}
				defaultZoom={11}
			>
				<CrimesMapMarker
					lat={props.coords.lat}
					lng={props.coords.lng}
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
