import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Group } from "../../../model/model"
import { IdAndName } from "../../../model/model-side"

interface GroupState {
    group?: Group
    groupPreview?: Group
    openProfile: boolean
    groups: Group[]
    groupGuess: IdAndName<string>[]
}

const initialState: GroupState = {
    groups: [],
    groupGuess: [],
    openProfile: false
}
export const groupReducer = createSlice({
    name: "groupReducer",
    initialState,
    reducers: {
        setGroup: (state, value: PayloadAction<Group>) => {state.group = value.payload},
        setGroupPreview: (state, value: PayloadAction<Group | undefined>) => {state.groupPreview = value.payload},
        setOpenProfile: (state,value: PayloadAction<boolean>) => {state.openProfile = value.payload},
        setGroups: (state,value: PayloadAction<Group[]>) => {state.groups = value.payload},
        setGroupGuess: (state,value: PayloadAction<IdAndName<string>[]>) => {state.groupGuess = value.payload}
    }
})

export const {setGroup,setGroupPreview,setOpenProfile,setGroups,setGroupGuess} = groupReducer.actions
export default groupReducer.reducer