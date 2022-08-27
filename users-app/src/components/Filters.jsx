import {
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField
} from '@mui/material';

import { FilterTypes } from '../utils';

const Filters = props => {
    const {
        filtersOpen,
        setFiltersOpen,
        setFilters,
        filters = {
            locations: "",
            locationsOpt: 0,
            name: "",
            nameOpt: 0,
            title: "",
            titleOpt: 0
        },
        search,
        schema
    } = props;

    const FilterOptions = Object.entries(FilterTypes).map(([key, value]) =>
        <MenuItem value={value} key={`${Math.random()}`}>
            {key}
        </MenuItem>
    );

    const colProps = {
        container: true, 
        item: true, 
        //lg: 3,
        md: 6,
        xs: 12
    };

    const selectProps = {
        sx: {
            width: '90px'
        },
        variant: 'standard',
        color: 'secondary',
        margin: "dense"
    };

    const textProps = {
        sx: {
            width: '60%',
            flexGrow: 1
        },
        variant: 'standard',
        color: 'primary',
        margin: "dense"
    };

    const setFilterOpts = (key, e) => 
        setFilters(old => ({
            ...old,
            [key]: e.target.value
        }));

    let filtersInputs = [];

    for (const key in schema) {
        if ("exclude" in schema[key])
            continue;
        filtersInputs.push(
            <Grid {...colProps} key={`${key}-filter-input`}>
                <TextField
                    label={`Search ${schema[key].name}`}
                    onChange={e => setFilterOpts(key, e)}
                    value={filters[key]}
                    {...textProps}
                />
                <TextField
                    select
                    value={filters[`${key}Opt`]}
                    onChange={e => setFilterOpts(`${key}Opt`, e)}
                    label="Match Options"
                    {...selectProps}
                >
                    {FilterOptions}
                </TextField>
            </Grid>
        )
    }

    return (
        <Dialog
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
        >
            <DialogTitle sx={{ paddingBottom: 0 }}>Filters</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {filtersInputs}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    variant="contained" 
                    size='small'
                    color='primary'
                    onClick={() => setFiltersOpen(false)}
                >
                    Close
                </Button>
                <Button 
                    variant="contained" 
                    size='small'
                    color='secondary'
                    onClick={() => {
                        search();
                        setFiltersOpen(false);
                    }}
                >
                    Set Filters
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const makeFilter = (type, string) => {
    if (!string)
        return null;
    switch(type) {
        case FilterTypes.Contains:
            return `.*${string}.*`;
        case FilterTypes.Begins:
            return `^${string}.*`;
        case FilterTypes.Ends:
            return `.*${string}$`;
        case FilterTypes.Match:
            return `^${string}$`;
        case FilterTypes.Regex:
            return string;
        default:
            return null;
    }
}

export const makeFilterObject = props => {
    const {
        location = "",
        locationOpt = 0,
        name = "",
        nameOpt = 0,
        title = "",
        titleOpt = 0
    } = props;

    return {
        location: makeFilter(locationOpt, location),
        name: makeFilter(nameOpt, name),
        title: makeFilter(titleOpt, title)
    };
}

export default Filters;
