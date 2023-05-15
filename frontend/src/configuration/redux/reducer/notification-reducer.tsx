import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Group, Member } from "../../../model/model"

interface NotificationStateData {
    requestListMember: Member[]
    requestRejectedMember: Member[]
    requestListGroup: Group[]
    requestRejectedGroup: Group[]
    openNotificationMember: boolean
    openNotificationGroup: boolean
}

const initialState: NotificationStateData = {
    requestListMember: [],
    requestRejectedMember: [],
    requestListGroup: [],
    requestRejectedGroup: [],
    openNotificationMember: false,
    openNotificationGroup: false
}

export const notificationReducer = createSlice({
    name:"notificationReducer",
    initialState,
    reducers: {
        setRequestListMember: (state, value: PayloadAction<Member[]>) => {state.requestListMember = value.payload},
        setRequestRejectedMember: (state, value: PayloadAction<Member[]>) => {state.requestRejectedMember = value.payload},
        setRequestListGroup: (state, value: PayloadAction<Group[]>) => {state.requestListGroup = value.payload},
        setRequestRejectedGroup: (state, value: PayloadAction<Group[]>) => {state.requestRejectedGroup = value.payload},
        setOpenNotificationMember: (state, value: PayloadAction<boolean>) => {state.openNotificationMember = value.payload},
        setOpenNotificationGroup: (state, value: PayloadAction<boolean>) => {state.openNotificationGroup = value.payload}
    }
})

export const {setRequestListGroup,setRequestListMember,setRequestRejectedGroup,setRequestRejectedMember,setOpenNotificationMember,setOpenNotificationGroup} = notificationReducer.actions
export default notificationReducer.reducer