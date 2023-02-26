import { AlertColor } from "@mui/material"
import { ERROR_MESSAGE } from "../Components/Common/Internationalization/i18n"

export const setLoginState = (isLoggedIn: boolean) => {
    return {
        type: "SET_LOGIN",
        payload: isLoggedIn
    }
}

export const openToast = (settings: {
    message: string,
    headline?: string,
    duration?: number,
    type?: AlertColor
}) => {
    return {
        type: "OPEN_TOAST",
        payload: settings
    }
}

export const closeToast = () => {
    return {
        type: "CLOSE_TOAST",
        payload: ""
    }
}

export const openErrorToast = () => {
    return openToast({ message: ERROR_MESSAGE, type: "error" })
}