export interface CrimeState {
	table: any[];
	headers: string[];
	loaded: boolean;
	mapObj: Map;
}

export interface CrimeProps {
	csvSrc: string;
	csvType: string;
}

export interface Map {
	coords:Coords;
	setMarker: boolean;
}

interface Coords {
	lat: number ;
	lng: number ;
}
