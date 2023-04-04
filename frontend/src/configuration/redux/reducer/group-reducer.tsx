import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Group } from "../../../model/model"

interface GroupState {
    group?: Group
    groupPreview?: Group
    avatar?: File
    openProfile: boolean
    groups: Group[]
}

const initialState: GroupState = {
    groups: [],
    openProfile: false
}
export const groupReducer = createSlice({
    name: "groupReducer",
    initialState,
    reducers: {
        setGroup: (state, value: PayloadAction<Group>) => {state.group = value.payload},
        setGroupPreview: (state, value: PayloadAction<Group>) => {state.groupPreview = value.payload},
        setAvatar: (state, value: PayloadAction<File>) => {state.avatar = value.payload},
        setOpenProfile: (state,value: PayloadAction<boolean>) => {state.openProfile = value.payload},
        setGroups: (state,value: PayloadAction<Group[]>) => {state.groups = value.payload},
    }
})

export const {setGroup,setGroupPreview,setAvatar,setOpenProfile,setGroups} = groupReducer.actions
export default groupReducer.reducer