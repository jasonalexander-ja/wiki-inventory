import React from 'react';

import {
    HashRouter,
    Routes,
    Route,
} from 'react-router-dom'; 

import { styled } from '@mui/material/styles';

import {
    Grid,
    Card,
    CardContent
} from '@mui/material';

import Home from './pages/Home';
import New from './pages/New';


const Container = styled(Grid)(({ theme }) => ({
    height: '100%',
    zIndex: 1000,
    padding: theme.spacing(2.5),
}));


const MainCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.primary.main,
    background: 'rgba(128,128,128,1)'
}));


const PageContent = styled(CardContent)(({ theme }) => ({
    flexGrow: 1,
    padding: '0px!important',
    height: "100%"
}));


const Router = props => {

    return (
        <HashRouter>
            <Routes>
                <Route 
                    exact 
                    path="/" 
                    element={<Home />}
                />
                <Route 
                    exact 
                    path="/new" 
                    element={<New />}
                />
            </Routes>
        </HashRouter>
    );
}


const App = props => {

    return (
        <Container container>
            <Grid
                item
                xs={null}
                md={1}
                xl={2}
            />
            <Grid
                item
                justifyContent="center"
                xs={12}
                md={10}
                xl={8}
                sx={{
                    height: "100%"
                }}
            >
                <MainCard
                    sx={{
                        height: "100%"
                    }}
                >
                    <PageContent>
                        <Router />
                    </PageContent>
                </MainCard>
            </Grid>
            <Grid
                item
                xs={null}
                md={1}
                xl={2}
            />
        </Container>
    );
}

export default App;
