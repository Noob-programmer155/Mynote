import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FilterType, SearchType } from "../../../model/data/router-server/redux-item-route";

interface SearchAndFilterReducerInterface {
    search: SearchType,
    myThemeSearch: SearchType,
    globalThemeSearch: SearchType,
    notePrivateSearch: SearchType,
    noteCollabSearch: SearchType,
    notePrivateFilter: FilterType,
    noteCollabFilter: FilterType
}

const initialState: SearchAndFilterReducerInterface = {
    search: {
        page:0,
        size:15,
        endPage: false
    },
    myThemeSearch: {
        page:0,
        size:20,
        endPage: false
    },
    globalThemeSearch: {
        page:0,
        size:20,
        endPage: false
    },
    notePrivateSearch: {
        page:0,
        size:20,
        endPage: false
    },
    noteCollabSearch: {
        page:0,
        size:20,
        endPage: false
    },
    notePrivateFilter: {},
    noteCollabFilter: {}
} 

export const searchAndFilterReducer = createSlice({
    name:"searchAndFilterReducer",
    initialState,
    reducers: {
        setSearch: (state,value: PayloadAction<SearchType>) => {state.search = value.payload},
        setMyThemeSearch: (state, value: PayloadAction<SearchType>) => {state.myThemeSearch = value.payload},
        setGlobalThemeSearch: (state, value: PayloadAction<SearchType>) => {state.globalThemeSearch = value.payload},
        setNotePrivateSearch: (state, value: PayloadAction<SearchType>) => {state.notePrivateSearch = value.payload},
        setNoteCollabSearch: (state, value: PayloadAction<SearchType>) => {state.noteCollabSearch = value.payload},
        setNotePrivateFilter: (state, value: PayloadAction<FilterType>) => {state.notePrivateFilter = value.payload},
        setNoteCollabFilter: (state, value: PayloadAction<FilterType>) => {state.noteCollabFilter = value.payload}
    }
})

export const {setSearch,setGlobalThemeSearch,setMyThemeSearch,setNoteCollabSearch,setNotePrivateSearch,setNoteCollabFilter,setNotePrivateFilter} = searchAndFilterReducer.actions
export default searchAndFilterReducer.reducer