import React, { useCallback, useEffect, useRef } from 'react'
import QRCode from "react-qr-code";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import PrintIcon from '@mui/icons-material/Print';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Reducer/reducerCombiner';

import style from './checkout.module.scss'
import { Link } from '@mui/material';
import { clearCart, openToast } from '../../../Actions/CommonAction';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const tableRef = useRef<HTMLTableElement>(null)

    const back = () => {
        dispatch(clearCart())
        navigate("/")
    }
    const common: CommonReducerType = useSelector((state: RootState) => state.common);

    const print = async (printParams: { link: string }) => {
        fetch("http://localhost:6001/printPV",
            {
                credentials: 'include',
                method: "POST",
                headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "localhost/*" },
                body: JSON.stringify(printParams)
            });
    }

    const copyTable = useCallback((retries: number) => {
        if (retries > 5) {
            dispatch(openToast({ message: "Could not copy table!", type: "error" }))
            return
        }
        try {
            var urlField = document.querySelector('table');

            // create a Range object
            var range = document.createRange();
            // set the Node to select the "range"
            if (urlField !== null) {
                range.selectNode(urlField);
                // add the Range to the set of window selections
                const selection = window.getSelection()
                if (selection !== null) {
                    selection.addRange(range);

                    // execute 'copy', can't 'cut' in this case
                    document.execCommand('copy');
                    selection.empty()
                    dispatch(openToast({ message: "Table copied!" }))
                } else {
                    dispatch(openToast({ message: "Could not copy table!", type: "error" }))
                }
            } else {
                dispatch(openToast({ message: "Could not copy table!", type: "error" }))
            }
        } catch (e) {
            setTimeout(copyTable, 500, retries + 1)
            console.log(e)
        }

    }, [dispatch]);

    useEffect(() => {
        if (common.share !== null && tableRef !== null) {
            copyTable(0)
        }
    }, [common.share, tableRef, copyTable])

    return (
        <div>
            {common.share !== null ? (
                <div className={style.flexMiddle} style={{ marginTop: "30px" }}>
                    <Paper elevation={2} style={{ marginBottom: "20px" }}>
                        <Button style={{ width: "100px", height: "100px", backgroundColor: "#eeeeee" }} onClick={() => {
                            print({ "link": window.location + "/" + (common.share !== null ? common.share?.secret : "") })
                        }}>
                            <PrintIcon style={{ width: "50px", height: "50px" }}></PrintIcon>
                        </Button>
                    </Paper>
                    <QRCode value={common.share.secret} />
                    <Typography variant="h6" style={{ marginTop: "20px" }}>
                        <Link href={window.location + "/" + common.share.secret}>
                            {window.location + "/" + common.share.secret}
                        </Link>
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <TableContainer style={{ marginTop: "20px", width: "70%" }} component={Paper}>
                            <Table aria-label="simple table" id="table" ref={tableRef}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fachname</TableCell>
                                        <TableCell>Nextcloud Link</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {common.share.links.map((link) => (
                                        <TableRow key={link.link} className="examitem">
                                            <TableCell component="th" scope="row">{link.name}</TableCell>
                                            <TableCell>
                                                <Link href={link.link}>
                                                    {link.link}
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>

                    </div>
                    <Button onClick={() => back()} style={{ marginTop: "20px", backgroundColor: "#3f51b5", color: "white" }}>Zurück</Button>
                </div >) : (
                <div className="flexMiddle">
                    <Typography variant="h6" style={{ marginTop: "20px" }}>
                        Generating QR-Code
                    </Typography>
                    <CircularProgress style={{ marginTop: "20px" }} />
                </div>
            )}
        </div >
    )
}

export default Checkout
