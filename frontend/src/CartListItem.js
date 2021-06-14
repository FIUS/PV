import React from 'react'
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import './common.css';

const CartListItem = ({ lecture, cart, setcart }) => {

    const deleteFromCart = () => {
        setcart([...cart].filter((item) => item !== lecture))
    }

    return (
        <TableRow className="examitem">
            <TableCell component="th" scope="row">  {lecture[1]}</TableCell>
            <TableCell align="right">
                <Button onClick={() => deleteFromCart()}>
                    <DeleteForeverIcon />
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default CartListItem
