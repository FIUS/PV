import React, { useCallback, useEffect, useRef, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import style from './overview.module.scss'
import { doGetRequest, doRequest } from '../../Common/StaticFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { openErrorToast, openToast, setLectures } from '../../../Actions/CommonAction';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import { RootState } from '../../../Reducer/reducerCombiner';
import { Button, Chip, CircularProgress } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import { Lecture, SyncResult, SyncStatus } from '../../../types/ResponseTypes';

type Props = {}

const SYNC_POLL_INTERVAL = 2000

const syncSummary = (result: SyncResult) => {
    return "Sync abgeschlossen: " + result.created + " neue Lectures, " + result.renewed + " Links erneuert, " + result.withoutFolder + " ohne Ordner"
}

export const checkLectureStatus = (lecture: Lecture) => {
    if (lecture.link === null) {
        return <Chip icon={<WarningIcon color="error" />} label="Kein Link" variant="outlined" style={{ "paddingLeft": "5px" }} />
    }

    return <Chip icon={<CheckCircleIcon color="success" />} label="OK" variant="outlined" />
};

const Overview = (props: Props) => {
    const dispatch = useDispatch()
    const [syncing, setSyncing] = useState(false)
    const mounted = useRef(true)
    const pollTimeout = useRef<number | undefined>(undefined)

    const loadLectures = useCallback(() => {
        doGetRequest("lectures").then((value) => {
            if (value.code === 200) {
                dispatch(setLectures(value.content))
            }
        })
    }, [dispatch])

    const pollSync = useCallback(() => {
        setSyncing(true)
        const tick = () => {
            doGetRequest("sync").then((value) => {
                if (!mounted.current) {
                    return
                }
                if (value.code !== 200) {
                    setSyncing(false)
                    dispatch(openErrorToast())
                    return
                }
                const status: SyncStatus = value.content
                if (status.running) {
                    pollTimeout.current = window.setTimeout(tick, SYNC_POLL_INTERVAL)
                    return
                }
                setSyncing(false)
                if (status.error) {
                    dispatch(openToast({ message: "Sync fehlgeschlagen: " + status.error, type: "error", duration: 8000 }))
                } else if (status.result) {
                    dispatch(openToast({ message: syncSummary(status.result) }))
                }
                loadLectures()
            })
        }
        tick()
    }, [dispatch, loadLectures])

    const startSync = () => {
        setSyncing(true)
        doRequest("POST", "sync").then((value) => {
            if (value.code === 200) {
                pollSync()
            } else {
                setSyncing(false)
                dispatch(openErrorToast())
            }
        })
    }

    useEffect(() => {
        mounted.current = true
        loadLectures()
        // Show the spinner if a Sync (e.g. the scheduled one) is already running
        doGetRequest("sync").then((value) => {
            if (mounted.current && value.code === 200 && value.content.running) {
                pollSync()
            }
        })
        return () => {
            mounted.current = false
            window.clearTimeout(pollTimeout.current)
        }
    }, [loadLectures, pollSync])

    const navigate = useNavigate()
    const common: CommonReducerType = useSelector((state: RootState) => state.common);

    const statusIcon = () => {
        if (common.lectures.find(value => value.link === null)) {
            return <WarningIcon color="error" />
        }

        return <CheckCircleIcon color="success" />
    }


    return (
        <div className={style.container}>
            <div className={style.toolbar}>
                <Button
                    variant='contained'
                    onClick={startSync}
                    disabled={syncing}
                    startIcon={syncing ? <CircularProgress size={18} color="inherit" /> : <SyncIcon />}
                >
                    {syncing ? "Sync läuft..." : "Nextcloud Sync"}
                </Button>
            </div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow >
                            <TableCell  >
                                Modulname
                            </TableCell>
                            <TableCell  >
                                Nextcloud Link
                            </TableCell>
                            <TableCell  >
                                <div className={style.oneLine}>
                                    Status {statusIcon()}
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {common.lectures.map(lecture => {
                            return <TableRow key={lecture.id} onClick={() => { console.log(lecture.id); navigate("lecture/" + lecture.id) }} hover role="checkbox" className={style.mouseClick}>
                                <TableCell>
                                    {lecture.name}
                                </TableCell>
                                <TableCell  >
                                    {lecture.link}
                                </TableCell>
                                <TableCell  >
                                    {checkLectureStatus(lecture)}
                                </TableCell>

                            </TableRow>
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Overview