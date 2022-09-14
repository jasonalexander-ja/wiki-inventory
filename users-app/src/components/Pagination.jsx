import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import {
    Grid,
    IconButton,
    MenuItem,
    TextField
} from '@mui/material';


const Pagination = props => {
    const {
        page,
        handleChangePage,
        handleChangeRowsPerPage,
        rows,
        rowOptions,
        noOfPages
    } = props;
    let opt = [];

    for (let i = 0; i <= noOfPages - 1; i++) {
        opt = [
            ...opt, 
            <MenuItem 
                key={`page-option-${i}`}
                color='primary' 
                value={i}
            >
                {i}
            </MenuItem>
        ];
    }

    return (
        <Grid
            item
            container
            sx={{
                alignItems: 'center',
                flexWrap: "nowrap"
            }}
        >
            <TextField
                margin="dense"
                select
                value={!!opt ? page : ''}
                onChange={e => handleChangePage(e.target.value)}
                label="Page"
                sx={{
                    width: '90px'
                }}
                size="small"
                variant='standard'
                color='primary'
                disabled={opt.length <= 1}
            >
                {opt}
            </TextField>
            <TextField
                margin="dense"
                select
                value={!!rowOptions ? rows : ''}
                onChange={e => handleChangeRowsPerPage(e.target.value)}
                label="Rows"
                size="small"
                variant='standard'
                color='primary'
            >
                {rowOptions.map(i => 
                    <MenuItem 
                        key={`row-opt-${i}`}
                        value={i}
                        color='primary'
                    >
                        {i}
                    </MenuItem>
                )}
            </TextField>
            <IconButton 
                aria-label="Open options" 
                color='primary'
                //size='small'
                disabled={page === 0}
                onClick={(props) => handleChangePage(page - 1)}
            >
                <ChevronLeftIcon />
            </IconButton>
            <IconButton 
                aria-label="Open options" 
                color='primary'
                //size='small'
                disabled={page === noOfPages - 1}
                onClick={(props) => handleChangePage(page + 1)}
            >
                <ChevronRightIcon />
            </IconButton>
        </Grid>
    )
}

export default Pagination;
