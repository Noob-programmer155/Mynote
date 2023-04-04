import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Group, Member } from "../../../model/model"

interface NotificationStateData {
    requestListMember: Member[]
    requestRejectedMember: Member[]
    requestListGroup: Group[]
    requestRejectedGroup: Group[]
    openNotification: boolean
}

const initialState: NotificationStateData = {
    requestListMember: [],
    requestRejectedMember: [],
    requestListGroup: [],
    requestRejectedGroup: [],
    openNotification: false,
}

export const notificationReducer = createSlice({
    name:"notificationReducer",
    initialState,
    reducers: {
        setRequestListMember: (state, value: PayloadAction<Member[]>) => {state.requestListMember = value.payload},
        setRequestRejectedMember: (state, value: PayloadAction<Member[]>) => {state.requestRejectedMember = value.payload},
        setRequestListGroup: (state, value: PayloadAction<Group[]>) => {state.requestListGroup = value.payload},
        setRequestRejectedGroup: (state, value: PayloadAction<Group[]>) => {state.requestRejectedGroup = value.payload},
        setOpenNotification: (state, value: PayloadAction<boolean>) => {state.openNotification = value.payload}
    }
})

export const {setRequestListGroup,setRequestListMember,setRequestRejectedGroup,setRequestRejectedMember,setOpenNotification} = notificationReducer.actions
export default notificationReducer.reducer