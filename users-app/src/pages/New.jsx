import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { 
    Grid,
    Button,
    IconButton,
    Typography 
} from '@mui/material';

import Layout from '../components/Layout';
import Edit from '../components/Edit';

import { user as userSchema } from '../schemas/user';

import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';


const New = props => {
    const navigate = useNavigate();

    const [user, setUsers] = useState({
        name: '',
        title: '',
        location: ''
    });


    const header = 
    <>
        <Typography variant="h5">New User</Typography>
    </>;

    const content = 
    <>
        <Grid
            container
            justifyContent="center"
        >
            <Grid
                item
                xs={12}
                sm={10}
            >
                <Edit 
                    schema={userSchema} 
                    data={user}
                    setData={setUsers}
                />
            </Grid>
        </Grid>
    </>;

    const footer = 
    <>
        <div />
        <Grid
            item
            spacing={2}
            sx={{
                alignItems: 'center',
                display: 'flex',
                gap: 2
            }}
        >
            <Button 
                variant="contained" 
                size='small'
                color='primary'
                startIcon={<ClearIcon />}
                onClick={() => navigate('/')}
                sx={{
                    display: {sm: 'flex', xs: 'none'}
                }}
            >
                Cancel
            </Button>
            <IconButton 
                aria-label="New users" 
                color='secondary'
                size='small'
                onClick={() => navigate('/')}
                sx={{
                    display: {sm: 'none', xs: 'flex'}
                }}
            >
                <ClearIcon />
            </IconButton>
            <Button 
                variant="contained" 
                size='small'
                color='secondary'
                startIcon={<SaveIcon />}
                sx={{
                    display: {sm: 'flex', xs: 'none'}
                }}
            >
                Save
            </Button>
            <IconButton 
                aria-label="New users" 
                color='secondary'
                size='small'
                sx={{
                    display: {sm: 'none', xs: 'flex'}
                }}
            >
                <SaveIcon />
            </IconButton>
        </Grid>

    </>;

    return (
        <>
            <Layout
                header={header}
                content={content}
                footer={footer}
            />
        </>
    );
};


export default New;
