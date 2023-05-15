import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { NoteCollab, NotePrivate, Subtype } from "../../../model/model"

interface NoteState {
    notePrivate?: NotePrivate
    noteCollab?: NoteCollab
    subtype: Subtype
    subtypes: Subtype[]
    notePrivates: Array<{category:string,data:NotePrivate[]}>
}

const initialState: NoteState = {
    notePrivates: [],
    subtypes: [],
    subtype:{name:""}
}

export const noteReducer = createSlice({
    name: "noteReducer",
    initialState,
    reducers: {
        setNotePrivate: (state,value: PayloadAction<NotePrivate | undefined>) => {state.notePrivate = value.payload},
        setNoteCollab: (state,value: PayloadAction<NoteCollab | undefined>) => {state.noteCollab = value.payload},
        setSubtype: (state,value: PayloadAction<Subtype>) => {state.subtype = value.payload},
        setSubtypes: (state,value: PayloadAction<Subtype[]>) => {state.subtypes = value.payload},
        setNotePrivates: (state,value: PayloadAction<Array<{category:string,data:NotePrivate[]}>>) => {state.notePrivates = value.payload}
    }
})

export const {setNotePrivate,setNoteCollab,setSubtype,setSubtypes,setNotePrivates} = noteReducer.actions
export default noteReducer.reducer