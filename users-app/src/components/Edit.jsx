import {
    Grid,
    Card,
    TextField,
    CardContent
} from '@mui/material';


const Edit = props => {
    const {
        schema,
        setData,
        data,
    } = props;

    const fieldProps = {
        container: true, 
        item: true, 
        xs: 12,
        sm: 6,
        lg: 4
    };

    const inputProps = {
        sx: { width: '100%' }
    };

    const setField = (key, e) => 
        setData(old => ({
            ...old,
            [key]: e.target.value
        }));


    let fields = [];
    console.log(schema);

    for (const key in schema) {
        if ("excludeCreateEdit" in schema[key])
            continue;
        fields.push(
            <Grid {...fieldProps} key={`${key}-filter-input`}>
                <TextField
                    label={`${schema[key].name}`}
                    onChange={e => setField(key, e)}
                    value={data[key]}
                    {...inputProps}
                />
            </Grid>
        );
    }


    return (
        <Card container spacing={2}>
            <CardContent>
                <Grid container spacing={2}>
                    {fields}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Edit;
