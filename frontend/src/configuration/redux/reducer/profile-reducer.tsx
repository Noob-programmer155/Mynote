import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Member } from "../../../model/model";

interface ProfileState {
    profile?: Member
    avatar?: File
    openProfile: boolean
}

const initialState: ProfileState = {
    openProfile: false
}

export const profileReducer = createSlice({
    name: "profileReducer",
    initialState,
    reducers: {
        setProfile: (state, value: PayloadAction<Member>) => {state.profile = value.payload},
        setAvatar: (state, value: PayloadAction<File>) => {state.avatar = value.payload},
        setOpenProfile: (state,value: PayloadAction<boolean>) => {state.openProfile = value.payload}
    }
})

export const {setProfile,setAvatar,setOpenProfile} = profileReducer.actions
export default profileReducer.reducer