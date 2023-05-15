import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface Message {
    message?: string
    isOptional?: {
        title?: string,
        onClickOk: () => void
        isDisable?: boolean
    }
    error?: boolean
}

interface MessageObj {
    message: Message
}
const initialState:MessageObj = {
    message:{}
} 

export const messageReducer = createSlice({
    name: 'messageRespon',
    initialState,
    reducers: {
        setMessage: (state, value:PayloadAction<Message>) => {state.message = value.payload}
    }
})

export const {setMessage} = messageReducer.actions

export default messageReducer.reducer