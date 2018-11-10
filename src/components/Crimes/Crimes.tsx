import React, { Component } from "react";
import Dropzone from "react-dropzone";
import CrimesTable from "./CrimesTable";
import CrimesMap from "./CrimesMap";
import { CrimeState as State, CrimeProps as Props } from "./typesCrimes";

// css
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import DeleteIcon from "@material-ui/icons/Delete";

class Crimes extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			table: [],
			headers: [],
			headersLength:0,
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
		// console.log("_csv did update");
	};

	public processData = (csv: any) => {
		let allTextLines = csv.split(/\r|\n|\r/);
		let headers = allTextLines[0].split(",");
		let headersLength = headers.join('').length
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
			headers,
			headersLength
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
			headersLength:0,
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

	public mapReset = (): void => {
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

	public render(): JSX.Element {
		const { table, headers, mapObj, headersLength } = this.state;
		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<CrimesTable
						headers={headers}
						headersLength={headersLength}
						tableWidth={1000}
						table={table}
						onRowClick={this.onRowClick}
					/>
				</Grid>
				<Grid item xs={12}>
					<CrimesMap props={mapObj} />
				</Grid>
				<Grid item xs={12}>
                        <Button
                           variant="contained"
                           color="secondary"
                           fullWidth={true}
                           onClick={this.mapReset}
                        >
                           Clear map
                           <DeleteIcon />
                        </Button>
				</Grid>
			</Grid>
		);
	}
}

export default Crimes;
