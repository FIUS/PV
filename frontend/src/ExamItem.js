import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import './common.css';

const ExamItem = ({ lecture, short, prof, note, cart, setcart }) => {

    const addItem = () => {
        if (!isInCart) {
            setcart([...cart, lecture])
        }else{
            setcart([...cart].filter((item) => item !== lecture))
        }
    }

    const isInCart = [...cart].includes(lecture)
    const itemcolor = [...cart].includes(lecture) ? "#a2cf6e" : "inherit"

    return (
        <TableRow className="examitem" style={{ backgroundColor: itemcolor }} onDoubleClick={() => addItem()} >
            <TableCell component="th" scope="row">  {lecture}</TableCell>
            <TableCell align="right">{short}</TableCell>
            <TableCell align="right">{prof}</TableCell>
            <TableCell align="right">{note}</TableCell>
        </TableRow>
    )
}

export default ExamItem
