import { Backdrop, Box, BoxProps, CircularProgress, IconButton, List, ListItem, ListItemText, Modal, Stack, SxProps, Theme, Tooltip, Zoom, useMediaQuery } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import React, { MouseEvent, UIEvent, useEffect, useMemo, useState } from "react";
import { UserItemList } from "../container/user-list";
import { Router } from "../../model/data/router-server/router";
import { setMemberPreview, setOpenProfile as memberOpenProfile, setMembers, setMember } from "../../configuration/redux/reducer/member-reducer";
import { setGroupPreview, setOpenProfile as groupOpenProfile, setGroups, setGroup} from "../../configuration/redux/reducer/group-reducer";
import { MemberAdapter } from "../../adapter/member-adapter";
import { GroupAdapter } from "../../adapter/group-adapter";
import { EMPTY, exhaustMap, filter, iif, map, of, switchMap, tap, zip } from "rxjs";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import { setSearch } from "../../configuration/redux/reducer/search-reducer";
import { SearchField, StateThemeUtils, ThemeButton, ThemeFab } from "../container/global";
import { Add, AddCircle, Close, SummarizeRounded } from "@mui/icons-material";
import { Group, Member, Theme as ThemeObj } from "../../model/model";
import { MemberPreview, GroupPreview } from "../container/user-container";
import { setGroupProfile, setGroupsProfiles, setOpenProfile } from "../../configuration/redux/reducer/profile-reducer";
import { ReduxRoute } from "../../usecase/other/redux-item-route";
import { FileConverter, RoleSortConverter } from "../../usecase/converter/attribute";
import { Role } from "../../model/model-side";
import { ValidateAndSortArrayModel, ValidateLastModels, validateName } from "../../usecase/other/validate";
import { PublicAdapter } from "../../adapter/public-adapter";
import { setSubtypes } from "../../configuration/redux/reducer/note-reducer";

type Search = {
    adapterMember: MemberAdapter
    adapterGroup: GroupAdapter
    page?: number
    size: number
    isMember: boolean
}

interface UserViewSearchInterface {
    adapterMember?: MemberAdapter
    adapterGroup?: GroupAdapter
    sx?: SxProps<Theme>
    searchObj: string
    onRefreshSearch: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    userSwitch: boolean
}
// load data, if member not empty then displayed, otherwise group will display
const CheckMemberUserViewSearch = React.memo<{profile?:Member,oldMembers:Member[],members:Member[],oldGroups:Group[],groups:Group[],theme:ThemeObj}>(({profile,members,groups,oldMembers,oldGroups,theme}) => {
    const dispatch = useAppDispatch()
    return(
        <>
            {(members.length > 0)? 
                members.map((item,i) => 
                    <UserItemList
                        id={item.username+i}
                        key={item.username+i}
                        image={(item.avatar)?Router.Public.MEMBER_AVATAR.set({name:item.avatar}).build():""}
                        username={item.username}
                        onClick={() => {
                            if (profile?.id === item.id) {
                                dispatch(setOpenProfile(true))
                                dispatch(setMember({...profile!,avatar:undefined}))
                            } else {
                                dispatch(setMemberPreview({member:item,isRequest:oldMembers.map(item => item.id).includes(item.id)}))
                                dispatch(setMember({...item,avatar:undefined}))
                                dispatch(memberOpenProfile(true))
                            }
                        }}
                        theme={theme}
                    />
                ):(groups.length > 0)?
                    groups.map((item,i) => 
                        <UserItemList
                            id={item.username+i}
                            key={item.username+i}
                            image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                            username={item.username}
                            onClick={() => {
                                dispatch(setGroupPreview({group:item,isRequest:oldGroups.map(item => item.id).includes(item.id)}))
                                dispatch(setGroup({...item,avatar:undefined}))
                                dispatch(groupOpenProfile(true))
                            }}
                            theme={theme}
                        />
                    ): <ListItemText primary="No Item" sx={{textAlign:"center"}}/>
            }
        </>
    )
})
export function UserViewSearch({adapterGroup,adapterMember,searchObj,onRefreshSearch,userSwitch,sx}:UserViewSearchInterface) {
    const [loading,setLoading] = useState(false)
    const theme = useAppSelector(state => state.profileReducer.theme)
    const oldgroups = useAppSelector(state => state.profileReducer.groups)
    const oldmembers = useAppSelector(state => state.profileReducer.members)
    const groups = useAppSelector(state => state.groupReducer.groups)
    const members = useAppSelector(state => state.memberReducer.members)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const search = useAppSelector(state => state.searchAndFilterReducer.search)
    const dispatch = useAppDispatch()

    const onScroll = (event:UIEvent<HTMLUListElement, globalThis.UIEvent>,{adapterGroup,adapterMember,size,isMember}:Search) => {
        if(event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight && !loading) {
            iif(() => !search.endPage,zip(of(search.page+1),of(size)).pipe(
                tap((item) => {dispatch(setSearch({...search,page:item[1]}));setLoading(true);return item}),
                exhaustMap(async(item) => {
                    if (isMember) {
                        await adapterMember.getSearchData({name:searchObj,page:item[0],size:item[1]},(membersNew) => {
                            if (membersNew.length > 0) {
                                if (membersNew.length < item[1]) {
                                    dispatch(setSearch({...search,endPage:true}))
                                }
                            } else dispatch(setSearch({...search,page:item[0]-1,endPage:true}))
                            dispatch(setMembers([...members,...membersNew]))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    } else {
                        await adapterGroup.getSearchData({name:searchObj,page:item[0],size:item[1]},(groupsNew) => {
                            if (groupsNew.length > 0) {
                                if (groupsNew.length < item[1]) {
                                    dispatch(setSearch({...search,endPage:true}))
                                }
                            } else dispatch(setSearch({...search,page:item[0]-1,endPage:true}))
                            dispatch(setGroups([...groups,...groupsNew]))
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

    const dataCheckObj = useMemo(() => {
        return {groups,members,theme}
    },[groups,members,theme])

    return(
        <Box sx={{backgroundColor:theme!.background_color? theme!.background_color.substring(0,theme!.background_color.length-2)+'20' : "rgba(255,255,255,.35)",color:theme!.foreground_color,
            maxHeight:"100%",overflowY:"auto",...sx}}>
            <ThemeButton
                variant="outlined"
                themeObj={theme!}
                onClick={onRefreshSearch}
                state={StateThemeUtils.DEFAULT}
                sx={{width:"100%",fontWeight:700,fontSize:"1rem",display:{xs: "none", md: "block",textTransform:"none"}}}
            >
                Exit Search
            </ThemeButton>
            <ThemeFab 
                themeObj={theme}
                state={StateThemeUtils.DEFAULT}
                onClick={onRefreshSearch}
                sx={{position:"absolute",bottom:"2rem",right:"30px"}}
            >
                <Close color="inherit"/>
            </ThemeFab>
            <List onScroll={(event) => {onScroll(event,{adapterMember:adapterMember!,adapterGroup:adapterGroup!,page:search.page,size:search.size,isMember:userSwitch})}} 
                sx={{justifyContent:"center",maxHeight:"100%",overflowY:"auto"}}>
                <CheckMemberUserViewSearch profile={profile} oldGroups={oldgroups} oldMembers={oldmembers} members={dataCheckObj.members} groups={dataCheckObj.groups} theme={dataCheckObj.theme}/>
                {(loading)?
                    <ListItem sx={{color:theme!.default_background}}>
                        <CircularProgress color="inherit"/>
                    </ListItem>:null
                }
            </List>
        </Box>
    )
}

interface ProfileGroupViewInterface {
    memberAdapter?: MemberAdapter
    onClickMyNote: () => void
    onClickAddGroup: () => void
    sx?: SxProps<Theme>
}
// load data, if member not empty then displayed, otherwise group will display
const CheckMemberProfileGroupView = React.memo<{groups:Group[],size:number,load:number,search:string,theme:ThemeObj}>(({groups,size,load,search,theme}) => {
    const dispatch = useAppDispatch()
    return(
        <>
            {(groups.length > 0)?
                groups.filter(item => item.username.match(new RegExp(`.*${search}`,'g'))).slice(0,size*load).map((item,i) => 
                    <UserItemList
                        id={item.username+i}
                        key={item.username+i}
                        image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                        username={item.username}
                        onClick={() => {
                            dispatch(setSubtypes([]))
                            dispatch(setGroupProfile(item))
                        }}
                        theme={theme}
                    />):<ListItemText primary="No Item" sx={{textAlign:"center"}}/>
            }
        </>
    )
})
export function ProfileGroupView({memberAdapter,onClickMyNote,onClickAddGroup,sx}:ProfileGroupViewInterface) {
    const large = useMediaQuery("(min-width:1000px)")
    const [load,setLoad] = useState(1)
    const [search, setSearch] = useState("")
    const groups = useAppSelector(state => state.profileReducer.groups)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const groupProfile = useAppSelector(state => state.profileReducer.group)
    const size = useAppSelector(state => state.searchAndFilterReducer.search.size)
    const dispatch = useAppDispatch()
    const streamObj = of({}).pipe(
        exhaustMap(async (i) => {
            if (memberAdapter && profile && profile.id) {
                await memberAdapter.getAllMemberGroup({member:profile.id},
                    (groupsDt) => {
                        if(groupsDt.length > 1) {
                            let data = ValidateAndSortArrayModel.validateArrayGroup(groups,groupsDt)
                            if (!data.first) dispatch(setGroupsProfiles(data.second))
                        } else if (groupsDt.length > 0) {
                            let data = ValidateLastModels.validateGroup(groups,groupsDt[0])
                            if (!data) dispatch(setGroupsProfiles(groupsDt))
                        }
                    },
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }
            return of({})
        }))

    // useEffect(() => {
    //     setLoad(1)
    // },[groups])
    
    useEffect(() => {
        if(!profile || profile && !profile.id) return;
        let sub = streamObj.subscribe()
        return () => sub.unsubscribe()
    },[profile])

    const dataCheckMember = useMemo(() => {
        return {groups,size,load,search,themeProfile}
    },[groups,size,load,search,themeProfile])

    const onScroll = (event:UIEvent<HTMLUListElement, globalThis.UIEvent>) => {
        if(event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight) {
            if (groups.length > 0) 
                if (load < 50)
                    setLoad(load+1)
        }
    }

    return(
        <Box sx={{backgroundColor:themeProfile.background_color? themeProfile.background_color.substring(0,7)+'10' : "rgba(255,255,255,.15)",color:themeProfile.foreground_color,
            ...sx}}>
            <Stack direction="row" spacing={1} sx={{width:"100%",marginBottom:"10px"}}>
                <SearchField
                    sx={{width:"100%",margin:"0px 0 0 10px",marginRight:(large)?0:"10px"}}
                    theme={themeProfile}
                    onSearch={() => {}} // using dynamic search, so on search not used
                    onChange={(event) => {setLoad(1);setSearch(event.currentTarget.value)}}
                    placeholder="Search my group"
                    isDropDownButton={false}
                />
                {(large)?
                    <Tooltip title="Add New Group" sx={{margin:"10px 0 0"}}>
                        <IconButton sx={{color: themeProfile.default_background}} onClick={onClickAddGroup}>
                            <AddCircle color="inherit"/>
                        </IconButton>
                    </Tooltip>:null
                }
            </Stack>
            {(groupProfile && large)?
                <>
                    <ThemeButton
                        variant="outlined"
                        themeObj={themeProfile}
                        onClick={onClickMyNote}
                        state={StateThemeUtils.DEFAULT}
                        sx={{width:"100%",fontWeight:700,fontSize:"1rem",textTransform:"none",margin:"0 0 10px 0"}}
                    >
                        My Note
                    </ThemeButton>
                </>:null
            }
            <Stack spacing={2} sx={{position:"absolute",bottom:"2rem",right:"30px"}}>
                <Zoom in={groupProfile !== undefined}>
                    <ThemeFab
                        themeObj={themeProfile}
                        state={StateThemeUtils.DEFAULT}
                        onClick={onClickMyNote}
                    >
                        <SummarizeRounded/>
                    </ThemeFab>
                </Zoom>
                {(!large)?
                    <>
                        <ThemeFab
                            themeObj={themeProfile}
                            state={StateThemeUtils.DEFAULT}
                            onClick={onClickAddGroup}
                        >
                            <Add color="inherit"/>
                        </ThemeFab>
                    </>:null
                }
            </Stack>
            <List onScroll={onScroll} sx={{maxHeight:"100%",overflowY:"auto"}}>
                <CheckMemberProfileGroupView groups={dataCheckMember.groups} size={dataCheckMember.size} 
                    load={dataCheckMember.load} search={dataCheckMember.search} theme={dataCheckMember.themeProfile}/>
            </List>
        </Box>
    )
}

// for note
interface ProfileGroupMemberViewInterface {
    members: Member[]
    sx?: SxProps<Theme>
    boxProps?: BoxProps
}
// load data, if member not empty then displayed, otherwise group will display
const CheckMemberProfileGroupMemberView = React.memo<{profile?:Member,members:Member[],search:string,load:number,theme:ThemeObj}>(({profile,members,search,load,theme}) => {
    const dispatch = useAppDispatch()
    const sortRole = new RoleSortConverter()
    return(
        <>
            {(members.length > 0)?
                members.filter(item => item.username.match(new RegExp(`.*${search}`,'g'))).slice(0,25*load).sort((a,b) => sortRole.to(b.role!) - sortRole.to(a.role!)).map((item,i) => 
                    <UserItemList
                        id={item.username+i}
                        key={item.username+i}
                        image={(item.avatar)?Router.Public.MEMBER_AVATAR.set({name:item.avatar}).build():""}
                        username={item.username}
                        role={item.role}
                        onClick={() => {
                            if (profile?.id === item.id) {
                                dispatch(setOpenProfile(true))
                                dispatch(setMember({...profile!,avatar:undefined}))
                            } else {
                                dispatch(setMemberPreview({member:item,isRequest:true}))
                                dispatch(setMember({...item,avatar:undefined}))
                                dispatch(memberOpenProfile(true))
                            }
                        }}
                        theme={theme}
                    />):<ListItemText primary="No Item" sx={{textAlign:"center"}}/>
            }
        </>
    )
})
export function ProfileGroupMemberView({members,sx,boxProps}:ProfileGroupMemberViewInterface) {
    const [load,setLoad] = useState(1)
    const [search, setSearch] = useState("")
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const onScroll = (event:UIEvent<HTMLUListElement, globalThis.UIEvent>) => {
        if(event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight) {
            if (load < 100) {
                setLoad(load+1)
            }
        }
    }

    return(
        <Box sx={{backgroundColor:themeProfile.background_color? themeProfile.background_color.substring(0,themeProfile.background_color.length-2)+'25' : "rgba(255,255,255,.35)",color:themeProfile.foreground_color,
            ...sx}} {...boxProps}>
            <Stack direction="row" spacing={1}>
                <SearchField
                    theme={themeProfile}
                    onSearch={() => {}} // using dynamic search, so on search not used
                    onChange={(event) => {setLoad(1);setSearch(event.currentTarget.value)}}
                    placeholder="Search my group"
                    isDropDownButton={false}
                />
            </Stack>
            <List onScroll={onScroll} sx={{height:"100%",overflowY:"auto"}}>
                <CheckMemberProfileGroupMemberView profile={profile} members={members} search={search} load={load} theme={themeProfile}/>
            </List>
        </Box>
    )
}

interface UserPreviewViewInterface {
    adapterPublic?: PublicAdapter
    adapterMember: MemberAdapter
    adapterGroup: GroupAdapter
    fileConverter: FileConverter
}
export function MemberPreviewView({adapterPublic,adapterMember,adapterGroup,fileConverter}:UserPreviewViewInterface) {
    const [groups,setGroups] = useState<Array<Group>>([])
    const [disable,setDisable] = useState(false)
    const [avatar,setAvatar] = useState<Blob>()
    const [oldPassword,setOldPassword] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [error,setError] = useState(false)
    const [openMenuViewOther,setOpenMenuViewOther] = useState(false)
    const member = useAppSelector(state => state.memberReducer.memberPreview)
    const memberUpdate = useAppSelector(state => state.memberReducer.member)
    const open = useAppSelector(state => state.memberReducer.openProfile)
    const isProfile = useAppSelector(state => state.profileReducer.openProfile)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const group = useAppSelector(state => state.profileReducer.group)
    const dispatch = useAppDispatch()
    useEffect(() => {
        of({}).pipe(
            tap(() => {setGroups([])}),
            switchMap(async() => {
                if(member)
                    await adapterMember.getAllMemberGroup({member:member.member!.id!},
                        (groups) => {setGroups(groups)},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    },[member])
    
    const onUpdate = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(memberUpdate)
                    if (avatar)
                        await adapterMember.modify({data:{id:memberUpdate.id,username:memberUpdate.username},image:avatar},
                            (res) => {if(res) {dispatch(setMessage({message:res.data,error:false}));dispatch(setOpenProfile(!isProfile));dispatch(setMemberPreview(undefined))}},
                            (error) => {dispatch(setMessage({message:error,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    else
                        await adapterMember.modify({data:{id:memberUpdate.id,username:memberUpdate.username}},
                            (res) => {if(res) {dispatch(setMessage({message:res.data,error:false}));dispatch(setOpenProfile(!!isProfile));dispatch(setMemberPreview(undefined))}},
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
                    await adapterMember.modifyPassword({oldPassword:oldPassword,newPassword:newPassword},
                        (res) => {if(res) {if (res.data) dispatch(setMessage({message:"Password Changed",error:false}));else dispatch(setMessage({message:"Cannot Change Password",error:true}))}},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false);setOldPassword("");setNewPassword("")})
        ).subscribe()
    }

    const onSendRequest = (data:{group:string,member:string}) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                await adapterGroup.sendRequestMember({group:data.group,member:data.member},
                    (res) => {if(res) {if (res.data) {
                        dispatch(memberOpenProfile(!open))
                        dispatch(setMemberPreview(undefined))
                        dispatch(setMessage({message:"Send Request Successful",error:false}))
                    }else dispatch(setMessage({message:"Cannot Send Request",error:true}))}},
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
                    (res) => {if(res) {if (res.data) {
                        dispatch(memberOpenProfile(!open))
                        dispatch(setMemberPreview(undefined))
                        dispatch(setMessage({message:"Member Promoted",error:false}))
                    }else dispatch(setMessage({message:"Cannot Promote Member",error:true}))}},
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
                    (res) => {if(res) {if (res.data) {
                        dispatch(memberOpenProfile(!open))
                        dispatch(setMemberPreview(undefined))
                        dispatch(setMessage({message:"Member Demoted",error:false}))
                    }else dispatch(setMessage({message:"Cannot Demote Member",error:true}))}},
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
                        (res) => {if(res) {if (res.data) {
                            dispatch(memberOpenProfile(!open))
                            dispatch(setMemberPreview(undefined))
                            dispatch(setMessage({message:"Member Deleted",error:false}))
                        }else dispatch(setMessage({message:"Cannot Delete Member",error:true}))}},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onValidateMember = (name:string) => {
        of(name).pipe(
            filter(name => validateName(name)),
            map(name => {dispatch(setMember({...memberUpdate!,username:name}));return name}),
            exhaustMap(async (name) => {
                await adapterPublic!.validateUserName({name:name},
                    (res) => {if(res)if(res.data){setError(false)}else setError(true)},
                    (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))}
                )  
            })
        ).subscribe()
    }

    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, maxHeight:"100vh", overflowY:"auto"}}
            open={isProfile || open}
            invisible
            onClick={() => {dispatch(memberOpenProfile(false));dispatch(setOpenProfile(false));dispatch(setMemberPreview(undefined))}}
        >
            {(memberUpdate)?((isProfile && profile && profile.id)?
                <MemberPreview
                    paperProps={{onClick: (event) => {event.stopPropagation()},sx:{backgroundColor:themeProfile.background_color.substring(0,7)+"BC",color:themeProfile.foreground_color}}}
                    profile={profile}
                    isRequest={false}
                    otherUsers={groups}
                    isProfile={isProfile}
                    isUpdate={JSON.stringify({name:profile?.username,avatar:profile?.avatar}) !== JSON.stringify({name:memberUpdate?.username,avatar:memberUpdate?.avatar})}
                    isDisable={disable}
                    theme={themeProfile}
                    error={error}
                    onClickCancelUpdate={() => {dispatch(setMember({...profile!,avatar:undefined}));setAvatar(undefined);setError(false)}}
                    onClickUpdate={onUpdate}
                    onTheme={() => {dispatch(setRoute(ReduxRoute.THEME))}}
                    username={memberUpdate.username}
                    avatar={memberUpdate.avatar}
                    oldPassword={oldPassword}
                    newPassword={newPassword}
                    onChangeAvatar={(file) => {
                        if (file.currentTarget.files) {
                            setAvatar(file.currentTarget.files[0])
                            fileConverter.to(file.currentTarget.files[0],(avatar) => {dispatch(setMember({...memberUpdate!,avatar:avatar}))})
                        }
                    }}
                    onClickPasswordUpdate={onPasswordUpdate}
                    onClickViewOtherUser={() => {setOpenMenuViewOther(!openMenuViewOther)}}
                    onPasswordNewChange={(text) => {setNewPassword(text.currentTarget.value)}}
                    onPasswordOldChange={(text) => {setOldPassword(text.currentTarget.value)}}
                    onUsernameChange={(text) => {onValidateMember(text.currentTarget.value)}}
                />:((member && member.member)?
                <MemberPreview
                    paperProps={{onClick: (event) => {event.stopPropagation()},sx:{backgroundColor:themeProfile.background_color.substring(0,7)+"BC",color:themeProfile.foreground_color}}}
                    profile={member.member}
                    otherUsers={groups}
                    isProfile={false}
                    isRequest={(member.isRequest)? member.isRequest:false}
                    isDisable={disable}
                    theme={themeProfile}
                    error={error}
                    username={memberUpdate.username}
                    avatar={memberUpdate.avatar}
                    onClickViewOtherUser={() => {setOpenMenuViewOther(!openMenuViewOther)}}
                    dataGroup={group}
                    onClickSend={onSendRequest}
                    onClickDemoted={(data) => {dispatch(setMessage({message:"Are you sure to demote this member ?",error:false,
                        isOptional:{isDisable:disable,onClickOk: () => {onDemoted(data)}}}))}}
                    onClickPromoted={(data) => {dispatch(setMessage({message:"Are you sure to promote this member ?",error:false,
                        isOptional:{isDisable:disable,onClickOk: () => {onPromoted(data)}}}))}}
                    onClickDeleteMember={(data) => {dispatch(setMessage({message:"Are you sure to delete this member ?",error:false,
                        isOptional:{isDisable:disable,onClickOk: () => {onDeleteMember(data)}}}))}}
                />:null)):null
            }
            <Modal
                id="menu-item-container-view-other-group"
                open={openMenuViewOther}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 2}}
                onClose={() => {setOpenMenuViewOther(!openMenuViewOther)}}
            >
                <Box sx={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",maxWidth:"400px",maxHeight:"800px",width:"90vw",height:"90vh"}}
                    onClick={(event) => {event.stopPropagation()}}>
                    <List sx={{height:"100%",overflow:"auto"}}>
                        {groups.map(((item,i) => (
                            <UserItemList
                                id={item.username+i}
                                key={item.username+i}
                                image={item.avatar}
                                username={item.username}
                                onClick={() => {
                                    dispatch(setGroupPreview({group:item,isRequest:false}))
                                    dispatch(groupOpenProfile(true))
                                }}
                                theme={themeProfile}
                            />
                        )))}
                    </List>
                </Box>
            </Modal>
        </Backdrop>
    )
}

export function GroupPreviewView({adapterGroup,adapterMember,fileConverter}:UserPreviewViewInterface) {
    const [members,setMembers] = useState<Array<Member>>([])
    const [disable,setDisable] = useState(false)
    const [avatar,setAvatar] = useState<Blob>()
    const [error,setError] = useState(false)
    const group = useAppSelector(state => state.groupReducer.groupPreview)
    const groupUpdate = useAppSelector(state => state.groupReducer.group)
    const open = useAppSelector(state => state.groupReducer.openProfile)
    const groupProfile = useAppSelector(state => state.profileReducer.group)
    const groupProfiles = useAppSelector(state => state.profileReducer.groups)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const dispatch = useAppDispatch()
    useEffect(() => {
        of({}).pipe(
            tap(() => {setMembers([])}),
            switchMap(async() => {
                if(group)
                    await adapterGroup.getAllMember({group:group.group!.id!},
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
                        await adapterGroup.modify({data:{id:groupUpdate.id,username:groupUpdate.username},image:avatar},
                            (res) => {if(res) {dispatch(setGroupProfile(res));dispatch(setMessage({message:"Modify Successful",error:false}));dispatch(groupOpenProfile(!open));dispatch(setGroupPreview(undefined))}},
                            (error) => {dispatch(setMessage({message:error,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    else
                        await adapterGroup.modify({data:{id:groupUpdate.id,username:groupUpdate.username}},
                            (res) => {if(res) {dispatch(setGroupProfile(res));dispatch(setMessage({message:"Modify Successful",error:false}));dispatch(groupOpenProfile(!open));dispatch(setGroupPreview(undefined))}},
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
                await adapterMember.sendRequestGroup({group:data.group},
                    (res) => {if(res) {if (res.data) {
                        dispatch(setMessage({message:"Send Request Successful",error:false}))
                        dispatch(groupOpenProfile(!open))
                        dispatch(setGroupPreview(undefined))
                    }else dispatch(setMessage({message:"Cannot Send Request",error:true}))}},
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
                        (res) => {
                            if(res) {if (res.data) {
                                dispatch(setMessage({message:"Group Deleted",error:false}))
                                dispatch(setGroupsProfiles([...groupProfiles.filter(item => item.id !== data.group)]))
                                dispatch(setGroupProfile(undefined))
                                dispatch(groupOpenProfile(false))
                            } else dispatch(setMessage({message:"Cannot Delete Group",error:true}))}},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))}) 
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onValidateGroup = (name:string) => {
        of(name).pipe(
            filter(name => validateName(name)),
            map(name => {dispatch(setGroup({...groupUpdate!,username:name}));return name}),
            exhaustMap(async (name) => {
                await adapterGroup.validate({name:name},
                    (res) => {if(res)if(res.data){setError(false)}else setError(true)},
                    (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))}
                )  
            })
        ).subscribe()
    }

    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, maxHeight:"100vh", overflowY:"auto"}}
            open={open}
            invisible
            onClick={() => {dispatch(groupOpenProfile(!open));dispatch(setGroupPreview(undefined))}}
        >
            {(group && group.group && groupUpdate)?
                <GroupPreview
                    paperProps={{onClick: (event) => {event.stopPropagation()},sx:{backgroundColor:themeProfile.background_color.substring(0,7)+"BC",color:themeProfile.foreground_color}}}
                    profile={group.group}
                    otherUsers={members}
                    isUpdate={JSON.stringify({name:group.group?.username,avatar:group.group?.avatar}) !== JSON.stringify({name:groupUpdate?.username,avatar:groupUpdate?.avatar})}
                    isDisable={disable}
                    isRequest={(group.isRequest)?group.isRequest:false}
                    theme={themeProfile}
                    error={error}
                    onClickCancelUpdate={() => {dispatch(setGroup({...group.group!,avatar:undefined}));setAvatar(undefined);setError(false)}}
                    onClickUpdate={onUpdate}
                    username={groupUpdate.username}
                    avatar={groupUpdate.avatar}
                    onChangeAvatar={(file) => {
                        if (file.currentTarget.files) {
                            setAvatar(file.currentTarget.files[0])
                            fileConverter.to(file.currentTarget.files[0],(avatar) => {dispatch(setGroup({...groupUpdate!,avatar:avatar}))})
                        }
                    }}
                    onUsernameChange={(text) => {onValidateGroup(text.currentTarget.value)}}
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