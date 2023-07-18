import { AppBar, Avatar, Badge, Box, IconButton, Menu, MenuItem, Stack, SxProps, Theme, Toolbar, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { Notifications, Palette, PersonSearchRounded } from "@mui/icons-material";
import { Router } from "../../model/data/router-server/router";
import { setGroupProfile, setGroupsProfiles, setLogin, setLogout, setOpenProfile, setProfile } from "../../configuration/redux/reducer/profile-reducer";
import { setOpenNotificationMember } from "../../configuration/redux/reducer/notification-reducer";
import { SearchField, SearchSuggestContainer, StateThemeUtils, ThemeButton } from "../container/global";
import React, { ChangeEventHandler, MouseEvent, useEffect, useRef, useState } from "react";
import { MemberAdapter } from "../../adapter/member-adapter";
import { GroupAdapter } from "../../adapter/group-adapter";
import { Subject, debounceTime, distinctUntilChanged, exhaustMap, fromEvent, map, of, switchMap, take, tap, zip } from "rxjs";
import { setMember, setMemberGuess, setMembers } from "../../configuration/redux/reducer/member-reducer";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import { setGroupGuess, setGroups } from "../../configuration/redux/reducer/group-reducer";
import { ReduxRoute } from "../../model/data/router-server/redux-item-route";
import { setNotePrivates, setSubtypes } from "../../configuration/redux/reducer/note-reducer";

interface HeaderViewInterface {
    adapterMember?: MemberAdapter
    adapterGroup?: GroupAdapter
    sx?: SxProps<Theme>
    onChangeSearch: (data:string) => void
    onSearch: (event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void
    userSwitch: boolean
    onUserSwitch: (data:boolean) => void
}
export default function HeaderView({adapterMember,adapterGroup,onChangeSearch,onSearch,onUserSwitch,userSwitch,sx}:HeaderViewInterface) {
    const small = useMediaQuery("(min-width:600px)")
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const notifCount1 = useAppSelector(state => state.notificationReducer.requestListGroup)
    const notifCount2 = useAppSelector(state => state.notificationReducer.requestRejectedGroup)
    const memberGuess = useAppSelector(state => state.memberReducer.memberGuess)
    const groupGuess = useAppSelector(state => state.groupReducer.groupGuess)
    const dispatch = useAppDispatch()
    const [loadingGuess,setLoadingGuess] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [openSearch, setOpenSearch] = useState(false)
    const [openMenuProfile,setOpenMenuProfile] = useState(false)
    const [search,setSearch] = useState("")
    const [searchEv] = useState(() => new Subject<{name:string,isMember:boolean}>())
    const menuRef = useRef<Array<HTMLButtonElement | HTMLDivElement | null>>([])
    const avatarSx = {
        padding: "5px"
    } as SxProps<Theme>
    const Image = React.memo<{idI?:string}>(({idI}) => {
        if (profile && idI) {
            if (profile.avatar) {
                return <Avatar alt={profile.username} src={Router.Public.MEMBER_AVATAR.set({name:profile.avatar}).build()} sx={avatarSx}/>
            } else
                return <Avatar sx={avatarSx}><Typography variant="h6">{profile.username.charAt(0)}</Typography></Avatar>
        } else return null
    })

    useEffect(() => {
        onChangeSearch(search)
        searchEv.next({name:search,isMember:userSwitch})
    },[search])

    useEffect(() => {
        if (adapterGroup && adapterMember)
            searchEv.pipe(
                debounceTime(400),
                distinctUntilChanged(),
                tap(() => {setLoadingGuess(true)}),
                switchMap(async(item) => {
                    if (item.isMember) {
                        await adapterMember.getSearch({name:item.name,page:0,size:5},(members) => {
                            dispatch(setMemberGuess(members))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    } else {
                        await adapterGroup!.getSearch({name:item.name,page:0,size:5},(groups) => {
                            dispatch(setGroupGuess(groups))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    }
                }),
                tap(() => {setLoadingGuess(false)})
            ).subscribe()
    },[])

    const onLogout = () => {
        of({}).pipe(
            exhaustMap(async() => {
                if (adapterMember) {
                    await adapterMember.logout(
                        (res) => {if(res) {
                            if (res.data) {
                                dispatch(setMessage({message:"Logout Successful",error:false}))
                                dispatch(setRoute(ReduxRoute.SIGNUP))
                                dispatch(setGroupsProfiles([]))
                                dispatch(setProfile(undefined))
                                dispatch(setGroupProfile(undefined))
                                dispatch(setNotePrivates([]))
                                dispatch(setSubtypes([]))
                            }
                            else dispatch(setMessage({message:"Cannot Logout",error:true}))
                        }},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }
            }),
            tap(() => {dispatch(setLogout());dispatch(setLogin(false))})
        ).subscribe()
    }

    const suggestion = (
        <SearchSuggestContainer
            key={"header-suggestion"}
            open={memberGuess.length > 0 || groupGuess.length > 0}
            data={(userSwitch)?memberGuess:groupGuess}
            loading={loadingGuess}
            refTarget={(menuRef.current[2])?menuRef.current[2]:undefined}
            sx={{zIndex: (theme) => theme.zIndex.drawer + 7}}
            sxPaper={{width:`${(menuRef.current[2]?.offsetWidth)?menuRef.current[2]?.offsetWidth:0}px`,backgroundColor:themeProfile.background_color,color:themeProfile.foreground_color,maxHeight:"50vh",overflowY:"auto"}}
            colorLoading={themeProfile.foreground_color}
            onClose={() => {if(memberGuess.length > 0) dispatch(setMemberGuess([])); else dispatch(setGroupGuess([]))}}
            onClick={(data) => {onChangeSearch(data.name);setSearch(data.name)}}
        />
    )

    return(
        <AppBar position="static" sx={{backgroundColor: themeProfile.foreground_color,color: themeProfile.background_color,...sx}}>
            <Toolbar>
                <Typography variant="h5" sx={{fontWeight:700}}>MyNote X</Typography>
                <Stack sx={{ marginLeft:"auto" }} direction="row" spacing={1}>
                    <Tooltip title={"user search"}>
                        <IconButton
                            ref={(ref) => {menuRef.current[0] = ref}}
                            onClick={() => {setOpenSearch(!openSearch)}}
                            sx={{color:"inherit"}}
                        >
                            <PersonSearchRounded/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="menu-item-container-search-main"
                        anchorEl={menuRef.current[0]}
                        open={openMenu}
                        sx={{zIndex:(theme) => theme.zIndex.drawer + 6}}
                        onClose={() => {setOpenMenu(false)}}
                    >
                        <Box sx={{margin: "0 10px"}}>
                            <SearchField
                                ids={"header-search-user"}
                                key={"header-search-user"}
                                refTarget={(refer) => {menuRef.current[2] = refer}}
                                value={search}
                                theme={themeProfile}
                                onChange={(ev) => {setSearch(ev.target.value)}}
                                onSearch={() => {dispatch(setGroups([]));dispatch(setMembers([]));onSearch();setOpenMenu(false)}}
                                placeholder={(userSwitch)?"Search member name":"Search group name"}
                                isDropDownButton={false}
                            />
                            {suggestion}
                        </Box>
                    </Menu>
                    <Menu
                        id="menu-item-container-search"
                        anchorEl={menuRef.current[0]}
                        open={openSearch}
                        onClose={() => {setOpenSearch(!openSearch)}}
                    >
                        <MenuItem onClick={() => {onUserSwitch(true);setOpenMenu(!openMenu);setOpenSearch(!openSearch)}}>to Member</MenuItem>
                        <MenuItem onClick={() => {onUserSwitch(false);setOpenMenu(!openMenu);setOpenSearch(!openSearch)}}>to Group</MenuItem>
                    </Menu>
                    {(small)?
                        <Tooltip title={"themes"}>
                            <IconButton
                                onClick={() => {dispatch(setRoute(ReduxRoute.THEME))}}
                                sx={{color:"inherit"}}
                            >
                                <Palette/>
                            </IconButton>
                        </Tooltip>:null
                    }
                    <Tooltip title={"notification"}>
                        <IconButton
                            onClick={() => {dispatch(setOpenNotificationMember(true))}}
                            sx={{color:"inherit"}}
                        >
                            <Badge badgeContent={notifCount1.length+notifCount2.length}>
                                <Notifications/>
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    {(profile && profile.id)?
                        <Tooltip title={"profile"}>
                            <IconButton
                                ref={ref => menuRef.current[1] = ref}
                                onClick={() => {setOpenMenuProfile(!openMenuProfile)}}
                                sx={{color:"inherit"}}
                            >
                                <Image idI={profile.id}/>
                            </IconButton>
                        </Tooltip>:
                        <ThemeButton 
                            themeObj={themeProfile} 
                            state={StateThemeUtils.DEFAULT}
                            variant="outlined" 
                            onClick={() => {dispatch(setRoute(ReduxRoute.SIGNUP))}}
                            sx={{textTransform:"none"}}>Sign in</ThemeButton>
                    }
                </Stack>
                <Menu
                    id="menu-item-container-profile"
                    anchorEl={menuRef.current[1]}
                    open={openMenuProfile}
                    onClose={() => {setOpenMenuProfile(!openMenuProfile)}}
                >
                    <MenuItem onClick={() => {setOpenMenuProfile(!openMenuProfile);dispatch(setOpenProfile(true));dispatch(setMember({...profile!,avatar:undefined}))}}>Profile</MenuItem>
                    {(!small)?
                        <MenuItem onClick={() => {setOpenMenuProfile(!openMenuProfile);dispatch(setRoute(ReduxRoute.THEME))}}>Themes</MenuItem>:null
                    }
                    <MenuItem onClick={() => {setOpenMenuProfile(!openMenuProfile);onLogout()}}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}