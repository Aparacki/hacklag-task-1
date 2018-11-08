import React, { Component } from "react";
import Dropzone from "react-dropzone";
import CrimesTable from "./CrimesTable";
import CrimesMap from "./CrimesMap";
import { IState, mapObj } from "./CrimesTypes";

import { verifyFile } from "./utils/Utils";
import { csv as csvUploadOptions } from "./utils/UploadOptions";

class Crimes extends Component<{}, IState> {
	constructor(props: {}) {
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
	public handleOnDrop = (files: any[], rejectedFiles: any[]): void => {
		if (rejectedFiles && rejectedFiles.length > 0) {
			verifyFile(rejectedFiles, csvUploadOptions);
		}

		if (files && files.length > 0) {
			const isVerified = verifyFile(files, csvUploadOptions);
			if (isVerified) {
				const currentFile: Blob = files[0];
				const myFileItemReader = new FileReader();
				// throw new Error('Required')
				myFileItemReader.onload = this.loadHandler;
				myFileItemReader.readAsText(currentFile);
			}
		}
	};

	public loadHandler = (e: any) => {
		let csv = e.target.result;
		this.processData(csv);
	};

	public loadErrorHandler = (e: any) => {
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
				<Dropzone
					onDrop={this.handleOnDrop}
					accept={csvUploadOptions.acceptedFileTypes}
					multiple={false}
					maxSize={csvUploadOptions.maxSize}
					style={{
						width: "400px",
						height: "400px",
						borderWidth: "2px",
						borderColor: 'rgb(102, 102, 102")',
						borderStyle: "dashed",
						borderRadius: "5px",
						background: "#cbebeb"
					}}
				>
					Drop CSV
				</Dropzone>
				{table.length > 0 ? (
					<CrimesTable
						headers={headers}
						table={table}
						onRowClick={this.onRowClick}
					/>
				) : (
					<span>no loaded</span>
				)}
				<CrimesMap mapObj={mapObj} />
			</>
		);
	}
}

export default Crimes;
