import { AlertColor } from "@mui/material"
import { ERROR_MESSAGE } from "../Components/Common/Internationalization/i18n"
import { Lecture, Share } from "../types/ResponseTypes"


export const clearCart = () => {
    return {
        type: "CLEAR_CART",
        payload: null
    }
}

export const addShare = (share: Share) => {
    return {
        type: "ADD_SHARE",
        payload: share
    }
}

export const removeFromCart = (id: number) => {
    return {
        type: "REMOVE_FROM_CART",
        payload: id
    }
}

export const addToCart = (id: number) => {
    return {
        type: "ADD_TO_CART",
        payload: id
    }
}

export const setLectures = (lectures: Array<Lecture>) => {
    return {
        type: "SET_LECTURES",
        payload: lectures
    }
}

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