import { Backdrop, Box, BoxProps, CircularProgress, IconButton, Modal, Stack, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { MouseEvent, UIEvent, useEffect, useState } from "react";
import { UserItemList } from "../container/user-list";
import { Router } from "../../model/data/router-server/router";
import { setMemberPreview, setOpenProfile as memberOpenProfile, setMembers, setMember } from "../../configuration/redux/reducer/member-reducer";
import { setGroupPreview, setOpenProfile as groupOpenProfile, setGroups, setGroup} from "../../configuration/redux/reducer/group-reducer";
import { MemberAdapter } from "../../adapter/member-adapter";
import { GroupAdapter } from "../../adapter/group-adapter";
import { EMPTY, Subscription, every, exhaustMap, iif, interval, of, startWith, switchMap, tap, zip } from "rxjs";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import { setSearch } from "../../configuration/redux/reducer/search-reducer";
import { SearchField, StateThemeUtils, ThemeButton, ThemeFab } from "../container/global";
import { Add, NoteAlt } from "@mui/icons-material";
import { Group, Member } from "../../model/model";
import { MemberPreview, GroupPreview } from "../container/user-container";
import { setGroupProfile, setGroupsProfiles, setOpenProfile } from "../../configuration/redux/reducer/profile-reducer";
import { ReduxRoute } from "../../configuration/redux/redux-item-route";
import { FileConverter } from "../../adapter/converter/attribute";
import { Role } from "../../model/model-side";

type Search = {
    adapterMember: MemberAdapter
    adapterGroup: GroupAdapter
    name: string
    page?: number
    size: number
    isMember: boolean
}

interface UserViewSearchInterface {
    adapterMember?: MemberAdapter
    adapterGroup?: GroupAdapter
    sx?: SxProps<Theme>
    onRefreshSearch: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    userSwitch: boolean
}
export function UserViewSearch({adapterGroup,adapterMember,onRefreshSearch,userSwitch,sx}:UserViewSearchInterface) {
    const [loading,setLoading] = useState(false)
    const theme = useAppSelector(state => state.profileReducer.profile?.theme)
    const groups = useAppSelector(state => state.groupReducer.groups)
    const members = useAppSelector(state => state.memberReducer.members)
    const search = useAppSelector(state => state.searchAndFilterReducer.search)
    const dispatch = useAppDispatch()

    // load data, if member not empty then displayed, otherwise group will display
    const checkMember = () => {
        if (members.length > 0) {
            return members.map((item,i) => 
                <UserItemList
                    id={item.username+i}
                    image={(item.avatar)?Router.Public.MEMBER_AVATAR.set({name:item.avatar}).build():""}
                    username={item.username}
                    onClick={() => {
                        dispatch(setMemberPreview(item))
                        dispatch(setMember(item))
                        dispatch(memberOpenProfile(true))
                    }}
                    theme={theme!}
                />)
        } else {
            if (groups.length > 0) {
                return groups.map((item,i) => 
                    <UserItemList
                        id={item.username+i}
                        image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                        username={item.username}
                        onClick={() => {
                            dispatch(setGroupPreview(item))
                            dispatch(setGroup(item))
                            dispatch(groupOpenProfile(true))
                        }}
                        theme={theme!}
                    />)
            } else return <Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
        }
    }

    const onScroll = (event:UIEvent<HTMLDivElement, globalThis.UIEvent>,{adapterGroup,adapterMember,name,size,isMember}:Search) => {
        if(event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight && !loading) {
            iif(() => !search.endPage,zip(of(name),of(search.page+1),of(size)).pipe(
                tap((item) => {dispatch(setSearch({...search,page:item[1]}));setLoading(true);return item}),
                exhaustMap(async(item) => {
                    if (isMember) {
                        await adapterMember.getSearchData({name:item[0],page:item[1],size:item[2]},(membersNew) => {
                            if (membersNew.length > 0) {
                                if (membersNew.length < item[2]) {
                                    dispatch(setSearch({...search,endPage:true}))
                                }
                                dispatch(setMembers([...members,...membersNew]))
                            } else dispatch(setSearch({...search,page:item[1]-1,endPage:true}))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    } else {
                        await adapterGroup.getSearchData({name:item[0],page:item[1],size:item[2]},(groupsNew) => {
                            if (groupsNew.length > 0) {
                                if (groupsNew.length < item[2]) {
                                    dispatch(setSearch({...search,endPage:true}))
                                }
                                dispatch(setGroups([...groups,...groupsNew]))
                            } else dispatch(setSearch({...search,page:item[1]-1,endPage:true}))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    }
                }),
                tap(() => {setLoading(false)})
            ),EMPTY).subscribe()
        }
    }

    return(
        <Box sx={{backgroundColor:theme!.background_color? theme!.background_color.substring(0,theme!.background_color.length-2)+'20' : "rgba(255,255,255,.35)",color:theme!.foreground_color,
            ...sx}}>
                <ThemeButton
                    variant="contained"
                    themeObj={theme!}
                    onClick={onRefreshSearch}
                    state={StateThemeUtils.DEFAULT}
                    sx={{width:"100%",fontWeight:700,fontSize:".8rem",display:{xs: "none", sm: "block",textTransform:"none"}}}
                >
                    Exit Search
                </ThemeButton>
            <Stack onScroll={(event) => {onScroll(event,{adapterMember:adapterMember!,adapterGroup:adapterGroup!,name:search.name,page:search.page,size:search.size,isMember:userSwitch})}} 
                sx={{justifyContent:"center",maxHeight:"100%",overflowY:"auto"}}>
                {checkMember()}
                {(loading)?
                    <Box sx={{color:theme!.default_background}}>
                        <CircularProgress color="inherit"/>
                    </Box>:null
                }
            </Stack>
        </Box>
    )
}

interface ProfileGroupViewInterface {
    memberAdapter?: MemberAdapter
    onClickMyNote: () => void
    onClickAddGroup: () => void
    sx?: SxProps<Theme>
}
export function ProfileGroupView({memberAdapter,onClickMyNote,onClickAddGroup,sx}:ProfileGroupViewInterface) {
    const [load,setLoad] = useState(1)
    const [search, setSearch] = useState("")
    const groups = useAppSelector(state => state.profileReducer.groups)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const size = useAppSelector(state => state.searchAndFilterReducer.search.size)
    const dispatch = useAppDispatch()
    const streamObj = interval(15000).pipe(
        startWith(0),
        exhaustMap((i) => {
            if (memberAdapter && profile) {
                memberAdapter.getAllMemberGroup({member:profile.id!},
                    (groups) => {if (groups.length > 0) dispatch(setGroupsProfiles(groups))},
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }
            return of({})
        }))
    
    useEffect(() => {
        if(!profile || profile && !profile.id) return;
        setLoad(1)
        let subs = streamObj.subscribe()
        return () => subs.unsubscribe()
    },[profile])

    // load data, if member not empty then displayed, otherwise group will display
    const checkMember = () => {
        if (groups.length > 0) {
            return groups.filter(item => item.username.match(new RegExp(`.*${search}`,'g'))).slice(0,size*load).map((item,i) => 
                <UserItemList
                    id={item.username+i}
                    image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                    username={item.username}
                    onClick={() => {
                        dispatch(setGroupProfile(item))
                    }}
                    theme={profile!.theme!}
                />)
        } else return <Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
    }

    const onScroll = (event:UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
        if(event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight) {
            if (groups.length > 0) 
                if (load < 10)
                    setLoad(load+1)
        }
    }

    return(
        <Box sx={{backgroundColor:profile!.theme!.background_color? profile!.theme!.background_color.substring(0,profile!.theme!.background_color.length-2)+'20' : "rgba(255,255,255,.35)",color:profile!.theme!.foreground_color,
            ...sx}}>
            <Stack direction="row" spacing={1}>
                <SearchField
                    theme={profile!.theme!}
                    onSearch={() => {}} // using dynamic search, so on search not used
                    onChange={(event) => {setLoad(1);setSearch(event.currentTarget.value)}}
                    placeholder="Search my group"
                    isDropDownButton={false}
                />
                <Tooltip title="Add New Group">
                    <IconButton sx={{color: "inherit"}} onClick={onClickAddGroup}>
                        <Add color="inherit"/>
                    </IconButton>
                </Tooltip>
            </Stack>
            <ThemeButton
                variant="contained"
                themeObj={profile!.theme!}
                onClick={onClickMyNote}
                state={StateThemeUtils.DEFAULT}
                sx={{width:"100%",fontWeight:700,fontSize:"1.5rem",display:{xs: "none", sm: "block"},textTransform:"none"}}
            >
                My Note
            </ThemeButton>
            <Stack onScroll={onScroll} sx={{maxHeight:"100%",overflowY:"auto"}}>
                {checkMember()}
            </Stack>
            <ThemeFab
                themeObj={profile!.theme!}
                state={StateThemeUtils.DEFAULT}
                onClick={onClickMyNote}
                sx={{position:"absolute",bottom:"2rem",right:"15px",display:{xs: "block", sm: "none"}}}
            >
                <NoteAlt/>
            </ThemeFab>
        </Box>
    )
}

// for note
interface ProfileGroupMemberViewInterface {
    members: Member[]
    sx?: SxProps<Theme>
    boxProps?: BoxProps
}
export function ProfileGroupMemberView({members,sx,boxProps}:ProfileGroupMemberViewInterface) {
    const [load,setLoad] = useState(1)
    const [search, setSearch] = useState("")
    const profile = useAppSelector(state => state.profileReducer.profile)
    const dispatch = useAppDispatch()

    // load data, if member not empty then displayed, otherwise group will display
    const checkMember = () => {
        if (members.length > 0) {
            return members.filter(item => item.username.match(new RegExp(`.*${search}`,'g'))).slice(0,25*load).map((item,i) => 
                <UserItemList
                    id={item.username+i}
                    image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                    username={item.username}
                    onClick={() => {
                        dispatch(setMemberPreview(item))
                        dispatch(setMember(item))
                        dispatch(memberOpenProfile(true))
                    }}
                    theme={profile!.theme!}
                />)
        } else return <Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
    }

    const onScroll = (event:UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
        if(event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight) {
            if (load < 10) {
                setLoad(load+1)
            }
        }
    }

    return(
        <Box sx={{backgroundColor:profile!.theme!.background_color? profile!.theme!.background_color.substring(0,profile!.theme!.background_color.length-2)+'25' : "rgba(255,255,255,.35)",color:profile!.theme!.foreground_color,
            ...sx}} {...boxProps}>
            <Stack direction="row" spacing={1}>
                <SearchField
                    theme={profile!.theme!}
                    onSearch={() => {}} // using dynamic search, so on search not used
                    onChange={(event) => {setLoad(1);setSearch(event.currentTarget.value)}}
                    placeholder="Search my group"
                    isDropDownButton={false}
                />
            </Stack>
            <Stack onScroll={onScroll} sx={{maxHeight:"100%",overflowY:"auto"}}>
                {checkMember()}
            </Stack>
        </Box>
    )
}

interface UserPreviewViewInterface {
    adapterMember?: MemberAdapter
    adapterGroup: GroupAdapter
    fileConverter: FileConverter
}
export function MemberPreviewView({adapterMember,adapterGroup,fileConverter}:UserPreviewViewInterface) {
    const [groups,setGroups] = useState<Array<Group>>([])
    const [disable,setDisable] = useState(false)
    const [avatar,setAvatar] = useState<Blob>()
    const [oldPassword,setOldPassword] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [openMenuViewOther,setOpenMenuViewOther] = useState(false)
    const member = useAppSelector(state => state.memberReducer.memberPreview)
    const memberUpdate = useAppSelector(state => state.memberReducer.member)
    const open = useAppSelector(state => state.memberReducer.openProfile)
    const isProfile = useAppSelector(state => state.profileReducer.openProfile)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const group = useAppSelector(state => state.profileReducer.group)
    const dispatch = useAppDispatch()
    useEffect(() => {
        of({}).pipe(
            switchMap(async() => {
                if(member)
                    await adapterMember!.getAllMemberGroup({member:member.id!},
                        (groups) => {setGroups(groups)},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    },[member,profile])
    
    const onUpdate = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(memberUpdate)
                    if (avatar)
                        await adapterMember!.modify({data:{username:memberUpdate.username},image:avatar},
                            (res) => {if(res) {dispatch(setMessage({message:res.data,error:false}));dispatch(memberOpenProfile(!open));dispatch(setMemberPreview(undefined))}},
                            (error) => {dispatch(setMessage({message:error,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    else
                        await adapterMember!.modify({data:{username:memberUpdate.username}},
                            (res) => {if(res) {dispatch(setMessage({message:res.data,error:false}));dispatch(memberOpenProfile(!open));dispatch(setMemberPreview(undefined))}},
                            (error) => {dispatch(setMessage({message:error,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onPasswordUpdate = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(memberUpdate)
                    await adapterMember!.modifyPassword({oldPassword:oldPassword,newPassword:newPassword},
                        (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Password Changed",error:false}));else dispatch(setMessage({message:"Cannot Change Password",error:true}))}},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onSendRequest = (data:{group:string}) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                await adapterMember!.sendRequestGroup({group:data.group},
                    (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Send Request Successful",error:false}));else dispatch(setMessage({message:"Cannot Send Request",error:true}))}},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onPromoted = (data:{group:string,member:string}) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                await adapterGroup.promoteMember({member:data.member,group:data.group},
                    (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Member Promoted",error:false}));else dispatch(setMessage({message:"Cannot Promote Member",error:true}))}},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onDemoted = (data:{group:string,member:string}) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                await adapterGroup.demoteMember({member:data.member,group:data.group},
                    (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Member Demoted",error:false}));else dispatch(setMessage({message:"Cannot Demote Member",error:true}))}},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onDeleteMember = (data:{group:string,member:string}) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(memberUpdate)
                    await adapterGroup.removeMember({member:data.member,group:data.group},
                        (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Member Deleted",error:false}));else dispatch(setMessage({message:"Cannot Delete Member",error:true}))}},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={isProfile || open}
            onClick={() => {dispatch(memberOpenProfile(false));dispatch(setOpenProfile(false));dispatch(setMemberPreview(undefined))}}
        >
            {(isProfile && profile && profile.id)?
                <MemberPreview
                    paperProps={{onClick: (event) => {event.stopPropagation()}}}
                    profile={profile}
                    otherUsers={groups}
                    isProfile={isProfile}
                    isUpdate={JSON.stringify({name:profile?.username,avatar:profile?.avatar}) !== JSON.stringify({name:memberUpdate?.username,avatar:memberUpdate?.avatar})}
                    isDisable={disable}
                    theme={profile!.theme!}
                    onClickCancelUpdate={() => {dispatch(setMember(profile!));setAvatar(undefined)}}
                    onClickUpdate={onUpdate}
                    onTheme={() => {dispatch(setRoute(ReduxRoute.THEME))}}
                    data={{
                        username: (memberUpdate)?memberUpdate.username:"",
                        avatar: (memberUpdate)?memberUpdate.avatar:"",
                        onChangeAvatar: (file) => {
                            if (file.currentTarget.files) {
                                setAvatar(file.currentTarget.files[0])
                                fileConverter.to(file.currentTarget.files[0],(avatar) => {dispatch(setMember({...memberUpdate!,avatar:avatar}))})
                            }
                        },
                        onClickPasswordUpdate: () => {onPasswordUpdate()},
                        onClickViewOtherUser: () => {setOpenMenuViewOther(!openMenuViewOther)},
                        onPasswordNewChange: (text) => {setNewPassword(text.currentTarget.value)},
                        onPasswordOldChange: (text) => {setOldPassword(text.currentTarget.value)},
                        onUsernameChange: (text) => {dispatch(setMember({...memberUpdate!,username:text.currentTarget.value}))}
                    }}
                />:((member)?
                <MemberPreview
                    paperProps={{onClick: (event) => {event.stopPropagation()}}}
                    profile={member}
                    otherUsers={groups}
                    isProfile={false}
                    isDisable={disable}
                    theme={profile!.theme!}
                    data={{
                        username: (memberUpdate)?memberUpdate.username:"",
                        avatar: (memberUpdate)?memberUpdate.avatar:"",
                        onClickViewOtherUser: () => {setOpenMenuViewOther(!openMenuViewOther)},
                    }}
                    dataGroup={group}
                    onClickSend={onSendRequest}
                    onClickDemoted={(data) => {dispatch(setMessage({message:"Are you sure to demote this member ?",error:false,
                        isOptional:{isDisable:disable,onClickOk: () => {onDemoted(data)}}}))}}
                    onClickPromoted={(data) => {dispatch(setMessage({message:"Are you sure to promote this member ?",error:false,
                        isOptional:{isDisable:disable,onClickOk: () => {onPromoted(data)}}}))}}
                    onClickDeleteMember={(data) => {dispatch(setMessage({message:"Are you sure to delete this member ?",error:false,
                        isOptional:{isDisable:disable,onClickOk: () => {onDeleteMember(data)}}}))}}
                />:null)
            }
            <Modal
                id="menu-item-container-view-other-group"
                open={openMenuViewOther}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 2}}
                onClose={() => {setOpenMenuViewOther(!openMenuViewOther)}}
            >
                <Box sx={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",maxWidth:"400px",maxHeight:"800px",width:"90vw",height:"90vh"}}
                    onClick={(event) => {event.stopPropagation()}}>
                    <Stack spacing={0} sx={{height:"100%",overflow:"auto"}}>
                        {groups.map(((item,i) => (
                            <UserItemList
                                id={item.username+i}
                                image={item.avatar}
                                username={item.username}
                                onClick={() => {
                                    dispatch(setGroupPreview(item))
                                    dispatch(groupOpenProfile(true))
                                }}
                                theme={profile!.theme!}
                            />
                        )))}
                    </Stack>
                </Box>
            </Modal>
        </Backdrop>
    )
}

export function GroupPreviewView({adapterGroup,fileConverter}:UserPreviewViewInterface) {
    const [members,setMembers] = useState<Array<Member>>([])
    const [disable,setDisable] = useState(false)
    const [avatar,setAvatar] = useState<Blob>()
    const group = useAppSelector(state => state.groupReducer.groupPreview)
    const groupUpdate = useAppSelector(state => state.groupReducer.group)
    const open = useAppSelector(state => state.groupReducer.openProfile)
    const groupProfile = useAppSelector(state => state.profileReducer.group)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const dispatch = useAppDispatch()
    useEffect(() => {
        of({}).pipe(
            switchMap(async() => {
                if(group)
                    await adapterGroup.getAllMember({group:group.id!},
                        (members) => {setMembers(members)},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    },[group])
    
    const onUpdate = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(groupUpdate)
                    if (avatar)
                        await adapterGroup.modify({data:{username:groupUpdate.username},image:avatar},
                            (res) => {if(res) {dispatch(setGroupProfile(res));dispatch(setMessage({message:"Modify Successful",error:false}));dispatch(groupOpenProfile(!open));dispatch(setGroupPreview(undefined))}},
                            (error) => {dispatch(setMessage({message:error,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    else
                        await adapterGroup.modify({data:{username:groupUpdate.username}},
                            (res) => {if(res) {dispatch(setGroupProfile(res));dispatch(setMessage({message:"Modify Successful",error:false}));dispatch(groupOpenProfile(!open));dispatch(setGroupPreview(undefined))}},
                            (error) => {dispatch(setMessage({message:error,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onSendRequest = (data:{group:string,member:string}) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                await adapterGroup.sendRequestMember({group:data.group,member:data.member},
                    (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Send Request Successful",error:false}));else dispatch(setMessage({message:"Cannot Send Request",error:true}))}},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onDeleteGroup = (data:{group:string}) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(groupUpdate)
                    await adapterGroup.delete({group:data.group},
                        (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Group Deleted",error:false}));else dispatch(setMessage({message:"Cannot Delete Group",error:true}))}},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))}) 
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={open}
            onClick={() => {dispatch(groupOpenProfile(!open));dispatch(setGroupPreview(undefined))}}
        >
            {(group)?
                <GroupPreview
                    paperProps={{onClick: (event) => {event.stopPropagation()}}}
                    profile={group}
                    otherUsers={members}
                    isUpdate={JSON.stringify({name:group?.username,avatar:group?.avatar}) !== JSON.stringify({name:groupUpdate?.username,avatar:groupUpdate?.avatar})}
                    isDisable={disable}
                    theme={profile!.theme!}
                    onClickCancelUpdate={() => {dispatch(setGroup(group!));setAvatar(undefined)}}
                    onClickUpdate={onUpdate}
                    data={{
                        username: (groupUpdate)?groupUpdate.username:"",
                        avatar: (groupUpdate)?groupUpdate.avatar:"",
                        onChangeAvatar: (file) => {
                            if (file.currentTarget.files) {
                                setAvatar(file.currentTarget.files[0])
                                fileConverter.to(file.currentTarget.files[0],(avatar) => {dispatch(setGroup({...groupUpdate!,avatar:avatar}))})
                            }
                        },
                        onUsernameChange: (text) => {dispatch(setGroup({...groupUpdate!,username:text.currentTarget.value}))}
                    }}
                    dataGroupMemberAuth={profile}
                    roleGroupMemberAuth={(groupProfile)?groupProfile.roleMember:Role.MEMBER}
                    onClickSend={onSendRequest}
                    onClickDelete={(data) => {dispatch(setMessage({message:"Are you sure to delete this group ?",error:false,
                        isOptional:{isDisable:disable,onClickOk: () => {onDeleteGroup(data)}}}))}}
                />:null
            }
        </Backdrop>
    )
}