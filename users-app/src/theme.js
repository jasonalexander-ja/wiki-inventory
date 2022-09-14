import { 
    createTheme 
} from '@mui/material/styles';
import {
    green,
    cyan
} from '@mui/material/colors';

const useTheme = mode => {
    return createTheme({
        palette: {
            mode: mode,
            primary: green,
            secondary: cyan
        }
    });
};

export default useTheme;