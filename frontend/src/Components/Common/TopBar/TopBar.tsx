import { Person, SettingsOutlined } from '@mui/icons-material'
import { AppBar, Button, IconButton, Toolbar } from '@mui/material'
import React, { useState } from 'react'
import Spacer from '../Spacer'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import { doPostRequest } from '../StaticFunctions';
import { RootState } from '../../../Reducer/reducerCombiner';
import InfoIcon from '@mui/icons-material/Info';
import About from './About';
import Cookies from 'js-cookie';
import { clearCart } from '../../../Actions/CommonAction';

type Props = {}


const TopBar = (props: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const common: CommonReducerType = useSelector((state: RootState) => state.common);
    const [aboutDialogOpen, setaboutDialogOpen] = useState(false)
    const dispatch = useDispatch();

    const navigationButton = () => {
        if (location.pathname.startsWith("/admin")) {
            return <IconButton sx={{ flexGrow: 1 }} color="inherit" onClick={() => navigate("/")}><Person /></IconButton>
        } else {
            return <IconButton sx={{ flexGrow: 1 }} color="inherit" onClick={() => navigate("admin")}><SettingsOutlined /></IconButton>
        }
    }


    const shouldDisplayAbout = () => {
        return window.globalTS.ORGANISATION_NAME !== "" ||
            window.globalTS.ABOUT_LINK !== "" ||
            window.globalTS.PRIVACY_LINK !== "" ||
            window.globalTS.ADDITIONAL_INFORMATION !== ""
    }

    const isUser = () => {
        return parseInt(Cookies.get("memberID") as string)
    }

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <div style={{ display: "flex" }}>

                        <Button
                            size="large"
                            color="inherit"
                            onClick={() => {
                                dispatch(clearCart());
                                navigate(isUser() !== 1 && isUser() !== 2 ? "/user/" + isUser() : "/")
                            }
                            }
                            sx={{ display: "inline-flex" }}
                            variant="text">
                            {window.globalTS.HOME_BUTTON}
                        </Button>
                    </div>
                    <div style={{ display: "flex" }}>
                        {shouldDisplayAbout() ? <IconButton
                            color="inherit"
                            onClick={() => {
                                setaboutDialogOpen(true)
                            }}
                        >
                            <InfoIcon />
                        </IconButton> : <></>}
                        <About isOpen={aboutDialogOpen} close={() => setaboutDialogOpen(false)} />
                        {navigationButton()}
                        <Spacer horizontal={20} />
                        <Button color="inherit" onClick={() => {
                            if (common.isLoggedIn) {
                                doPostRequest("logout", "")
                            }
                            navigate("/login")
                        }}>{common.isLoggedIn ? "Logout" : "Login"}</Button>
                    </div>
                </Toolbar>
            </AppBar>

        </>
    )
}

export default TopBar