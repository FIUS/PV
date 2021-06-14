import React from 'react'
import QRCode from "react-qr-code";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import './common.css'

const Checkout = ({ setInCheckout, qrUrl ,setqrUrl,setCart}) => {
    const back=()=>{
        setqrUrl("");
        setCart([]);
        setInCheckout(false);
    }

    return (
        <div>
            {qrUrl !== "" ? (
                <div className="flexMiddle" style={{marginTop:"30px"}}>
                    <QRCode value={qrUrl} />
                    <Button onClick={()=>back()} style={{marginTop:"20px"}}>Zurück</Button>
                </div>) : (
                <div className="flexMiddle">
                    <Typography variant="h6" style={{marginTop:"20px"}}>
                        Generating QR-Code
                    </Typography>
                    <CircularProgress style={{marginTop:"20px"}}/>
                </div>
            )}
        </div>
    )
}

export default Checkout
