import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Theme as ThemeObj } from "../../../model/model"
import { IdAndName } from "../../../model/model-side";

interface ThemeReducerInterface {
    theme?: ThemeObj
    themePreview?: ThemeObj
    themes: ThemeObj[]
    themeGuess: IdAndName<string>[]
}

const initialState:ThemeReducerInterface = {
    themes: [],
    themeGuess: []
}
export const themeReducer = createSlice({
    name: "themeReducer",
    initialState,
    reducers: {
        setTheme: (state, value: PayloadAction<ThemeObj>) => {state.theme = value.payload},
        setThemePreview: (state, value: PayloadAction<ThemeObj>) => {state.themePreview = value.payload},
        setThemes: (state, value: PayloadAction<ThemeObj[]>) => {state.themes = value.payload},
        setSearchGuess: (state, value: PayloadAction<IdAndName<string>[]>) => {state.themeGuess = value.payload}
    }
})

export const {setTheme,setThemePreview,setThemes,setSearchGuess} = themeReducer.actions
export default themeReducer.reducer