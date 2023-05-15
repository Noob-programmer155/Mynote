import React, { useEffect, useState } from "react";
import HeaderView from "./view-controller/header-view";
import { NotificationViewForGroup, NotificationViewForMember } from "./view-controller/notification-view";
import { GroupAdapter } from "../adapter/group-adapter";
import { MemberAdapter } from "../adapter/member-adapter";
import { MainAdapter } from "../adapter/adapter";
import { Box, Stack, Tab, Tabs, useMediaQuery } from "@mui/material";
import { GroupPreviewView, MemberPreviewView, ProfileGroupView, UserViewSearch } from "./view-controller/user-view";
import { useAppDispatch, useAppSelector } from "../configuration/redux/hooks";
import { setSearch } from "../configuration/redux/reducer/search-reducer";
import { exhaustMap, of, take, zip } from "rxjs";
import { setMembers } from "../configuration/redux/reducer/member-reducer";
import { setMessage } from "../configuration/redux/reducer/message-response-reducer";
import { setRoute } from "../configuration/redux/reducer/route-reducer";
import { setGroups } from "../configuration/redux/reducer/group-reducer";
import { ReduxRoute } from "../configuration/redux/redux-item-route";
import { Router } from "../model/data/router-server/router";
import { LoginView } from "./view-controller/login-view";
import { SignInGroupView, SignInMemberView } from "./view-controller/signin-view";
import { GroupNoteView, PrivateNoteView } from "./view-controller/note-view";
import { TabPanel } from "./container/global";
import { ThemeView } from "./view-controller/theme-view";
import { setGroupProfile } from "../configuration/redux/reducer/profile-reducer";
import { DateConverter, FileConverter, NoteCollabArrayConverter, NotePrivateArrayConverter } from "../adapter/converter/attribute";
import { GroupRounded, NoteRounded } from "@mui/icons-material";
import { MessageView } from "./view-controller/message-view";

export default function View() {
    const large = useMediaQuery("(min-width:1200px)") 
    const groupAdapter = MainAdapter.GROUP
    const memberAdapter = MainAdapter.MEMBER
    const subtypeAdapter = MainAdapter.SUBTYPE
    const themeAdapter = MainAdapter.THEME
    const noteAdapter = MainAdapter.NOTE
    const publicAdapter = MainAdapter.PUBLIC
    const dateConverter = new DateConverter()
    const noteArrayCollabConverter = new NoteCollabArrayConverter()
    const noteArrayPrivateConverter = new NotePrivateArrayConverter()
    const fileConverter = new FileConverter()
    const [tab,setTab] = useState(0)
    const [isMember,setIsMember] = useState(false)
    const [isAddGroup,setIsAddGroup] = useState(false)
    const search = useAppSelector(state => state.searchAndFilterReducer.search)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const groupProfile = useAppSelector(state => state.profileReducer.group)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (profile && !profile.id) {
            dispatch(setRoute(ReduxRoute.SIGNUP))
        }
    },[])
    const onSearch = (adapterMember:MemberAdapter,adapterGroup:GroupAdapter,name:string,page:number,size:number,isMember:boolean) => {
        dispatch(setSearch({...search,page:0,endPage:false}))
        zip(of(name),of(page!),of(size)).pipe(
            take(1),
            exhaustMap(async(item) => {
                if (isMember) {
                    await adapterMember.getSearchData({name:item[0],page:item[1],size:item[2]},(members) => {
                        if (members.length > 0) {
                            if (members.length < item[2])
                                dispatch(setSearch({...search,endPage:true}))
                            dispatch(setMembers(members))
                        }
                    },(error) => {
                        if (error)
                            dispatch(setMessage({message:error,error:true}))   
                    }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else {
                    await adapterGroup.getSearchData({name:item[0],page:item[1],size:item[2]},(groups) => {
                        if (groups.length > 0) {
                            if (groups.length < item[2])
                                dispatch(setSearch({...search,endPage:true}))
                            dispatch(setGroups(groups))
                        }
                    },(error) => {
                        if (error)
                            dispatch(setMessage({message:error,error:true}))   
                    }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }
            })
        ).subscribe()
    }
    const Background = React.memo<{background:string}>((data) => (
        <Box sx={{backgroundImage:`url('${Router.Public.THEME_IMAGE.set({name:data.background}).build()}')`,backgroundSize:"cover",width:"100vw",height:"100vh",position:"sticky",top:0,left:0}}/>
    ))
    return(     
        <Box sx={{backgroundColor:(profile)?profile.theme!.background_color:"white"}}>
            {(profile && profile.theme!.background_images)?
                <Background background={profile.theme!.background_images}/>:null
            }
            <HeaderView 
                adapterGroup={groupAdapter}
                adapterMember={memberAdapter} 
                onSearch={(isMember) => {onSearch(memberAdapter,groupAdapter,search.name,0,search.size,isMember);setIsMember(isMember)}}
                userSwitch={isMember}
                sx={{}}/>
            <Stack direction="row" sx={{display:(large)?"flex":"none"}}>
                <div style={{display:(search.name === "")?"block":"none"}}>
                    <ProfileGroupView
                        memberAdapter={memberAdapter}
                        onClickAddGroup={() => {setIsAddGroup(true)}}
                        onClickMyNote={() => {dispatch(setGroupProfile(undefined))}}
                        sx={{}}
                    />
                </div>
                <div style={{display:(search.name === "")?"none":"block"}}>
                    <UserViewSearch
                        adapterGroup={groupAdapter}
                        adapterMember={memberAdapter}
                        userSwitch={isMember}
                        onRefreshSearch={() => {dispatch(setSearch({...search,name:""}))}}
                        sx={{}}
                    />
                </div>
                {(groupProfile)?
                    <GroupNoteView
                        adapterGroup={groupAdapter}
                        adapterNote={noteAdapter}
                        adapterPublic={publicAdapter}
                        adapterSubtype={subtypeAdapter}
                        dateConverter={dateConverter}
                        noteArrayCollabConverter={noteArrayCollabConverter}
                        noteArrayPrivateConverter={noteArrayPrivateConverter}
                    />:<PrivateNoteView
                        adapterNote={noteAdapter}
                        adapterPublic={publicAdapter}
                        adapterSubtype={subtypeAdapter}
                        dateConverter={dateConverter}
                        noteArrayPrivateConverter={noteArrayPrivateConverter}
                    />
                }
            </Stack>
            <Box sx={{display:(large)?"none":"block"}}>
                <div style={{color:profile!.theme!.default_background}}>
                    <Tabs
                        value={tab}
                        onChange={(e,item) => {setTab(item)}}
                        variant="fullWidth"
                        textColor="inherit"
                        TabIndicatorProps={{sx:{backgroundColor:profile!.theme!.default_background}}}
                    >
                        <Tab value={0} icon={<GroupRounded/>} label={(large)?"Group":undefined}/>
                        <Tab value={1} icon={<NoteRounded/>} label={(large)?"Note":undefined}/>
                    </Tabs>
                </div>
                <TabPanel
                    value={tab}
                    targetValue={0}
                    sx={{}}
                >
                    <div style={{display:(search.name === "")?"block":"none"}}>
                        <ProfileGroupView
                            memberAdapter={memberAdapter}
                            onClickAddGroup={() => {setIsAddGroup(true)}}
                            onClickMyNote={() => {dispatch(setGroupProfile(undefined))}}
                            sx={{}}
                        />
                    </div>
                    <div style={{display:(search.name === "")?"none":"block"}}>
                        <UserViewSearch
                            adapterGroup={groupAdapter}
                            adapterMember={memberAdapter}
                            userSwitch={isMember}
                            onRefreshSearch={() => {dispatch(setSearch({...search,name:""}))}}
                            sx={{}}
                        />
                    </div>
                </TabPanel>
                <TabPanel
                    value={tab}
                    targetValue={1}
                    sx={{}}
                >
                    {(groupProfile)?
                        <GroupNoteView
                            adapterGroup={groupAdapter}
                            adapterNote={noteAdapter}
                            adapterPublic={publicAdapter}
                            adapterSubtype={subtypeAdapter}
                            dateConverter={dateConverter}
                            noteArrayCollabConverter={noteArrayCollabConverter}
                            noteArrayPrivateConverter={noteArrayPrivateConverter}
                        />:<PrivateNoteView
                            adapterNote={noteAdapter}
                            adapterPublic={publicAdapter}
                            adapterSubtype={subtypeAdapter}
                            dateConverter={dateConverter}
                            noteArrayPrivateConverter={noteArrayPrivateConverter}
                        />
                    }
                </TabPanel>
            </Box>
            <LoginView
                adapterMember={memberAdapter}
                adapterPublic={publicAdapter}
            />
            <SignInMemberView
                adapterMember={memberAdapter}
                adapterPublic={publicAdapter}
                fileConverter={fileConverter}
            />
            <SignInGroupView
                open={isAddGroup}
                adapterGroup={groupAdapter}
                fileConverter={fileConverter}
                onClose={() => {setIsAddGroup(false)}}
            />
            <NotificationViewForMember adapter={memberAdapter}/> 
            <NotificationViewForGroup adapter={groupAdapter}/>
            <ThemeView 
                adapterTheme={themeAdapter}
                dateConverter={dateConverter}
                fileConverter={fileConverter}
            />
            <MemberPreviewView
                adapterGroup={groupAdapter}
                adapterMember={memberAdapter}
                fileConverter={fileConverter}
            />
            <GroupPreviewView
                adapterGroup={groupAdapter}
                fileConverter={fileConverter}
            />
            <MessageView/>
        </Box>
    )
}