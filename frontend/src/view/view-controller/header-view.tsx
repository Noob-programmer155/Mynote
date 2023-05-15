import { AppBar, Avatar, Badge, Box, IconButton, Menu, MenuItem, Stack, SxProps, Theme, Toolbar, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { Notifications, PersonSearchRounded } from "@mui/icons-material";
import { Router } from "../../model/data/router-server/router";
import { logout, setOpenProfile } from "../../configuration/redux/reducer/profile-reducer";
import { setOpenNotificationMember } from "../../configuration/redux/reducer/notification-reducer";
import { SearchField, SearchSuggestContainer, StateThemeUtils, ThemeButton } from "../container/global";
import React, { MouseEvent, useRef, useState } from "react";
import { setSearch } from "../../configuration/redux/reducer/search-reducer";
import { MemberAdapter } from "../../adapter/member-adapter";
import { GroupAdapter } from "../../adapter/group-adapter";
import { exhaustMap, of, take, tap, zip } from "rxjs";
import { setMemberGuess } from "../../configuration/redux/reducer/member-reducer";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import { setGroupGuess } from "../../configuration/redux/reducer/group-reducer";
import { ReduxRoute } from "../../configuration/redux/redux-item-route";
import { Member } from "../../model/model";

interface HeaderViewInterface {
    adapterMember?: MemberAdapter
    adapterGroup?: GroupAdapter
    sx?: SxProps<Theme>
    onSearch: ((isMember:boolean,event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    userSwitch: boolean
}
export default function HeaderView({adapterMember,adapterGroup,onSearch,userSwitch,sx}:HeaderViewInterface) {
    const profile = useAppSelector(state => state.profileReducer.profile)
    const notifCount1 = useAppSelector(state => state.notificationReducer.requestListGroup)
    const notifCount2 = useAppSelector(state => state.notificationReducer.requestRejectedGroup)
    const search = useAppSelector(state => state.searchAndFilterReducer.search)
    const memberGuess = useAppSelector(state => state.memberReducer.memberGuess)
    const groupGuess = useAppSelector(state => state.groupReducer.groupGuess)
    const dispatch = useAppDispatch()
    const [loadingGuess,setLoadingGuess] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [openSearch, setOpenSearch] = useState(false)
    const [openMenuProfile,setOpenMenuProfile] = useState(false)
    const menuRef = useRef<Array<HTMLButtonElement | HTMLDivElement | null>>([])
    const avatarSx = {
        padding: "5px"
    } as SxProps<Theme>
    const Image = React.memo<{profile:Member}>(({profile}) => {
        if (profile && profile.id) {
            if (profile.avatar) {
                return <Avatar alt={profile.username} src={Router.Public.MEMBER_AVATAR.set({name:profile.avatar}).build()} sx={avatarSx}/>
            } else
                return <Avatar sx={avatarSx}><Typography variant="h6">{profile.username.charAt(0)}</Typography></Avatar>
        } else return null
    })
    
    const onSearchGuess = (adapterMember:MemberAdapter,adapterGroup:GroupAdapter,name:string,page:number,size:number,isMember:boolean) => {
        dispatch(setSearch({...search,name:name}))
        zip(of(name),of(page!),of(size)).pipe(
            take(1),
            tap(() => {setLoadingGuess(true)}),
            exhaustMap(async(item) => {
                if (isMember) {
                    await adapterMember.getSearch({name:item[0],page:item[1],size:item[2]},(members) => {
                        if (members.length > 0) {
                            dispatch(setMemberGuess(members))
                        }
                    },(error) => {
                        if (error)
                            dispatch(setMessage({message:error,error:true}))   
                    }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else {
                    await adapterGroup.getSearch({name:item[0],page:item[1],size:item[2]},(groups) => {
                        if (groups.length > 0) {
                            dispatch(setGroupGuess(groups))
                        }
                    },(error) => {
                        if (error)
                            dispatch(setMessage({message:error,error:true}))   
                    }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }
            }),
            tap(() => {setLoadingGuess(false)})
        ).subscribe()
    }

    const onLogout = () => {
        of({}).pipe(
            exhaustMap(async() => {
                if (adapterMember) {
                    await adapterMember.logout(
                        (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Logout Successful",error:false}));else dispatch(setMessage({message:"Cannot Logout",error:true}))}},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }
            }),
            tap(() => {dispatch(logout())})
        ).subscribe()
    }

    return(
        <AppBar position="static" sx={{backgroundColor: profile!.theme!.foreground_color,...sx}}>
            <Toolbar>
                <Typography variant="h5" sx={{fontWeight:700}}>MyNote X</Typography>
                <Stack sx={{ marginLeft:"auto" }} direction="row" spacing={1}>
                    <IconButton
                        ref={(ref) => {menuRef.current[0] = ref}}
                        onClick={() => {setOpenSearch(!openSearch)}}
                        sx={{color:"inherit"}}
                    >
                        <PersonSearchRounded/>
                    </IconButton>
                    <Menu
                        id="menu-item-container-search-main"
                        anchorEl={menuRef.current[0]}
                        open={openSearch}
                        onClose={() => {setOpenSearch(!openSearch)}}
                    >
                        <Box sx={{margin: "0 10px"}}>
                            <SearchField
                                refTarget={(refer) => {menuRef.current[3] = refer}}
                                theme={profile!.theme!}
                                value={search.name}
                                onSearch={() => {setOpenMenu(!openMenu)}}
                                onChange={(event) => {onSearchGuess(adapterMember!,adapterGroup!,event.currentTarget.value,0,5,userSwitch)}}
                                placeholder={(userSwitch)?"Search member name":"Search group name"}
                                buttonPropsDropDown={{ref:(ref) => {menuRef.current[1] = ref}}}
                                isDropDownButton={true}
                            />
                            <SearchSuggestContainer
                                open={memberGuess.length > 0 || groupGuess.length > 0}
                                data={(memberGuess.length > 0)?memberGuess:groupGuess}
                                loading={loadingGuess}
                                refTarget={menuRef.current[3]}
                                sx={{zIndex: (theme) => theme.zIndex.drawer + 7}}
                                sxPaper={{width:`${(menuRef.current[3]?.offsetWidth)?menuRef.current[3]?.offsetWidth:0}px`,backgroundColor:(profile)?profile.theme!.background_color:"white",maxHeight:"50vh",overflowY:"auto"}}
                                colorLoading={(profile)?profile.theme!.foreground_color:"blueviolet"}
                                onClose={() => {if(memberGuess.length > 0) dispatch(setMemberGuess([])); else dispatch(setGroupGuess([]))}}
                                onClick={(data) => {dispatch(setSearch({...search,name:data.name}))}}
                            />
                        </Box>
                    </Menu>
                    <Menu
                        id="menu-item-container-search"
                        anchorEl={menuRef.current[1]}
                        open={openMenu}
                        onClose={() => {setOpenMenu(!openMenu)}}
                    >
                        <MenuItem onClick={() => {onSearch(true);setOpenMenu(!openMenu);setOpenSearch(!openSearch)}}>to Member</MenuItem>
                        <MenuItem onClick={() => {onSearch(false);setOpenMenu(!openMenu);setOpenSearch(!openSearch)}}>to Group</MenuItem>
                    </Menu>
                    <IconButton
                        onClick={() => {dispatch(setOpenNotificationMember(true))}}
                        sx={{color:"inherit"}}
                    >
                        <Badge badgeContent={notifCount1.length+notifCount2.length}>
                            <Notifications/>
                        </Badge>
                    </IconButton>
                    {(profile && profile.id)? 
                        <IconButton
                            ref={ref => menuRef.current[2] = ref}
                            onClick={() => {}}
                            sx={{color:"inherit"}}
                        >
                            <Image profile={profile}/>
                        </IconButton>:
                        <ThemeButton 
                            themeObj={profile!.theme!} 
                            state={StateThemeUtils.DEFAULT}
                            variant="outlined" 
                            onClick={() => {dispatch(setRoute(ReduxRoute.SIGNUP))}}
                            sx={{textTransform:"none"}}>Sign in</ThemeButton>
                    }
                </Stack>
                <Menu
                    id="menu-item-container-profile"
                    anchorEl={menuRef.current[2]}
                    open={openMenuProfile}
                    onClose={() => {setOpenMenuProfile(!openMenuProfile)}}
                >
                    <MenuItem onClick={() => {setOpenMenuProfile(!openMenuProfile);dispatch(setOpenProfile(true))}}>Profile</MenuItem>
                    <MenuItem onClick={() => {setOpenMenuProfile(!openMenuProfile);onLogout()}}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}