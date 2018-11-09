import React, { Component } from "react";
import Dropzone from "react-dropzone";
import CrimesTable from "./CrimesTable";
import CrimesMap from "./CrimesMap";
import { IState, mapObj } from "./CrimesTypes";

import { csv as csvUploadOptions } from "./utils/UploadOptions";

interface Props {
	csvSrc: any;
	csvType: any;
}
class Crimes extends Component<Props, IState> {
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
      // console.log("_csv did update")
      const {csvSrc} = this.props
      console.log(csvSrc)
      this.processData(csvSrc);
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

	public render(): JSX.Element {
		const { table, headers, mapObj } = this.state;
		return (
			<>
				<CrimesTable
					headers={headers}
					table={table}
					onRowClick={this.onRowClick}
				/>

				<CrimesMap mapObj={mapObj} />
			</>
		);
	}
}

export default Crimes;
