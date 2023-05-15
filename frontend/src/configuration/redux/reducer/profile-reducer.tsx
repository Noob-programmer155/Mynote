import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Group, Member, Theme } from "../../../model/model";
import { defaultTheme } from "../../../model/data/resource/resource";

interface ProfileState {
    profile?: Member
    openProfile: boolean
    groups: Group[]
    group?: Group
    themes: Theme[]
}

const initialState: ProfileState = {
    openProfile: false,
    profile: {username:"anon",theme:defaultTheme},
    themes: [],
    groups: []
}

export const profileReducer = createSlice({
    name: "profileReducer",
    initialState,
    reducers: {
        setProfile: (state, value: PayloadAction<Member>) => {state.profile = value.payload},
        setOpenProfile: (state,value: PayloadAction<boolean>) => {state.openProfile = value.payload},
        setGroupsProfiles: (state,value: PayloadAction<Group[]>) => {state.groups = value.payload},
        setGroupProfile: (state,value: PayloadAction<Group|undefined>) => {state.group = value.payload},
        setThemesProfiles: (state,value: PayloadAction<Theme[]>) => {state.themes = value.payload},
        logout: (state,value: PayloadAction<void>) => {state = initialState}
    }
})

export const {setProfile,setOpenProfile,setGroupsProfiles,setGroupProfile,setThemesProfiles,logout} = profileReducer.actions
export default profileReducer.reducer