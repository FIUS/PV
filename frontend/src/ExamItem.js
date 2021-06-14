import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import './common.css';

const ExamItem = ({ id, lecture, short, prof, note, cart, setcart }) => {

    const addItem = () => {
        if (!isInCart) {
            setcart([...cart, [id, lecture]])
        } else {
            setcart([...cart].filter((item) => item !== [id, lecture]))
        }
    }

    const isInCart = [...cart].some(item => item[0] === id)
    const itemcolor = isInCart ? "#a2cf6e" : ""

    return (
        <TableRow className="examitem" style={{ backgroundColor: itemcolor }} onDoubleClick={() => addItem()} >
            <TableCell component="th" scope="row" style={{width:"70px"}}>
                {!isInCart?(
                <Button onClick={() => addItem()}>
                    <AddBoxIcon style={{color:"#8bc34a"}}/>
                </Button>
                ):""}
            </TableCell>
            <TableCell> {lecture}</TableCell>
            <TableCell align="right">{short}</TableCell>
            <TableCell align="right">{prof}</TableCell>
            <TableCell align="right">{note}</TableCell>
        </TableRow>
    )
}

export default ExamItem
