export interface IState {
	table: any[];
	headers: string[];
	loaded: boolean;
	mapObj: mapObj;
}
export interface mapObj {
	coords:Coords ;
	setMarker: boolean;
}
export interface Coords {
	lat: number ;
	lng: number ;
}
