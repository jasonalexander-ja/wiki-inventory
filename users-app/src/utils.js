export const API_DEV_URI = 'http://127.0.0.1:8000/';

export const GetAPIBaseURI = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return API_DEV_URI;
    } else {
        return '/';
    }
};

export const FilterTypes = {
    None: 0,
    Match: 1,
    Contains: 2,
    Begins: 3,
    Ends: 4,
    Regex: 5
};
