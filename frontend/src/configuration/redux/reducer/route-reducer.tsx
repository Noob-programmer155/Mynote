import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReduxRoute } from "../../../usecase/other/redux-item-route";

export const routeReducer = createSlice({
    name:"routeReducer",
    initialState: {
        route: ReduxRoute.THEME
    },
    reducers:{
        setRoute:(state, action: PayloadAction<ReduxRoute>) => {state.route = action.payload}
    }
})

export const {setRoute} = routeReducer.actions
export default routeReducer.reducer