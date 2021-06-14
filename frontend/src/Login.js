import React from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react'

import "./login.css"

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

const Login = ({ onLogIn, snackbar }) => {
    const classes = useStyles();

    const [password, setPassword] = useState("")

    const onSubmit = (e) => {
        e.preventDefault();
        getToken(password)
    };

    const getToken = async (password) => {
        const resp = await fetch("http://fius-hawkeye:5000/create/token",
            {
                credentials: 'same-origin',
                method: "POST",
                headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "fius-hawkeye:5000/*" },
                body: JSON.stringify({"password":password})
            });
        const status_code = resp.status

        if (status_code === 200) {
            const token = await resp.json();

            onLogIn(token);
            snackbar("Login successfull!", "success")
        } else if (status_code === 403) {
            //Password wrong
            snackbar("Wrong credentials!", "error")
        } else {
            //Something else gone wrong
            snackbar("Server returned status code: " + status_code, "error")
        }
    }

    return (
        <div id="loginBox" className="middleCenter">
            <Paper id="loginBorder" className="middleCenter paper" elevation={3} >
                <Typography variant="h5" className={classes.title}>
                    Login
                </Typography>
                <form className="login" noValidate autoComplete="off" onSubmit={onSubmit}>
                    <TextField style={{ width: "100%" }} id="standard-basic" label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                </form>
            </Paper>
        </div>
    )
}

export default Login
