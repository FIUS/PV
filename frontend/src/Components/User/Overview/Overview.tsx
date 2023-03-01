import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import style from './overview.module.scss'
import { doGetRequest, doRequest } from '../../Common/StaticFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { addShare as setShare, addToCart, openErrorToast, removeFromCart, setLectures } from '../../../Actions/CommonAction';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import { RootState } from '../../../Reducer/reducerCombiner';
import { Button, IconButton, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IDName, Lecture } from '../../../types/ResponseTypes';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {}

const Overview = (props: Props) => {
    const dispatch = useDispatch()
    useEffect(() => {
        doGetRequest("lectures").then((value) => {
            if (value.code === 200) {
                dispatch(setLectures(value.content))
            }
        })
    }, [dispatch])
    const [search, setsearch] = useState("")
    const navigate = useNavigate()
    const common: CommonReducerType = useSelector((state: RootState) => state.common);

    const cart = () => {
        if (common.cart.length > 0) {
            return <div className={style.cart}>
                <Typography variant='h5'>Einkaufswagen</Typography>
                <TableContainer component={Paper}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Modulname
                                </TableCell>
                                <TableCell >
                                    Entfernen
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {common.cart.map(lectureID => {
                                const output = common.lectures.find(lecture => lecture.id === lectureID)
                                return output ? output : {
                                    id: 0,
                                    name: "",
                                    folder: "",
                                    link: "",
                                    validUntil: "",
                                    aliases: [],
                                    persons: []
                                }
                            }).sort((a: Lecture, b: Lecture) => a.name.localeCompare(b.name)).map(lecture => {
                                return <TableRow key={lecture.id} hover role="checkbox" className={style.mouseClick}>
                                    <TableCell>
                                        {lecture.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton edge="end" aria-label="delete" onClick={() => { dispatch(removeFromCart(lecture.id)) }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button variant='contained' onClick={() => {
                    doRequest("PUT", "checkout", common.cart).then(value => {
                        if (value.code === 200) {
                            dispatch(setShare(value.content))
                            navigate("link")
                        } else {
                            dispatch(openErrorToast())
                        }
                    })
                }}>
                    Checkout
                </Button>
            </div>
        }
        return <></>
    }

    return (
        <div className={style.container}>
            <div className={style.innerContainer}>
                <TextField fullWidth label="Suche" value={search} onChange={value => { setsearch(value.target.value) }} />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Hinzufügen
                                </TableCell>
                                <TableCell >
                                    Modulname
                                </TableCell>
                                <TableCell >
                                    Dozent(en)
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {common.lectures.filter(lecture => {
                                if (lecture.name.toLocaleLowerCase().replace(" ", "").includes(search.toLocaleLowerCase().replace(" ", ""))) {
                                    return true;
                                }
                                if (lecture.persons.find(person => person.name.toLocaleLowerCase().replace(" ", "").includes(search.toLocaleLowerCase().replace(" ", ""))) !== undefined) {
                                    return true;
                                }
                                if (lecture.aliases.find(alias => alias.name.toLocaleLowerCase().replace(" ", "").includes(search.toLocaleLowerCase().replace(" ", ""))) !== undefined) {
                                    return true;
                                }
                                if (search === "") {
                                    return true
                                }
                                return false
                            }).map(lecture => {
                                return <TableRow key={lecture.id}
                                    hover
                                    role="checkbox"
                                    className={style.mouseClick + " " + (common.cart.includes(lecture.id) ? style.highlighted : "")}
                                    onDoubleClick={() => { dispatch(addToCart(lecture.id)) }}>
                                    <TableCell>
                                        <IconButton onClick={() => { dispatch(addToCart(lecture.id)) }}>
                                            <AddBoxIcon color='success' />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell  >
                                        {lecture.name}
                                    </TableCell>
                                    <TableCell >
                                        {lecture.persons.length > 0 ?
                                            <Select
                                                value={lecture.persons.sort((a: IDName, b: IDName) => b.id - a.id)[0].id}
                                                variant='standard'
                                                fullWidth
                                            >
                                                {lecture.persons.map(person => <MenuItem value={person.id}>{person.name}</MenuItem>)}
                                            </Select> : <></>}
                                    </TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {cart()}

        </div >
    )
}

export default Overview