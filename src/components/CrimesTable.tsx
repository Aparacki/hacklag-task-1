import React, { SFC, ReactNode  } from "react";
import { Column, Table } from "react-virtualized";
import "react-virtualized/styles.css";

interface Props { 
headers:string[];
table:any[];
onRowClick:any;
}

const CrimesTable: SFC<Props> = ({ headers, table, onRowClick}) => (
	<Table
		width={800}
		height={300}
		headerHeight={20}
		rowHeight={30}
		rowCount={table.length}
		rowGetter={({ index }) => table[index]}
		onRowClick={onRowClick}
	>
		{headers.map((el, i) => {
			return <Column width={200} label={el} dataKey={el} />;
		})}
	</Table>
)

export default CrimesTable;
