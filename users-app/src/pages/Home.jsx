import { useState, useEffect } from 'react';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
    Grid,
    Typography,
    IconButton,
    Button,
    AppBar,
    Toolbar,
    MenuItem
} from '@mui/material';

import '../styles/page.css';

import { GetAPIBaseURI } from '../utils';
import Pagination from '../components/Pagination'; 
import Filters, { makeFilterObject } from '../components/Filters';
import { user as userSchema } from '../schemas/user';
import DataTable from '../components/DataTable';


const Home = props => {
    const [filters, setFilters] = useState({
        location: "",
        locationOpt: 0,
        name: "",
        nameOpt: 0,
        title: "",
        titleOpt: 0,
    });
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [state, setState] = useState({
        users: [],
        userLoaded: false,
        loading: false,
        error: true,
        rows: 5,
        page: 0,
        count: 0,
        sorters: {
            location: null,
            name: null,
            title: null
        }
    });

    const sorting = state.sorters;

    const setSorter = (key, dir) => {
        setState(old => ({
            ...old,
            sorters: {
                ...old.sorters,
                [key]: dir
            },
            userLoaded: false
        }));
    };

    const handleChangeRowsPerPage = (rows) => {
        setState(old => ({
            ...old,
            userLoaded: false,
            page: 0,
            rows
        }));
    };

    const handleChangePage = (page) => {
        setState(old => ({
            ...old,
            userLoaded: false,
            page
        }));
    };

    useEffect(() => {
        const onLoad = async () => {
            setState(old => ({ ...old, userLoaded: true, loading: true }));
            const params = {
                search_params: makeFilterObject(filters),
                sort_params: sorting
            };
            const paramString = btoa(JSON.stringify(params));
            try {
                const uri = `users?page=${state.page}&rows=${state.rows}&query_params=${paramString}`;
                const res = await fetch(GetAPIBaseURI() + uri)
                    .then(res => res.json());

                setState(old => ({
                    ...old,
                    userLoaded: true,
                    loading: false,
                    users: res.results,
                    count: res.count
                }));
            } catch (e) {
                setState(old => ({
                    ...old,
                    userLoaded: true,
                    loading: false,
                    error: true
                }));
            }
        };

        if (!state.userLoaded && !state.loading)
            onLoad();
        
    }, [state, setState, filters, sorting]);

    const NoOfPages = Math.ceil(state.count / state.rows);

    let PageOpts = [];

    for (let i = 0; i <= NoOfPages - 1; i++) {
        PageOpts = [
            ...PageOpts, 
            <MenuItem 
                key={`page-option-${i}`}
                color='secondary' 
                value={i}
            >
                {i}
            </MenuItem>
        ];
    }

    return (
        <div style={{ height: "100%" }}>
            <Filters
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                filters={filters}
                setFilters={setFilters}
                search={() => setState(old => ({...old, userLoaded: false}))}
                schema={userSchema}
            />
            <AppBar 
                position="sticky"
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <Typography variant="h5">Users - {state.count}</Typography>
                        <Button 
                            variant="contained" 
                            size='small'
                            color='secondary'
                            onClick={() => setFiltersOpen(true)}
                            startIcon={<FilterAltIcon />}
                            sx={{
                                display: {sm: 'flex', xs: 'none'}
                            }}
                        >
                            Filters
                        </Button>
                        <IconButton 
                            aria-label="New users" 
                            color='secondary'
                            size='small'
                            onClick={() => setFiltersOpen(true)}
                            sx={{
                                display: {sm: 'none', xs: 'flex'}
                            }}
                        >
                            <FilterAltIcon />
                        </IconButton>
                </Toolbar>
            </AppBar>
            <Grid
                item
                xs={12}
                justifyContent="center"
                className='main-window'
                sx={{
                    padding: 1.5
                }}
        
            >
                <DataTable 
                    schema={userSchema}
                    data={state.users}
                    sorting={state.sorters}
                    setSorter={setSorter}
                    idField={'_id'}
                    actions={[data =>
                        <IconButton
                            aria-label="delete" 
                            size="small"
                            color='error'
                            key={`${data['_id']}-delete-action`}
                        >
                            <DeleteIcon />
                        </IconButton>
                    ]}
                />
            </Grid>
            <AppBar 
                position="sticky" 
                sx={{ top: 'auto', bottom: 0 }}
            >
                <Toolbar
                    style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <Pagination 
                        page={state.page}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        rows={state.rows}
                        rowOptions={[5, 10, 25]}
                        noOfPages={NoOfPages}
                    />
                    <Grid
                        item
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
                        <Button 
                            variant="contained" 
                            size='small'
                            color='secondary'
                            startIcon={<AddIcon />}
                            sx={{
                                display: {sm: 'flex', xs: 'none'}
                            }}
                        >
                            New
                        </Button>
                        <IconButton 
                            aria-label="New users" 
                            color='secondary'
                            size='small'
                            sx={{
                                display: {sm: 'none', xs: 'flex'}
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Home;

