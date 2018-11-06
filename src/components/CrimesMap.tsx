import React, { SFC, ReactNode } from "react";
import GoogleMapReact from 'google-map-react';
import {Coords} from "./CrimesTypes"

interface Props{
	coords: Coords;
}
interface AnyReactComponentProps {
	lat:number;
	lng:number;
	text:string;
}
const AnyReactComponent= ({lat,lng,text}:AnyReactComponentProps) => <div><b>test</b><img style={{width:"30px",height:"50px"}} src="https://www.abyssantosuitesandspa.com/wp-content/uploads/2017/02/google-maps-marker-for-residencelamontagne-hi.png" /></div>;
const CrimesMap: SFC < Props >  = ({ coords }) => (
<div style={{ height: '400px', width: '400px' }}>
        {coords.lat} , {coords.lng}
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDAmm_PlRJxysFHCfi8CAyWgQFRhthTJUs'}}
          center={coords}
          defaultZoom={11}
        >
          <AnyReactComponent
            lat={coords.lat}
            lng={coords.lng}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>

      </div>
)

export default CrimesMap;