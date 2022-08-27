import { useState, useEffect } from 'react';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
    Grid,
    Typography,
    IconButton,
    Button,
    MenuItem
} from '@mui/material';

import '../styles/page.css';

import { GetAPIBaseURI } from '../utils';
import { user as userSchema } from '../schemas/user';

import Filters, { makeFilterObject } from '../components/Filters';
import Pagination from '../components/Pagination'; 
import DataTable from '../components/DataTable';
import Layout from '../components/Layout';


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
                sort_params: state.sorters
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
        
    }, [state, setState, filters]);

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

    const header = 
    <>
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
    </>

    const content = 
    <>
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
    </>;

    const footer = 
    <>
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
    </>;

    return (
        <>
            <Filters
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                filters={filters}
                setFilters={setFilters}
                search={() => setState(old => ({...old, userLoaded: false}))}
                schema={userSchema}
            />
            <Layout
                header={header}
                content={content}
                footer={footer}
            />
        </>
    );
}

export default Home;
