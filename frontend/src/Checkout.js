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
import './common.css'

const Checkout = ({ setInCheckout, qrUrl, setqrUrl, setCart, secret, fetchAPI_GET }) => {
    const back = () => {
        setqrUrl("");
        setCart([]);
        setInCheckout(false);
    }
    const [links, setlinks] = useState([])

    useEffect(() => {
        const fetch = async () => {
            if (secret !== "") {
                const resp = await fetchAPI_GET("links?code=" + secret)
                if (resp.code === 200) {
                    setlinks(resp.content)
                }
            }
        }
        fetch()
    }, [secret]);

    return (
        <div>
            {qrUrl !== "" ? (
                <div className="flexMiddle" style={{ marginTop: "30px" }}>
                    <QRCode value={qrUrl} />
                    <Typography variant="h6" style={{ marginTop: "20px" }}>
                        <a href={qrUrl}>{qrUrl}</a>
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <TableContainer style={{ marginTop: "20px", width: "70%" }} component={Paper}>
                            <Table aria-label="simple table">
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
