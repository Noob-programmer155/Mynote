import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface OptionalMessage {
    title?: string
    onClickOk: () => void
    isDisable?: boolean
}
export interface Message {
    message?: string
    isOptional?: OptionalMessage
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