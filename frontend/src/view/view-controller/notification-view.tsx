import { Badge, Box, Divider, Drawer, IconButton, List, Tab, Tabs, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { setOpenNotificationMember, setOpenNotificationGroup, setRequestListGroup, setRequestRejectedGroup, setRequestListMember, setRequestRejectedMember } from "../../configuration/redux/reducer/notification-reducer";
import React, { MouseEvent, useEffect, useState } from "react";
import { ArrowForwardIos, Assignment, AssignmentLateRounded } from "@mui/icons-material";
import { UserItemListReject, UserItemListRequest } from "../container/user-list";
import { Router } from "../../model/data/router-server/router";
import { setGroupPreview, setOpenProfile as groupOpenProfile, setGroup } from "../../configuration/redux/reducer/group-reducer";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { MemberAdapter } from "../../adapter/member-adapter";
import { GroupAdapter } from "../../adapter/group-adapter";
import { TabPanel } from "../container/global";
import { setMemberPreview, setOpenProfile as memberOpenProfile, setMember } from "../../configuration/redux/reducer/member-reducer";
import { exhaustMap, of, tap } from "rxjs";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import { Group, Member, Theme } from "../../model/model";
import { setGroupsProfiles } from "../../configuration/redux/reducer/profile-reducer";
import { ValidateAndSortArrayModel, ValidateLastModels } from "../../adapter/other/validate";

type NotificationViewForMemberType = {
    adapter?: MemberAdapter
}
const CheckNotifMemberViewRequest = React.memo<{profile:Member,notificationRequest:Group[],groupProfiles:Group[],theme:Theme,adapter:MemberAdapter}>(({profile,notificationRequest,groupProfiles,theme,adapter}) => {
    const dispatch = useAppDispatch();
    const onAccept = (group?: Group) => {
        of({}).pipe(
            exhaustMap(async() => {
                if (group && adapter) {
                    // perbaikan logic add and remove
                    await adapter.sendConfirmGroup({group: group.id!},
                        (data) => {
                            if (data)
                                if(data.data) {
                                    dispatch(setGroupsProfiles([...groupProfiles,group]))
                                    dispatch(setRequestListGroup([...notificationRequest.filter(item => item.id! !== group.id!)]))
                                    dispatch(setMessage({message:"Group Confirmed",error:false}))
                                }
                                else
                                    dispatch(setMessage({message:"Can`t Confirm Group",error:true}))
                        },
                        (error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else
                    dispatch(setMessage({message:"id not found",error:true}))
            })
        ).subscribe()
    }
    const onReject = (group?: Group) => {
        of({}).pipe(
            exhaustMap(async() => {
                if (group && adapter) {
                    await adapter.sendRejectGroup({group: group.id!},
                        (data) => {
                            if (data)
                                if(data.data) {
                                    dispatch(setMessage({message:"Group Rejected",error:false}))
                                    dispatch(setRequestListGroup([...notificationRequest.filter(item => item.id! !== group.id!)]))
                                }
                                else
                                    dispatch(setMessage({message:"Can`t Rejected Group",error:true}))
                        },
                        (error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else
                    dispatch(setMessage({message:"id not found",error:true}))
            })
        ).subscribe()
    }
    return(
        <>
            {
                notificationRequest.map((item,i) => (
                    <UserItemListRequest
                        id={item.username+i}
                        key={item.username+i}
                        image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                        username={item.username}
                        onClick={() => {
                            dispatch(setGroupPreview({...item,isRequest:true}))
                            dispatch(setGroup({...item,avatar:undefined}))
                            dispatch(groupOpenProfile(true))
                        }}
                        theme={theme}
                        notificationFrom={item.notificationFrom!}
                        onClickAccept={() => {dispatch(setMessage({message:"Are you sure to accept it ?",error:false,
                            isOptional:{onClickOk: () => {onAccept(item)}}}))}}
                        onClickReject={() => {dispatch(setMessage({message:"Are you sure to reject it ?",error:false,
                            isOptional:{onClickOk: () => {onReject(item)}}}))}}
                    />
                ))
            }
        </>
    )
})

const CheckNotifMemberViewReject = React.memo<{profile:Member,notificationReject:Group[],theme:Theme,adapter:MemberAdapter}>(({profile,notificationReject,theme,adapter}) => {
    const dispatch = useAppDispatch();
    const onDoneReject = (group?: Group) => {
        of({}).pipe(
            exhaustMap(async() => {
                if (group && adapter) {
                    await adapter.deleteGroup({group: group.id!,member:profile.id!},
                        (data) => {
                            if (data)
                                if(data.data)
                                    dispatch(setRequestRejectedGroup([...notificationReject.filter(item => item.id! !== group.id!)]))
                                else
                                    dispatch(setMessage({message:"Can`t Remove Group",error:true}))
                        },
                        (error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else
                    dispatch(setMessage({message:"id not found",error:true}))
            })
        ).subscribe()
    }
    return(
        <>
            {
                notificationReject.map((item,i) => (
                    <UserItemListReject
                        id={item.username+i}
                        key={item.username+i}
                        image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                        username={item.username}
                        onClick={() => {
                            dispatch(setGroupPreview({...item,isRequest:true}))
                            dispatch(setGroup({...item,avatar:undefined}))
                            dispatch(groupOpenProfile(true))
                        }}
                        theme={theme}
                        onClickDone={() => {onDoneReject(item)}}
                    />
                ))
            }
        </>
    )
})
export function NotificationViewForMember({adapter}:NotificationViewForMemberType) {
    const [tab,setTab] = useState(0)
    const openNotification = useAppSelector(state => state.notificationReducer.openNotificationMember)
    const notificationRequest = useAppSelector(state => state.notificationReducer.requestListGroup)
    const notificationReject = useAppSelector(state => state.notificationReducer.requestRejectedGroup)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const groupProfiles = useAppSelector(state => state.profileReducer.groups)
    const dispatch = useAppDispatch()
    const streamObj = of({}).pipe(
        exhaustMap(async () => {
            if (adapter) {
                await adapter.getAllGroupQueue({page:0,size:20},
                    (groups) => {
                        if (groups.length > 1) {
                            let data = ValidateAndSortArrayModel.validateArrayGroup(notificationRequest,groups)
                            if (!data.first) dispatch(setRequestListGroup(data.second))
                        } else if (groups.length > 0) {
                            let data = ValidateLastModels.validateGroup(notificationRequest,groups[0])
                            if (!data) dispatch(setRequestListGroup(groups))   
                        }
                    },
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                await adapter.getAllGroupRejected({page:0,size:20},
                    (groups) => {
                        if (groups.length > 1) {
                            let data = ValidateAndSortArrayModel.validateArrayGroup(notificationReject,groups.filter(item => item.notificationFrom))
                            if (!data.first) dispatch(setRequestRejectedGroup(data.second))
                        } else if (groups.length > 0 && groups[0].notificationFrom) {
                            let data = ValidateLastModels.validateGroup(notificationReject,groups[0])
                            if (!data) dispatch(setRequestRejectedGroup(groups))
                        }
                    },
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }
            return of({})
        }))
    
    useEffect(() => {
        if(!profile || profile && !profile.id) return;
        let sub = streamObj.subscribe()
        return () => sub.unsubscribe()
    },[profile])
    return(
        <Drawer
            anchor="right"
            open={openNotification}
            onClose={() => {dispatch(setOpenNotificationMember(!openNotification))}}
            PaperProps={{sx:{backgroundColor:themeProfile.background_color,color:themeProfile.foreground_color}}}
        >
            <Typography variant="h5" textAlign="center" fontWeight={700}>{tab === 0? "Request Group":"Rejected Group"}</Typography>
            <Typography sx={{maxWidth:"500px",width:"80vw"}} textAlign="center">{tab === 0? "list of request from group to make connection with you contains requests from the group for you so that you can collaborate with them, but you can also decline them":
                "contains a request to enter a group from you that has been rejected, don't worry there is still another chance"}</Typography>
            <Divider/>
            <Box sx={{color:themeProfile.default_background}}>
                <Tabs value={tab} onChange={(e,item) => {setTab(item)}} variant="fullWidth" textColor="inherit" TabIndicatorProps={{sx:{backgroundColor:themeProfile.default_background}}}>
                    <Tab value={0} icon={<Badge badgeContent={notificationRequest.length}><Assignment/></Badge>} aria-label="request group"/>
                    <Tab value={1} icon={<Badge badgeContent={notificationReject.length}><AssignmentLateRounded/></Badge>} aria-label="rejected group"/>
                </Tabs>
            </Box>
            <TabPanel targetValue={0} value={tab}>
                <List sx={{maxHeight:"100%",overflowY:"auto"}}>
                    {(tab === 0 && notificationRequest.length > 0 && adapter && profile)?
                        <CheckNotifMemberViewRequest profile={profile} notificationRequest={notificationRequest} groupProfiles={groupProfiles} theme={themeProfile} adapter={adapter}/>:<Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
                    }
                </List>
            </TabPanel>
            <TabPanel targetValue={1} value={tab}>
                <List sx={{maxHeight:"100%",overflowY:"auto"}}>
                    {(tab === 1 && notificationReject.length > 0 && adapter && profile)?
                        <CheckNotifMemberViewReject profile={profile} notificationReject={notificationReject} theme={themeProfile} adapter={adapter}/>:<Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
                    }
                </List>
            </TabPanel>
            <Box sx={{margin:"auto",paddingBottom:"20px",display: {sx: "inline-block", md: "none"}}}>
                <IconButton
                    onClick={() => {dispatch(setOpenNotificationMember(!openNotification))}}
                    sx={{color:"inherit",fontSize:"2rem"}}
                >
                    <ArrowForwardIos sx={{fontSize:"inherit"}}/>
                </IconButton>
            </Box>
        </Drawer>
    )
}

type NotificationViewForGroupType = {
    adapter?: GroupAdapter
    adapterMember?: MemberAdapter
}
const CheckNotifGroupViewRequest = React.memo<{notificationRequest:Member[],group:Group,theme:Theme,adapter:GroupAdapter}>(({notificationRequest,group,theme,adapter}) => {
    const dispatch = useAppDispatch();
    const onAccept = (member?: Member) => {
        of({}).pipe(
            exhaustMap(async() => {
                if (member && adapter && group) {
                    await adapter.sendConfirmMember({member:member.id!, group:group.id!},
                        (data) => {
                            if (data)
                                if(data.data) {
                                    dispatch(setMessage({message:"User Confirmed",error:false}))
                                    dispatch(setRequestListMember([...notificationRequest.filter(item => item.id! !== member.id!)]))
                                }
                                else
                                    dispatch(setMessage({message:"Can`t Confirm User",error:true}))
                        },
                        (error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else
                    dispatch(setMessage({message:"id not found",error:true}))
            })
        ).subscribe()
    }
    const onReject = (member?: Member) => {
        of({}).pipe(
            exhaustMap(async() => {
                if (member && adapter && group) {
                    await adapter.sendRejectMember({member:member.id!, group:group.id!},
                        (data) => {
                            if (data)
                                if(data.data) {
                                    dispatch(setMessage({message:"User Rejected",error:false}))
                                    dispatch(setRequestListMember([...notificationRequest.filter(item => item.id! !== member.id!)]))
                                }
                                else
                                    dispatch(setMessage({message:"Can`t Rejected User",error:true}))
                        },
                        (error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else
                    dispatch(setMessage({message:"id not found",error:true}))
            })
        ).subscribe()
    }
    return(
        <>
            {
                notificationRequest.map((item,i) => (
                    <UserItemListRequest
                        id={item.username+i}
                        key={item.username+i}
                        image={(item.avatar)?Router.Public.MEMBER_AVATAR.set({name:item.avatar}).build():""}
                        username={item.username}
                        onClick={() => {
                            dispatch(setMemberPreview({...item,isRequest:true}))
                            dispatch(setMember({...item,avatar:undefined}))
                            dispatch(memberOpenProfile(true))
                        }}
                        theme={theme}
                        notificationFrom={item.notificationFrom!}
                        onClickAccept={() => {dispatch(setMessage({message:"Are you sure to accept it ?",error:false,
                            isOptional:{onClickOk: () => {onAccept(item)}}}))}}
                        onClickReject={() => {dispatch(setMessage({message:"Are you sure to reject it ?",error:false,
                            isOptional:{onClickOk: () => {onReject(item)}}}))}}
                    />
                ))
            }
        </>
    )
})

const CheckNotifGroupViewReject = React.memo<{notificationReject:Member[],group:Group,theme:Theme,adapter:MemberAdapter}>(({notificationReject,group,theme,adapter}) => {
    const dispatch = useAppDispatch();
    const onDoneReject = (member?: Member) => {
        of({}).pipe(
            exhaustMap(async() => {
                if (member && adapter && group) {
                    await adapter.deleteGroup({group:group.id!,member:member.id!},
                        (data) => {
                            if (data)
                                if(data.data)
                                    dispatch(setRequestRejectedMember([...notificationReject.filter(item => item.id! !== member.id!)]))
                                else
                                    dispatch(setMessage({message:"Can`t Remove User",error:true}))
                        },
                        (error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else
                    dispatch(setMessage({message:"id not found",error:true}))
            })
        ).subscribe()
    }
    return(
        <>
            {
                notificationReject.map((item,i) => (
                    <UserItemListReject
                        id={item.username+i}
                        key={item.username+i}
                        image={(item.avatar)?Router.Public.MEMBER_AVATAR.set({name:item.avatar}).build():""}
                        username={item.username}
                        onClick={() => {
                            dispatch(setMemberPreview({...item,isRequest:true}))
                            dispatch(setMember({...item,avatar:undefined}))
                            dispatch(memberOpenProfile(true))
                        }}
                        theme={theme}
                        onClickDone={() => {onDoneReject(item)}}
                    />
                ))
            }
        </>
    )
})
export function NotificationViewForGroup({adapter,adapterMember}:NotificationViewForGroupType) {
    const [tab,setTab] = useState(0)
    const openNotification = useAppSelector(state => state.notificationReducer.openNotificationGroup)
    const notificationRequest = useAppSelector(state => state.notificationReducer.requestListMember)
    const notificationReject = useAppSelector(state => state.notificationReducer.requestRejectedMember)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const group = useAppSelector(state => state.profileReducer.group)
    const dispatch = useAppDispatch()
    const streamObj = of({}).pipe(
        exhaustMap(async(i) => {
            if (adapter && group) {
                await adapter.getAllMemberQueue({group:group.id!,page:0,size:20},
                    (members) => {
                        if (members.length > 1) {
                            let data = ValidateAndSortArrayModel.validateArrayMember(notificationRequest,members)
                            if (!data.first) dispatch(setRequestListMember(data.second))
                        } else if (members.length > 0) {
                            let data = ValidateLastModels.validateMember(notificationRequest,members[0])
                            if (!data) dispatch(setRequestListMember(members))
                        }
                    },
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                await adapter.getAllRejectedRequestQueue({group:group.id!,page:0,size:20},
                    (members) => {
                        if (members.length > 1) {
                            let data = ValidateAndSortArrayModel.validateArrayMember(notificationReject,members.filter(item => item.notificationFrom))
                            if (!data.first) dispatch(setRequestRejectedMember(data.second))
                        } else if (members.length > 0 && members[0].notificationFrom) {
                            let data = ValidateLastModels.validateMember(notificationReject,members[0])
                            if (!data) dispatch(setRequestRejectedMember(members))
                        }
                    },
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }
        }))

    useEffect(() => {
        if(!profile || (profile && !profile.id) || (group && group.roleMember !== ("MANAGER" || "ADMIN"))) return;
        let subs = streamObj.subscribe()
        return () => subs.unsubscribe()
    },[profile])

    return(
        <Drawer
            anchor="right"
            open={openNotification}
            onClose={() => {dispatch(setOpenNotificationGroup(!openNotification))}}
            PaperProps={{sx:{backgroundColor:themeProfile.background_color,color:themeProfile.foreground_color}}}
        >
            <Typography variant="h5" textAlign="center" fontWeight={700}>{tab === 0? "Request Member":"Rejected Member"}</Typography>
            <Typography sx={{maxWidth:"500px",width:"80vw"}} textAlign="center">{tab === 0? "list of request from members to join into your group, or you can decline them":
                "contains a request from member that reject your request"}</Typography>
            <Divider/>
            <Box sx={{color:themeProfile.default_background}}>
                <Tabs value={tab} onChange={(e,item) => {setTab(item)}} variant="fullWidth" textColor="inherit" TabIndicatorProps={{sx:{backgroundColor:themeProfile.default_background}}}>
                    <Tab value={0} icon={<Badge badgeContent={notificationRequest.length}><Assignment/></Badge>} aria-label="request member"/>
                    <Tab value={1} icon={<Badge badgeContent={notificationReject.length}><AssignmentLateRounded/></Badge>} aria-label="rejected member"/>
                </Tabs>
            </Box>
            <TabPanel targetValue={0} value={tab}>
                <List sx={{maxHeight:"100%",overflowY:"auto"}}>
                    {(tab === 0 && notificationRequest.length > 0 && adapter && group)?
                        <CheckNotifGroupViewRequest notificationRequest={notificationRequest} group={group} theme={themeProfile} adapter={adapter}/>:<Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
                    }
                </List>
            </TabPanel>
            <TabPanel targetValue={1} value={tab}>
                <List sx={{maxHeight:"100%",overflowY:"auto"}}>
                    {(tab === 1 && notificationReject.length > 0 && adapterMember && group)?
                        <CheckNotifGroupViewReject notificationReject={notificationReject} group={group} theme={themeProfile} adapter={adapterMember}/>:<Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
                    }
                </List>
            </TabPanel>
            <Box sx={{margin:"auto",paddingBottom:"20px",display: {sx: "inline-block", md: "none"}}}>
                <IconButton
                    onClick={() => {dispatch(setOpenNotificationGroup(!openNotification))}}
                    sx={{color:"inherit",fontSize:"2rem"}}
                >
                    <ArrowForwardIos sx={{fontSize:"inherit"}}/>
                </IconButton>
            </Box>
        </Drawer>
    )
}