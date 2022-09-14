import React from 'react';
import ReactDOM from 'react-dom';

import { 
    ThemeProvider 
} from '@mui/material/styles';
import {
    CssBaseline
} from '@mui/material';

import App from './App';

import useTheme from './theme';



const Main = () => {
    const theme = useTheme('dark');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
}

ReactDOM.render(
    <Main />,
    document.getElementById('root')
);

