import React from 'react'
import QRCode from "react-qr-code";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { useState, useEffect } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import PrintIcon from '@material-ui/icons/Print';
import './common.css'

const Checkout = ({ setInCheckout, qrUrl, setqrUrl, setCart, secret, fetchAPI_GET, snackbar }) => {
    const back = () => {
        setqrUrl("");
        setCart([]);
        setInCheckout(false);
    }
    const [links, setlinks] = useState([])

    const print = async (printParams) => {
        fetch("http://localhost:6001/printPV",
            {
                credentials: 'include',
                method: "POST",
                headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "localhost/*" },
                body: JSON.stringify(printParams)
            });
    }

    useEffect(() => {
        const fetch = async () => {
            if (secret !== "") {
                const resp = await fetchAPI_GET("links?code=" + secret)
                if (resp.code === 200) {
                    setlinks(resp.content)
                    console.log(resp.content)
                    setTimeout(copyTable, 500)
                }
            }
        }
        fetch()
    }, [secret]);


    const copyTable = (retries = 0) => {
        if (retries > 5) {
            snackbar("Could not copy table!", "warning")
            return
        }
        try {
            var urlField = document.querySelector('table');

            // create a Range object
            var range = document.createRange();
            // set the Node to select the "range"

            range.selectNode(urlField);
            // add the Range to the set of window selections
            window.getSelection().addRange(range);

            // execute 'copy', can't 'cut' in this case
            document.execCommand('copy');
            window.getSelection().empty()
            snackbar("Table copied!", "success")
        } catch (e) {
            setTimeout(copyTable, 500, retries + 1)
            console.log(e)
        }



    }

    return (
        <div>
            {qrUrl !== "" ? (
                <div className="flexMiddle" style={{ marginTop: "30px" }}>
                    <Paper elevation="2" style={{ marginBottom: "20px" }}>
                        <Button style={{ width: "100px", height: "100px", backgroundColor: "#eeeeee" }} onClick={()=>print({ "link": "https://info.pv.fius.de/" + secret })} >
                            <PrintIcon style={{ width: "50px", height: "50px" }}></PrintIcon>
                        </Button>
                    </Paper>
                    <QRCode value={qrUrl} />
                    <Typography variant="h6" style={{ marginTop: "20px" }}>
                        <a href={qrUrl}>{qrUrl}</a>
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <TableContainer style={{ marginTop: "20px", width: "70%" }} component={Paper}>
                            <Table aria-label="simple table" id="table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fachname</TableCell>
                                        <TableCell>Nextcloud Link</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {links.map((item) => (
                                        <TableRow key={item[1]} className="examitem">
                                            <TableCell component="th" scope="row">{item[0]}</TableCell>
                                            <TableCell><a href={item[1]}>{item[1]}</a></TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>

                    </div>
                    <Button onClick={() => back()} style={{ marginTop: "20px", backgroundColor: "#3f51b5", color: "white" }}>Zurück</Button>
                </div>) : (
                <div className="flexMiddle">
                    <Typography variant="h6" style={{ marginTop: "20px" }}>
                        Generating QR-Code
                    </Typography>
                    <CircularProgress style={{ marginTop: "20px" }} />
                </div>
            )}
        </div>
    )
}

export default Checkout
