import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { openErrorToast } from '../../../Actions/CommonAction';
import { Share } from '../../../types/ResponseTypes';
import { doGetRequest } from '../../Common/StaticFunctions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link, Paper } from '@mui/material';

type Props = {}

const LinkView = (props: Props) => {

    const params = useParams()
    const id = params.share ? params.share : "none"
    const dispatch = useDispatch()
    const [share, setshare] = useState<Share | undefined>(undefined)

    useEffect(() => {
        doGetRequest("share/" + id).then(result => {
            if (result.code === 200) {
                setshare(result.content)
            } else {
                dispatch(openErrorToast())
            }
        })
    }, [dispatch, id])


    return (<div style={{ "margin": "10px" }}>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Modulname
                        </TableCell>
                        <TableCell >
                            Link
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {share?.links.map(lecture => {
                        return <TableRow key={lecture.link} hover role="checkbox">
                            <TableCell>
                                {lecture.name}
                            </TableCell>
                            <TableCell>
                                <Link href={lecture.link}>
                                    {lecture.link}
                                </Link>
                            </TableCell>
                        </TableRow>
                    })}

                </TableBody>
            </Table>
        </TableContainer>
    </div>
    )
}

export default LinkView