import { 
    createTheme 
} from '@mui/material/styles';
import {
    green,
    cyan
} from '@mui/material/colors';

const useTheme = () => {
    return createTheme({
        palette: {
            mode: 'dark',
            primary: green,
            secondary: cyan
        }
    });
};

export default useTheme;