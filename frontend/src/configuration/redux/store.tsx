import { configureStore } from "@reduxjs/toolkit";
import MessageReducer from "./reducer/message-response-reducer";
import ProfileReducer from "./reducer/profile-reducer";
import ThemeReducer from "./reducer/theme-reducer";
import RouteReducer from "./reducer/route-reducer";
import MemberReducer from "./reducer/member-reducer";
import GroupReducer from "./reducer/group-reducer";
import NoteReducer from "./reducer/note-reducer";
import NotificationReducer from "./reducer/notification-reducer";
import SearchAndFilterReducer from "./reducer/search-reducer";

export const store = configureStore({
    reducer:{
        notificationReducer: NotificationReducer,
        messageRespon: MessageReducer,
        themeReducer: ThemeReducer,
        profileReducer: ProfileReducer,
        routeReducer: RouteReducer,
        memberReducer: MemberReducer,
        groupReducer: GroupReducer,
        noteReducer: NoteReducer,
        searchAndFilterReducer: SearchAndFilterReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store