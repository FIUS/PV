import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Header({ token, onLogOut, api_post, snackbar }) {
    const classes = useStyles();

    const [caching, setcaching] = useState(false)

    const refresh_cache = async () => {
        setcaching(true)
        const resp = await api_post("http://fius-hawkeye:5000/refresh/cache", null)
        setcaching(false)
        if (resp.code === 200) {
            snackbar("Cache refreshed", "success")
        } else {
            snackbar("Something went wrong( " + resp.code + " )", "error")
        }
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        TTV22
                    </Typography>
                    {token !== "" ? (
                        <div style={{
                            display: "flex", flexDirection: "row", alignItems: "center"
                        }}>
                            {!caching ?
                                <Button color="inherit" onClick={(e) => refresh_cache()} style={{ marginRight: "10px" }}><CachedIcon /></Button>
                                : <CircularProgress color="secondary" style={{ width: "20px", height: "20px", marginRight: "20px" }} />
                            }
                            <Button color="inherit" onClick={onLogOut}>Logout</Button>
                        </div>
                    ) : ""}
                </Toolbar>
            </AppBar>
        </div>
    );
}