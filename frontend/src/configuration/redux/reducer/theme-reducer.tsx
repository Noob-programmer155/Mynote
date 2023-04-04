import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Theme as ThemeObj } from "../../../model/model"

const defaultTheme = {
    name: "default",
    background_color: "#ffffffff",
    foreground_color: "#363535ff",
    border_color: "#fcd403ff",
    background: "#fa9405ff",
    foreground: "#f0f0f0ff",
    danger_background: "#ff1900ff",
    danger_foreground: "#f0f0f0ff",
    info_background: "#1dc257ff",
    info_foreground: "#f0f0f0ff",
    default_background: "#059df0ff",
    default_foreground: "#f0f0f0ff"
} as ThemeObj

export const themeReducer = createSlice({
    name: "themeReducer",
    initialState: {
        theme: defaultTheme
    },
    reducers: {
        setTheme: (state, value: PayloadAction<ThemeObj>) => {state.theme = value.payload}
    }
})

export const {setTheme} = themeReducer.actions
export default themeReducer.reducer