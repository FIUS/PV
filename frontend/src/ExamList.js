import React from 'react'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExamItem from './ExamItem';
import { useState, useEffect } from 'react'
import './common.css'

const ExamList = ({ api_fetch, snackbar, cart, setcart }) => {

    const [lectures, setlectures] = useState([])
    const [lecturesDisplayed, setlecturesDisplayed] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        const load = async () => {
            setloading(true)
            const lec = await api_fetch("lectures")
            setloading(false)
            if (lec.code === 200) {

                setlectures(lec.content)
                setlecturesDisplayed(lec.content)
            } else {
                snackbar("Something went wrong while loading the lectures", "error")
            }
        }

        load()

    }, [])

    const filterlecture = (text) => {
        setlecturesDisplayed(lectures.filter((item) => {
            const name = String(item.name).toLocaleLowerCase()
            const short = String(item.short).toLocaleLowerCase()
            const prof = String(item.prof).toLocaleLowerCase()
            const note = String(item.note).toLocaleLowerCase()
            const input = String(text).toLocaleLowerCase()
            return name.includes(input) || short.includes(input) || prof.includes(input) || note.includes(input) || input === ""
        }))
    };

    return (
        <div className="flexMiddle" style={{ marginTop: "30px" ,width:"70%"}}>
            {!loading ? (
                <div className="flexMiddle" style={{ width: "100%" }}>
                    <TextField style={{ width: "50%", }} id="lecture-search" label="Fach infos" type="text" onChange={(e) => filterlecture(e.target.value)} />

                    <TableContainer style={{ marginTop: "20px", width: "90%" }} component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Fach</TableCell>
                                    <TableCell align="right">Kürzel</TableCell>
                                    <TableCell align="right">Prof</TableCell>
                                    <TableCell align="right">Notizen</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lecturesDisplayed.map((lec) => <ExamItem key={lec.id} id={lec.id} lecture={lec.name} short={lec.short} prof={lec.prof} note={lec.note} cart={cart} setcart={setcart} />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>) : (
                <div className="flexMiddle">
                    <Typography variant="h6" style={{ marginBottom: "20px" }}>
                        Lade Prüfungen, bitte warten...
                    </Typography>
                    <CircularProgress />
                </div>
            )}
        </div>
    )
}

export default ExamList
