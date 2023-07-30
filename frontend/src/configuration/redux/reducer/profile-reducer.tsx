import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Group, Member, Theme } from "../../../model/model";
import { defaultTheme } from "../../../model/resource";
import { compareTheme } from "../../../usecase/other/validate";

interface ProfileState {
    profile?: Member
    theme: Theme
    openProfile: boolean
    groups: Group[]
    members: Member[]
    group?: Group
    themes: Theme[]
    login: boolean
}

const initialState: ProfileState = {
    theme:defaultTheme,
    openProfile: false,
    profile: {username:"anon"},
    themes: [],
    groups: [],
    members: [],
    login: false
}

export const profileReducer = createSlice({
    name: "profileReducer",
    initialState,
    reducers: {
        setProfile: (state, value: PayloadAction<Member|undefined>) => {state.profile = value.payload},
        setThemeProfile: (state, value: PayloadAction<Theme>) => {if (!compareTheme(state.theme,value.payload)) state.theme = value.payload},
        setOpenProfile: (state,value: PayloadAction<boolean>) => {state.openProfile = value.payload},
        setGroupsProfiles: (state,value: PayloadAction<Group[]>) => {state.groups = value.payload},
        setGroupMemberProfiles: (state,value: PayloadAction<Member[]>) => {state.members = value.payload},
        setGroupProfile: (state,value: PayloadAction<Group|undefined>) => {state.group = value.payload},
        setThemesProfiles: (state,value: PayloadAction<Theme[]>) => {state.themes = value.payload},
        setLogin:(state,value:PayloadAction<boolean>) => {state.login = value.payload}, 
        setLogout: (state,value: PayloadAction<void>) => {state = initialState}
    }
})

export const {setProfile,setThemeProfile,setOpenProfile,setGroupsProfiles,setGroupProfile,setThemesProfiles,setGroupMemberProfiles,setLogin,setLogout} = profileReducer.actions
export default profileReducer.reducer