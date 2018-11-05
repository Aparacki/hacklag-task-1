import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { List } from "react-virtualized";
import { Column, Table } from "react-virtualized";
import "react-virtualized/styles.css";

interface IState {
	table: any[];
	headers: string[];
	loaded: boolean;
}

class Crimes extends Component<{}, IState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			table: [],
			headers: [],
			loaded: false
		};
	}
	public handleOnDrop = (files: any[], rejectedFiles: any[]): void => {
		const currentFile: Blob = files[0];
		const myFileItemReader = new FileReader();

		myFileItemReader.onload = this.loadHandler;
		myFileItemReader.onerror = this.loadErrorHandler;

		myFileItemReader.readAsText(currentFile);
	};
	public loadHandler = (e: any) => {
		let csv = e.target.result;
		// console.log(csv);
		this.processData(csv);
	};

	public loadErrorHandler = (e: any) => {};

	public processData = (csv: any) => {
		let allTextLines = csv.split(/\r|\n|\r/);
		let headers = allTextLines[0].split(",");
		this.setState({
			headers
		});
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
		console.log("loaded");
		this.setState({
			table: csvArray
		});
	};
	public onRowClick = ({ event, index, rowData }:{ event: React.MouseEvent<any>, index: number, rowData: any }): any => {
		// console.log(event)
		// console.log(index)
		console.log(rowData.latitude)
		console.log(rowData.longitude)
	}

	public render(): JSX.Element {
		const listHeight = 300;
		const rowHeight = 20;
		const rowWidth = 300;
		const { table, headers } = this.state;
		return (
			<>
				<Dropzone
					onDrop={this.handleOnDrop}
					// accept={image.acceptedFileTypes}
					multiple={false}
					// maxSize={image.maxSize}
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
					<>
						<Table
							width={800}
							height={300}
							headerHeight={20}
							rowHeight={30}
							rowCount={table.length}
							rowGetter={({ index }) => table[index]}
							onRowClick={this.onRowClick}
						>
							{headers.map((el,i) => {
								return (
									<Column
										width={200}
										label={el}
										dataKey={el}
									/>
								);
							})}
						</Table>
						,<span>loaded</span>
					</>
				) : (
					<span>no loaded</span>
				)}
			</>
		);
	}
}

export default Crimes;
