import React, { useEffect, useMemo, useRef, useState } from "react";
import HeaderView from "./view-controller/header-view";
import { NotificationViewForGroup, NotificationViewForMember } from "./view-controller/notification-view";
import { GroupAdapter } from "../adapter/group-adapter";
import { MemberAdapter } from "../adapter/member-adapter";
import { MainAdapter } from "../adapter/adapter";
import { Box, Stack, Tab, Tabs, useMediaQuery } from "@mui/material";
import { GroupPreviewView, MemberPreviewView, ProfileGroupView, UserViewSearch } from "./view-controller/user-view";
import { useAppDispatch, useAppSelector } from "../configuration/redux/hooks";
import { setSearch } from "../configuration/redux/reducer/search-reducer";
import { exhaustMap, of, take, tap, zip } from "rxjs";
import { setMembers } from "../configuration/redux/reducer/member-reducer";
import { setMessage } from "../configuration/redux/reducer/message-response-reducer";
import { setRoute } from "../configuration/redux/reducer/route-reducer";
import { setGroups } from "../configuration/redux/reducer/group-reducer";
import { ReduxRoute } from "../model/data/router-server/redux-item-route";
import { Router } from "../model/data/router-server/router";
import { LoginView } from "./view-controller/login-view";
import { SignInGroupView, SignInMemberView } from "./view-controller/signin-view";
import { GroupNoteView, PrivateNoteView } from "./view-controller/note-view";
import { TabPanel } from "./container/global";
import { ThemeView } from "./view-controller/theme-view";
import { setGroupProfile } from "../configuration/redux/reducer/profile-reducer";
import { DateConverter, FileConverter, NoteCollabArrayConverter, NotePrivateArrayConverter } from "../adapter/converter/attribute";
import { EventNoteRounded, GroupRounded } from "@mui/icons-material";
import { MessageView } from "./view-controller/message-view";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function View() {
    const large = useMediaQuery("(min-width:1000px)")
    const main = new MainAdapter()
    const groupAdapter = main.groupAdapter
    const memberAdapter = main.memberAdapter
    const subtypeAdapter = main.subtypeAdapter
    const themeAdapter = main.themeAdapter
    const noteAdapter = main.noteAdapter
    const publicAdapter = main.publicAdapter
    const dateConverter = new DateConverter()
    const noteArrayCollabConverter = new NoteCollabArrayConverter()
    const noteArrayPrivateConverter = new NotePrivateArrayConverter()
    const fileConverter = new FileConverter()
    const [tab,setTab] = useState(0)
    const [isMember,setIsMember] = useState(false)
    const [isAddGroup,setIsAddGroup] = useState(false)
    const [isEmptySearch,setIsEmptySearch] = useState(true)
    const [searchName,setSearchName] = useState("")
    const search = useAppSelector(state => state.searchAndFilterReducer.search)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const groupProfile = useAppSelector(state => state.profileReducer.group)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (profile && !profile.id) {
            dispatch(setRoute(ReduxRoute.SIGNUP))
        }
    },[])

    const onSearch = (adapterMember:MemberAdapter,adapterGroup:GroupAdapter,name:string,page:number,size:number,isMember:boolean) => {
        zip(of(name),of(page!),of(size)).pipe(
            tap(() => {dispatch(setSearch({...search,page:0,endPage:false}))}),
            take(1),
            exhaustMap(async(item) => {
                if (isMember) {
                    await adapterMember.getSearchData({name:item[0],page:item[1],size:item[2]},(members) => {
                        if (members.length < item[2])
                            dispatch(setSearch({...search,endPage:true}))
                        dispatch(setMembers(members))
                        setIsEmptySearch(false)
                    },(error) => {
                        if (error)
                            dispatch(setMessage({message:error,error:true}))   
                    }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else {
                    await adapterGroup.getSearchData({name:item[0],page:item[1],size:item[2]},(groups) => {
                        if (groups.length < item[2])
                            dispatch(setSearch({...search,endPage:true}))
                        dispatch(setGroups(groups))
                        setIsEmptySearch(false)
                    },(error) => {
                        if (error)
                            dispatch(setMessage({message:error,error:true}))   
                    }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }
            })
        ).subscribe()
    }
    const background = useMemo(() => 
        themeProfile.background_images,
    [themeProfile.background_images])
    return(
        <Box sx={{backgroundColor:themeProfile.background_color,
            backgroundImage:(background)?`url('${Router.Public.THEME_IMAGE.set({name:background}).build()}')`:'none',
            backgroundSize:"cover",backgroundAttachment:"scroll",maxWidth:"100vw",width:"100vw",height:"100vh",maxHeight:"100vh",overflow:"auto"}}>
            <div style={{width:"100%",height:"95%"}}>
                <HeaderView 
                    adapterGroup={groupAdapter}
                    adapterMember={memberAdapter}
                    onChangeSearch={text => {setSearchName(text)}}
                    onSearch={() => {onSearch(memberAdapter,groupAdapter,searchName,0,search.size,isMember)}}
                    userSwitch={isMember}
                    onUserSwitch={(isMember) => {setIsMember(isMember)}}
                    sx={{}}/>
                {(large)?
                    <Grid2 container direction="row" sx={{margin:"10px",height:"100%",maxWidth:"100%",backgroundColor:themeProfile.background_color? themeProfile.background_color.substring(0,7)+'55':"none"}}>
                        <Grid2 xs={3} lg={2}>
                            <div style={{display:(isEmptySearch)?"block":"none"}}>
                                <ProfileGroupView
                                    memberAdapter={memberAdapter}
                                    onClickAddGroup={() => {setIsAddGroup(true)}}
                                    onClickMyNote={() => {dispatch(setGroupProfile(undefined))}}
                                    sx={{padding:"10px"}}
                                />
                            </div>
                            <div style={{display:(isEmptySearch)?"none":"block"}}>
                                <UserViewSearch
                                    adapterGroup={groupAdapter}
                                    adapterMember={memberAdapter}
                                    userSwitch={isMember}
                                    searchObj={searchName}
                                    onRefreshSearch={() => {setSearchName("");setIsEmptySearch(true);dispatch(setGroups([]));dispatch(setMembers([]))}}
                                    sx={{padding:"10px"}}
                                />
                            </div>
                        </Grid2>
                        <Grid2 xs={9} lg={10}>
                            {(groupProfile)?
                                <GroupNoteView
                                    adapterGroup={groupAdapter}
                                    adapterNote={noteAdapter}
                                    adapterPublic={publicAdapter}
                                    adapterSubtype={subtypeAdapter}
                                    dateConverter={dateConverter}
                                    noteArrayCollabConverter={noteArrayCollabConverter}
                                    noteArrayPrivateConverter={noteArrayPrivateConverter}
                                    sx={{backgroundColor:themeProfile.background_color? themeProfile.background_color.substring(0,7)+'35':"none"}}
                                />:<PrivateNoteView
                                    adapterNote={noteAdapter}
                                    adapterPublic={publicAdapter}
                                    adapterSubtype={subtypeAdapter}
                                    dateConverter={dateConverter}
                                    noteArrayPrivateConverter={noteArrayPrivateConverter}
                                    sx={{backgroundColor:themeProfile.background_color? themeProfile.background_color.substring(0,7)+'35':"none"}}
                                />
                            }
                        </Grid2>
                    </Grid2>:<Box sx={{backgroundColor:themeProfile.background_color? themeProfile.background_color.substring(0,7)+'55':"none",height:"100%"}}>
                        <div style={{color:themeProfile.default_background}}>
                            <Tabs
                                value={tab}
                                onChange={(e,item) => {setTab(item)}}
                                variant="fullWidth"
                                textColor="inherit"
                                TabIndicatorProps={{sx:{backgroundColor:themeProfile.default_background}}}
                            >
                                <Tab value={0} icon={<GroupRounded/>} label={(large)?"Group":undefined}/>
                                <Tab value={1} icon={<EventNoteRounded/>} label={(large)?"Note":undefined}/>
                            </Tabs>
                        </div>
                        <TabPanel
                            value={tab}
                            targetValue={0}
                            sx={{width:"100%",height:"100%"}}
                        >
                            <div style={{display:(isEmptySearch)?"block":"none"}}>
                                <ProfileGroupView
                                    memberAdapter={memberAdapter}
                                    onClickAddGroup={() => {setIsAddGroup(true)}}
                                    onClickMyNote={() => {dispatch(setGroupProfile(undefined))}}
                                    sx={{padding:"10px 0 10px 0",height:"100%"}}
                                />
                            </div>
                            <div style={{display:(isEmptySearch)?"none":"block"}}>
                                <UserViewSearch
                                    adapterGroup={groupAdapter}
                                    adapterMember={memberAdapter}
                                    searchObj={searchName}
                                    userSwitch={isMember}
                                    onRefreshSearch={() => {setSearchName("");setIsEmptySearch(true);dispatch(setGroups([]));dispatch(setMembers([]))}}
                                    sx={{padding:"10px 0 10px 0",height:"100%"}}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel
                            value={tab}
                            targetValue={1}
                            sx={{width:"100%",height:"100%"}}
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
                                    sx={{backgroundColor:themeProfile.background_color? themeProfile.background_color.substring(0,7)+'35':"none"}}
                                />:<PrivateNoteView
                                    adapterNote={noteAdapter}
                                    adapterPublic={publicAdapter}
                                    adapterSubtype={subtypeAdapter}
                                    dateConverter={dateConverter}
                                    noteArrayPrivateConverter={noteArrayPrivateConverter}
                                    sx={{backgroundColor:themeProfile.background_color? themeProfile.background_color.substring(0,7)+'35':"none"}}
                                />
                            }
                        </TabPanel>
                    </Box>
                }
            </div>
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
            <NotificationViewForGroup adapter={groupAdapter} adapterMember={memberAdapter}/>
            <ThemeView 
                adapterTheme={themeAdapter}
                dateConverter={dateConverter}
                fileConverter={fileConverter}
            />
            <MemberPreviewView
                adapterPublic={publicAdapter}
                adapterGroup={groupAdapter}
                adapterMember={memberAdapter}
                fileConverter={fileConverter}
            />
            <GroupPreviewView
                adapterGroup={groupAdapter}
                adapterMember={memberAdapter}
                fileConverter={fileConverter}
            />
            <MessageView/>
        </Box>
    )
}