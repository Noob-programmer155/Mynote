import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Member } from "../../../model/model"
import { IdAndName } from "../../../model/model-side"

interface MemberState {
    member?: Member
    memberPreview?: Member
    members: Member[]
    openProfile: boolean
    memberGuess: IdAndName<string>[]
}

const initialState: MemberState = {
    members: [],
    memberGuess: [],
    openProfile: false
}
export const memberReducer = createSlice({
    name: "memberReducer",
    initialState,
    reducers: {
        setMember: (state,value: PayloadAction<Member>) => {state.member = value.payload},
        setMemberPreview: (state,value: PayloadAction<Member | undefined>) => {state.memberPreview = value.payload},
        setMembers: (state,value: PayloadAction<Member[]>) => {state.members = value.payload},
        setOpenProfile: (state,value: PayloadAction<boolean>) => {state.openProfile = value.payload},
        setMemberGuess: (state,value: PayloadAction<IdAndName<string>[]>) => {state.memberGuess = value.payload}
    }
})

export const {setOpenProfile,setMember,setMembers,setMemberPreview,setMemberGuess} = memberReducer.actions
export default memberReducer.reducer