import React, { Component } from "react";
import Dropzone from "react-dropzone";
import CrimesTable from "./CrimesTable";
import CrimesMap from "./CrimesMap";
import {
	CrimeState as State,
	CrimeProps as Props
} from "./typesCrimes";

class Crimes extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			table: [],
			headers: [],
			loaded: false,
			mapObj: {
				coords: {
					lat: 0,
					lng: 0
				},
				setMarker: false
			}
		};
	}
	public componentDidMount = () => {
		const { csvSrc } = this.props;
		this.processData(csvSrc);
		console.log("_csv did update");
	};

	public processData = (csv: any) => {
		let allTextLines = csv.split(/\r|\n|\r/);
		let headers = allTextLines[0].split(",");
		let csvArray = [];

		for (let i = 1; i < allTextLines.length; i++) {
			// for (let i = 1; i < 30; i++) {
			// split content based on comma
			let data = allTextLines[i].split(",");
			if (data.length === headers.length) {
				let dataObj: any = {};
				for (let j = 0; j < headers.length; j++) {
					const key: string = headers[j];
					const value: string | number = data[j];
					dataObj[key] = value;
				}
				csvArray.push(dataObj);
			}
		}
		this.setState({
			table: csvArray,
			headers
		});
	};

	public onRowClick = ({
		event,
		index,
		rowData
	}: {
		event: React.MouseEvent<any>;
		index: number;
		rowData: any;
	}): any => {
		const lat = parseFloat(rowData.latitude);
		const lng = parseFloat(rowData.longitude);

		this.setState({
			mapObj: {
				coords: {
					lat,
					lng
				},
				setMarker: true
			}
		});
		// console.log(rowData.latitude)
		// console.log(rowData.longitude)
	};
	public clearMap = () => {
		this.setState({
			mapObj: {
				coords: {
					lat: 0,
					lng: 0
				},
				setMarker: false
			}
		});
	};

	public handleClearToDefault = (): void => {
		this.setState({
			table: [],
			headers: [],
			loaded: false,
			mapObj: {
				coords: {
					lat: 0,
					lng: 0
				},
				setMarker: false
			}
		});
	};

	public render(): JSX.Element {
		const { table, headers, mapObj } = this.state;
		return (
			<>
				<CrimesTable
					headers={headers}
					table={table}
					onRowClick={this.onRowClick}
				/>

				<CrimesMap props={mapObj} />
			</>
		);
	}
}

export default Crimes;
