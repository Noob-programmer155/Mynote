import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { NoteCollab, NotePrivate, Subtype } from "../../../model/model"

interface NoteState {
    notePrivate?: NotePrivate
    noteCollab?: NoteCollab
    subtype?: Subtype
    notePrivates: NotePrivate[]
    noteCollabs: NoteCollab[]
}

const initialState: NoteState = {
    notePrivates: [],
    noteCollabs: []
}

export const noteReducer = createSlice({
    name: "noteReducer",
    initialState,
    reducers: {
        setNotePrivate: (state,value: PayloadAction<NotePrivate>) => {state.notePrivate = value.payload},
        setNoteCollab: (state,value: PayloadAction<NoteCollab>) => {state.noteCollab = value.payload},
        setSubtype: (state,value: PayloadAction<Subtype>) => {state.subtype = value.payload},
        setNotePrivates: (state,value: PayloadAction<NotePrivate[]>) => {state.notePrivates = value.payload},
        setNoteCollabs: (state,value: PayloadAction<NoteCollab[]>) => {state.noteCollabs = value.payload}
    }
})

export const {setNotePrivate,setNoteCollab,setSubtype,setNotePrivates,setNoteCollabs} = noteReducer.actions
export default noteReducer.reducer