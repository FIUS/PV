import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center" style={{ width: "80%" }}>
            <Box width="100%" mr={1}>
                <LinearProgress color="secondary" variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textPrimary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

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

export default function Header({ token, onLogOut, api_post, fetchAPI_GET, snackbar }) {
    const classes = useStyles();

    const [caching, setcaching] = useState(false)
    const [cacheRefreshing, setcacheRefreshing] = useState(-1)

    useEffect(() => {
        const fetch = async () => {
            const resp = await fetchAPI_GET("cache/state")
            if (resp.code === 200) {
                if (resp.content.isRefreshing) {
                    setcacheRefreshing(resp.content.progress)
                } else {
                    setcacheRefreshing(-1)
                }
            }
        }

        const t = setInterval(fetch, 10000);

        return () => clearInterval(t);
    },[]);

    const refresh_cache = async () => {
        setcaching(true)
        const resp = await api_post("refresh/cache", null)
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
                            display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", width:"100%"
                        }}>
                            {cacheRefreshing > -1 ? (
                                <div style={{ width: "80%" }}>
                                    Nextcloud-Link Cache generation
                                    <LinearProgressWithLabel value={cacheRefreshing} />
                                </div>) : ""
                            }
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