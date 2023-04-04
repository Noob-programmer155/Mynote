import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Member } from "../../../model/model"

interface MemberState {
    memberPreview?: Member
    members: Member[]
    openProfile: boolean
}

const initialState: MemberState = {
    members: [],
    openProfile: false
}
export const memberReducer = createSlice({
    name: "memberReducer",
    initialState,
    reducers: {
        setMemberPreview: (state,value: PayloadAction<Member>) => {state.memberPreview = value.payload},
        setMembers: (state,value: PayloadAction<Member[]>) => {state.members = value.payload},
        setOpenProfile: (state,value: PayloadAction<boolean>) => {state.openProfile = value.payload}
    }
})

export const {setOpenProfile,setMembers,setMemberPreview} = memberReducer.actions
export default memberReducer.reducer