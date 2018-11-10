export interface CrimeState {
	table: any[];
	headers: string[];
	headersLength:number;
	loaded: boolean;
	mapObj: Map;
}

export interface CrimeProps {
	csvSrc: string;
	csvType: string;
}

export interface CrimeTableProps { 
headers:string[];
table:any[];
headersLength:number;
tableWidth:number;
onRowClick:any;
}

export interface Map {
	coords:Coords;
	setMarker: boolean;
}

interface Coords {
	lat: number ;
	lng: number ;
}
