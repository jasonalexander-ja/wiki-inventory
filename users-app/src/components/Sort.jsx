import {
    IconButton,

} from '@mui/material';

import SortIcon from '@mui/icons-material/Sort';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const getIcon = sort => {
    switch (sort) {
        case -1:
            return <ArrowDropDownIcon />
        case 1:
            return <ArrowDropUpIcon />
        default:
            return <SortIcon />
    }
}


const Sort = props => {
    const {
        setSort,
        sort
    } = props;

    const toggle = cal => {
        switch (sort) {
            case null:
                setSort(1)
            break;
            case 1:
                setSort(-1)
            break;
            default:
                setSort(null)
        }
    }

    return (
        <IconButton size='small' onClick={toggle}>
            {getIcon(sort)}
        </IconButton>
    );
};

export default Sort;
