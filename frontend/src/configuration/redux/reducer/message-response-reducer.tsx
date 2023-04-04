import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface Message {
    message?: string
    error?: boolean
}

const initialState:Message = {} 

export const loginReducer = createSlice({
    name: 'messageRespon',
    initialState,
    reducers: {
        setMessage: (state, value:PayloadAction<Message>) => state = value.payload
    }
})

export const {setMessage} = loginReducer.actions

export default loginReducer.reducer