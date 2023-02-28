import { AlertColor } from "@mui/material"
import { Lecture, Share } from "../types/ResponseTypes"

const defaultAlertType: AlertColor = "success"

const initialState: CommonReducerType = {
    lectures: [],
    isLoggedIn: false,
    cart: [],
    share: null,
    toast: {
        open: false,
        duration: 4000,
        headline: undefined,
        message: "",
        type: defaultAlertType
    }

}

export type CommonReducerType = {
    lectures: Array<Lecture>,
    isLoggedIn: boolean,
    cart: Array<number>,
    share: Share | null,
    toast: {
        open: boolean,
        duration: number,
        headline: string | undefined,
        message: string,
        type: AlertColor
    }
}

const reducer = (state = initialState, { type, payload }: any) => {

    var newState = { ...state }
    switch (type) {
        case "CLEAR_CART":
            newState.cart = []
            newState.share = null
            return newState
        case "ADD_SHARE":
            newState.share = payload
            return newState
        case "REMOVE_FROM_CART":
            newState.cart = newState.cart.filter(f => f !== payload)
            return newState
        case "ADD_TO_CART":
            newState.cart = newState.cart.filter(f => f !== payload).concat([payload])
            return newState
        case "SET_LECTURES":
            newState.lectures = payload
            return newState

        case "SET_LOGIN":
            newState.isLoggedIn = payload
            return newState

        case "OPEN_TOAST":
            newState.toast.open = true;
            newState.toast.message = payload.message;
            newState.toast.headline = payload.headline
            newState.toast.duration = payload.duration ? payload.duration : initialState.toast.duration
            newState.toast.type = payload.type ? payload.type : defaultAlertType
            return newState

        case "CLOSE_TOAST":
            newState.toast.open = false;
            return newState
        default:
            return state
    }

}
export default reducer
