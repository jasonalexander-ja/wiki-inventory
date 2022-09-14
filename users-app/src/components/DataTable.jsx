import {
    Grid,
    Table,
    Paper,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    TableContainer,
    Typography
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
        let mobileCells = [];
        for (const key in schema) {
            if ("excludeTable" in schema[key])
                continue;
            const value = "ToString" in schema[key] ? 
                schema[key].ToString(rowData[key]) : rowData[key];
            cells.push(
                <TableCell 
                    key={`${rowData[idField]}-${key}-mobile-cell`}
                    sx={{ 
                        display: { xs: 'none', sm: 'table-cell' }
                    }} 
                >
                    {value}
                </TableCell>
            );
            mobileCells.push(
                <Grid 
                    item
                    xs={6}
                    sx={{ 
                        display: { xs: 'table-cell', sm: 'none' }
                    }}
                    key={`${rowData[idField]}-${key}-mobile-cell-title`}

                >
                    <Typography variant='body1'>
                        <b>{schema[key].name}</b>
                    </Typography>
                </Grid>
            );
            mobileCells.push(
                <Grid 
                    item
                    xs={6}
                    sx={{ 
                        display: { xs: 'table-cell', sm: 'none' }
                    }}
                    key={`${rowData[idField]}-${key}-mobile-cell-data`}

                >
                    <Typography variant='body1'>
                        {value}
                    </Typography>
                </Grid>
            );
        }
        
        return [
            <TableRow
                key={`${JSON.stringify(rowData[idField])}-row`}
                sx={{ 
                    display: { xs: 'none', sm: 'table-row' }
                }}
            >
                {cells}
                <TableCell>
                    {actions.map(ac => ac(rowData))}
                </TableCell>
            </TableRow>,
            <TableRow
                key={`${JSON.stringify(rowData[idField])}-row-mobile`}
                sx={{ 
                    display: { xs: 'table-row', sm: 'none' }
                }}
            >
                <TableCell>
                    <Grid container>
                        {mobileCells}
                        <Grid 
                            xs={12} 
                            item
                            container
                        >
                            {actions.map(ac => ac(rowData))}
                        </Grid>
                    </Grid>
                </TableCell>
            </TableRow>
        ];
    };

    let headers = [];
    let rows = [];

    for (const key in schema) {
        const field = schema[key];
        if ("excludeTable" in field)
            continue;
        headers.push(
            <TableCell 
                key={`${key}-datatable-field`}
            >
                {field["name"]}
                {"excludeSort" in schema[key] ? <></> :
                    <Sort 
                        sort={sorting[key]} 
                        setSort={v => setSorter(key, v)} 
                    /> 
                }
            </TableCell>
        );
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
                <TableHead
                    sx={{
                        display: { xs: 'none', sm: 'table-header-group' }
                    }}
                >
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
