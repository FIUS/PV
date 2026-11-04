import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';

const ConfirmDialog = ({ title, open, setOpen, onConfirm, buttonText, isPositive, message }) => {

    const handleClose = () => {
        setOpen(false);
    };
    if (!open) {
        return ""
    }
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title" sx={{ m: 0, p: 2, pr: 6, minWidth: '300px' }}>
                {title}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="subtitle1"><b>Bist du dir sicher?</b></Typography>
                {message ? <Typography variant="body2">{message}</Typography> : <></>}
            </DialogContent>
            <DialogActions style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant='outlined' onClick={() => handleClose()}>
                    Abbrechen
                </Button>
                <Button variant='contained' color={isPositive ? "success" : "error"} onClick={onConfirm}>
                    {buttonText === undefined ? "Ja" : buttonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
