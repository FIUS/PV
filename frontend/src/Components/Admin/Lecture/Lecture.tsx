import { Autocomplete, Button, Chip, Divider, IconButton, List, ListItem, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import style from './lecture.module.scss'
import Spacer from '../../Common/Spacer';
import { AddCircle } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Reducer/reducerCombiner';
import { doGetRequest, doRequest } from '../../Common/StaticFunctions';
import { openErrorToast, openToast, setLectures } from '../../../Actions/CommonAction';

type Props = {}

const Lecture = (props: Props) => {

    const params = useParams()
    const common: CommonReducerType = useSelector((state: RootState) => state.common);
    const id = parseInt(params.lectureid ? params.lectureid : "0")
    const lecture = common.lectures.find((value) => value.id === id)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [person, setperson] = useState("")
    const [alias, setalias] = useState("")

    const personOptions = common.lectures.map(lecture => lecture.persons).reduce((a, b) => a.concat(b), []).map(tuple => tuple.name);
    const aliasOptions = common.lectures.map(lecture => lecture.aliases).reduce((a, b) => a.concat(b), []).map(tuple => tuple.name);


    const add = (toAdd: string, apiEndpoint: string) => {
        if (toAdd !== "") {
            doRequest("PUT", apiEndpoint, { lectureID: lecture?.id, name: toAdd }).then(value => {
                if (value.code === 200) {
                    dispatch(openToast({ message: apiEndpoint + " hinzugefügt" }))
                    doGetRequest("lectures").then((value) => {
                        if (value.code === 200) {
                            dispatch(setLectures(value.content))
                        }
                    })
                } else {
                    dispatch(openErrorToast())
                }
            })
        } else {
            dispatch(openToast({ message: "Bitte Name eintragen", type: "error" }))
        }
    }

    const del = (toDelete: number, apiEndpoint: string) => {
        doRequest("DELETE", apiEndpoint, { id: toDelete }).then(value => {
            if (value.code === 200) {
                dispatch(openToast({ message: apiEndpoint + " gelöscht" }))
                doGetRequest("lectures").then((value) => {
                    if (value.code === 200) {
                        dispatch(setLectures(value.content))
                    }
                })
            } else {
                dispatch(openErrorToast())
            }
        })
    }

    return (
        <div className={style.container}>
            <div className={style.headline}>
                <Typography variant='h5'>{lecture?.name}</Typography>
                <Chip icon={<CheckCircleIcon color="success" />} label="OK" variant="outlined" />
            </div>
            <Spacer vertical={30} />
            <div className={style.textContainer}>
                <TextField label="Ordner" variant="outlined" value={lecture?.folder} />
                <TextField label="Link" variant="outlined" value={lecture?.link} />
                <TextField label="Gültig Bis" variant="outlined" value={lecture?.validUntil} />
            </div>
            <Spacer vertical={30} />
            <div className={style.lowerContainer}>
                <div>
                    <Typography variant='h5'>Beteiligte Personen</Typography>
                    <Spacer vertical={5} />
                    <Paper className={style.list}>
                        <List>
                            <ListItem secondaryAction={
                                <IconButton edge="end" onClick={() => { add(person, "person"); setperson("") }}>
                                    <AddCircle color='info' />
                                </IconButton>
                            }>
                                <Autocomplete
                                    value={person}
                                    onChange={(event: any, newValue: string | null) => {
                                        if (newValue) {
                                            setperson(newValue);
                                        }
                                    }}
                                    className={style.autocomplete}
                                    freeSolo
                                    options={personOptions}
                                    renderInput={(params) => <TextField {...params} label="Neue Person" size='small'
                                        onChange={(value) => {
                                            setperson(value.target.value);
                                        }} />}
                                />

                            </ListItem>
                            {lecture?.persons.map(person => <>
                                <Divider />
                                <ListItem secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => del(person.id, "person")}>
                                        <DeleteIcon />
                                    </IconButton>
                                }>
                                    {person.name}
                                </ListItem>
                            </>)}
                        </List>
                    </Paper>
                </div>
                <div>
                    <Typography variant='h5'>Aliase</Typography>
                    <Spacer vertical={5} />
                    <Paper className={style.list}>
                        <List>
                            <ListItem secondaryAction={
                                <IconButton edge="end" onClick={() => { add(alias, "alias"); setalias("") }}>
                                    <AddCircle color='info' />
                                </IconButton>
                            }>
                                <Autocomplete
                                    value={alias}
                                    onChange={(event: any, newValue: string | null) => {
                                        if (newValue) {
                                            setalias(newValue);
                                        }
                                    }}
                                    className={style.autocomplete}
                                    freeSolo
                                    options={aliasOptions}
                                    renderInput={(params) => <TextField {...params} label="Neuer Alias" size='small'
                                        onChange={(value) => {
                                            setalias(value.target.value);
                                        }} />}
                                />
                            </ListItem>
                            {lecture?.aliases.map(alias => <>
                                <Divider />
                                <ListItem secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => del(alias.id, "alias")}>
                                        <DeleteIcon />
                                    </IconButton>
                                }>
                                    {alias.name}
                                </ListItem>
                            </>)}
                        </List>
                    </Paper>
                </div>
            </div>
            <Spacer vertical={30} />
            <Button variant='contained' onClick={() => navigate("/admin")}>Zurück</Button>
        </div >
    )
}

export default Lecture