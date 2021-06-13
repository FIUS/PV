import React from 'react'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CartListItem from './CartListItem';


const CartList = ({ cart, setcart }) => {
    return (
        <div className="flexMiddle" style={{ marginTop: "30px" }}>
            <Typography variant="h6">
                Im Einkaufswagen
            </Typography>
            <TableContainer style={{ marginTop: "20px", width: "70%" }} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Fach</TableCell>
                            <TableCell align="right">Entfernen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.map((lec) => <CartListItem key={lec} lecture={lec} cart={cart} setcart={setcart} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default CartList
