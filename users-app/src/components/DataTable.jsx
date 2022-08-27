import {
    Table,
    Paper,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    TableContainer
} from '@mui/material';

import Sort from './Sort';


const DataTable = props => {
    const {
        schema,
        data,
        sorting,
        setSorter,
        idField,
        actions
    } = props;

    const makeRow = (rowData) => {
        let cells = [];
        for (const key in schema) {
            if ("exclude" in schema[key])
                continue;
            cells.push(
                <TableCell 
                    key={`${rowData[idField]}-${key}`}
                >
                    {rowData[key]}
                </TableCell>
            );
        }
        return (
            <TableRow
                key={`${JSON.stringify(rowData[idField])}-row`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {cells}
                <TableCell>
                    {actions.map(ac => ac(rowData))}
                </TableCell>
            </TableRow>
        );
    };

    let headers = [];
    let rows = [];

    for (const key in schema) {
        const field = schema[key];
        if ("exclude" in field)
            continue;
        headers.push(
            <TableCell 
                sx={{ whiteSpace: 'nowrap' }} 
                key={`${key}-datatable-field`}
            >
                {field["name"]}
                <Sort 
                    sort={sorting[key]} 
                    setSort={v => setSorter(key, v)} 
                />
            </TableCell>
        )
    }

    for (const rowData in data) {
        rows.push(makeRow(data[rowData]))
    }

    const actionsHeader = actions.length !== 0 ? 
        <TableCell /> : <></>;
    
    const noData = rows.length === 0 ?
        <TableRow>
            <TableCell>No data</TableCell>
        </TableRow> : <></>

    return (
        <TableContainer 
            component={Paper}
            sx={{
                width: 'auto',
                maxHeight: '100%'
            }}
        >
            <Table 
                size="small" 
                aria-label="Users table"
                stickyHeader
            >
                <TableHead>
                    <TableRow>
                        {headers}
                        {actionsHeader}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                    {noData}
                </TableBody>
            </Table>
        </TableContainer>
    );
};


export default DataTable;
