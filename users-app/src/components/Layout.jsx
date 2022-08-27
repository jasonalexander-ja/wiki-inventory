import {
    AppBar,
    Toolbar,
    Grid
} from '@mui/material';


const Layout = props => {
    const {
        header = <></>,
        content = <></>,
        footer = <></>
    } = props;

    return (
        <div style={{ height: "100%" }}>
            <AppBar position="sticky">
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    {header}
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
                {content}
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
                    {footer}
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Layout;
