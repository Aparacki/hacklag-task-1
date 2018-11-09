import React, { SFC, ReactNode  } from "react";
import { Column, Table } from "react-virtualized";
import "react-virtualized/styles.css";
import "../../App.css"

interface Props { 
headers:string[];
table:any[];
headersLength:number;
tableWidth:number;
onRowClick:any;
}

const CrimesTable: SFC<Props> = ({ headers, headersLength, tableWidth, table, onRowClick}) => (
	<Table
		width={tableWidth}
		height={300}
		headerHeight={20}
		rowHeight={30}
		rowCount={table.length}
		rowGetter={({ index }) => table[index]}
		onRowClick={onRowClick}
	>
		{headers.map((el, i) => {
			const width = el.length/headersLength*tableWidth
			// console.log(width)
			return <Column key={i} width={width} label={el} dataKey={el} />;
		})}
	</Table>
)

export default CrimesTable;
