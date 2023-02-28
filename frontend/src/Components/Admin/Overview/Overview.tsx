import React, { useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import style from './overview.module.scss'
import { doGetRequest } from '../../Common/StaticFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { setLectures } from '../../../Actions/CommonAction';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import { RootState } from '../../../Reducer/reducerCombiner';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import { Lecture } from '../../../types/ResponseTypes';

type Props = {}

export const checkLectureStatus = (lecture: Lecture) => {
    if (lecture.link === null) {
        return <Chip icon={<WarningIcon color="error" />} label="Kein Link" variant="outlined" style={{ "paddingLeft": "5px" }} />
    }

    return <Chip icon={<CheckCircleIcon color="success" />} label="OK" variant="outlined" />
};

const Overview = (props: Props) => {
    const dispatch = useDispatch()
    useEffect(() => {
        doGetRequest("lectures").then((value) => {
            if (value.code === 200) {
                dispatch(setLectures(value.content))
            }
        })
    }, [dispatch])

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