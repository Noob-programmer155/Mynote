import { Badge, Box, Divider, Drawer, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { setOpenNotificationMember, setOpenNotificationGroup, setRequestListGroup, setRequestRejectedGroup, setRequestListMember, setRequestRejectedMember } from "../../configuration/redux/reducer/notification-reducer";
import { useEffect, useState } from "react";
import { ArrowForwardIos, Assignment, AssignmentLateRounded } from "@mui/icons-material";
import { UserItemListReject, UserItemListRequest } from "../container/user-list";
import { Router } from "../../model/data/router-server/router";
import { setGroupPreview, setOpenProfile as groupOpenProfile } from "../../configuration/redux/reducer/group-reducer";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { MemberAdapter } from "../../adapter/member-adapter";
import { GroupAdapter } from "../../adapter/group-adapter";
import { TabPanel } from "../container/global";
import { setMemberPreview, setOpenProfile as memberOpenProfile } from "../../configuration/redux/reducer/member-reducer";
import { Subscription, exhaustMap, interval, of, startWith, tap } from "rxjs";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import { Group, Member } from "../../model/model";
import { setGroupsProfiles } from "../../configuration/redux/reducer/profile-reducer";

type NotificationViewForMemberType = {
    adapter?: MemberAdapter
}
export function NotificationViewForMember({adapter}:NotificationViewForMemberType) {
    const [tab,setTab] = useState(0)
    const openNotification = useAppSelector(state => state.notificationReducer.openNotificationMember)
    const notificationRequest = useAppSelector(state => state.notificationReducer.requestListGroup)
    const notificationReject = useAppSelector(state => state.notificationReducer.requestRejectedGroup)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const groupProfiles = useAppSelector(state => state.profileReducer.groups)
    const dispatch = useAppDispatch()
    const streamObj = interval(12000).pipe(
        startWith(0),
        exhaustMap((i) => {
            if (adapter) {
                adapter.getAllGroupQueue({page:0,size:20},
                    (groups) => {if (groups.length > 0) dispatch(setRequestListGroup(groups))},
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                adapter.getAllGroupRejected({page:0,size:20},
                    (groups) => {if (groups.length > 0) dispatch(setRequestRejectedGroup(groups))},
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }
            return of({})
        }))
    
    useEffect(() => {
        if(!profile || profile && !profile.id) return;
        let subs = streamObj.subscribe()
        return () => subs.unsubscribe()
    },[profile])
    const onAccept = (event: EventTarget & HTMLButtonElement,group?: Group) => {
        of({}).pipe(
            tap(() => {event.disabled = true}),
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
            }),
            tap(() => {event.disabled = false})
        ).subscribe()
    }
    const onReject = (event: EventTarget & HTMLButtonElement,group?: Group) => {
        of({}).pipe(
            tap(() => {event.disabled = true}),
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
            }),
            tap(() => {event.disabled = false})
        ).subscribe()
    }
    const onDoneReject = (event: EventTarget & HTMLButtonElement,group?: Group) => {
        of({}).pipe(
            tap(() => {event.disabled = true}),
            exhaustMap(async() => {
                if (group && adapter) {
                    await adapter.deleteGroup({group: group.id!},
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
            }),
            tap(() => {event.disabled = false})
        ).subscribe()
    }
    return(
        <Drawer
            anchor="right"
            open={openNotification}
            onClose={() => {dispatch(setOpenNotificationMember(!openNotification))}}
            PaperProps={{sx:{backgroundColor:profile!.theme!.background_color,color:profile!.theme!.foreground_color}}}
        >
            <Typography variant="h5" textAlign="center" fontWeight={700}>{tab === 0? "Request Group":"Rejected Group"}</Typography>
            <Typography sx={{maxWidth:"500px",width:"80vw"}} textAlign="center">{tab === 0? "list of request from group to make connection with you contains requests from the group for you so that you can collaborate with them, but you can also decline them":
                "contains a request to enter a group from you that has been rejected, don't worry there is still another chance"}</Typography>
            <Divider/>
            <Box sx={{color:profile!.theme!.default_background}}>
                <Tabs value={tab} onChange={(e,item) => {setTab(item)}} variant="fullWidth" textColor="inherit" TabIndicatorProps={{sx:{backgroundColor:profile!.theme!.default_background}}}>
                    <Tab value={0} icon={<Badge badgeContent={notificationRequest.length}><Assignment/></Badge>} aria-label="request group"/>
                    <Tab value={1} icon={<Badge badgeContent={notificationReject.length}><AssignmentLateRounded/></Badge>} aria-label="rejected group"/>
                </Tabs>
            </Box>
            <TabPanel targetValue={0} value={tab}>
                <Stack sx={{maxHeight:"100%",overflowY:"auto"}}>
                    {(tab === 0 && notificationRequest.length > 0)?
                        notificationRequest.map((item,i) => (
                            <UserItemListRequest
                                id={item.username+i}
                                image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                                username={item.username}
                                onClick={() => {
                                    dispatch(setGroupPreview(item))
                                    dispatch(groupOpenProfile(true))
                                }}
                                theme={profile!.theme!}
                                onClickAccept={(event) => {dispatch(setMessage({message:"Are you sure to accept it ?",error:false,
                                    isOptional:{onClickOk: () => {onAccept(event!.currentTarget,item)}}}))}}
                                onClickReject={(event) => {dispatch(setMessage({message:"Are you sure to reject it ?",error:false,
                                    isOptional:{onClickOk: () => {onReject(event!.currentTarget,item)}}}))}}
                            />
                        )):<Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
                    }
                </Stack>
            </TabPanel>
            <TabPanel targetValue={1} value={tab}>
                <Stack sx={{maxHeight:"100%",overflowY:"auto"}}>
                    {(tab === 1 && notificationReject.length > 0)?
                        notificationReject.map((item,i) => (
                            <UserItemListReject
                                id={item.username+i}
                                image={(item.avatar)?Router.Public.GROUP_AVATAR.set({name:item.avatar}).build():""}
                                username={item.username}
                                onClick={() => {
                                    dispatch(setGroupPreview(item))
                                    dispatch(groupOpenProfile(true))
                                }}
                                theme={profile!.theme!}
                                onClickDone={(event) => {onDoneReject(event!.currentTarget,item)}}
                            />
                        )):<Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
                    }
                </Stack>
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
}
export function NotificationViewForGroup({adapter}:NotificationViewForGroupType) {
    const [tab,setTab] = useState(0)
    const openNotification = useAppSelector(state => state.notificationReducer.openNotificationGroup)
    const notificationRequest = useAppSelector(state => state.notificationReducer.requestListMember)
    const notificationReject = useAppSelector(state => state.notificationReducer.requestRejectedMember)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const group = useAppSelector(state => state.profileReducer.group)
    const dispatch = useAppDispatch()
    const streamObj = interval(12000).pipe(
        startWith(0),
        exhaustMap((i) => {
            if (adapter && group) {
                adapter.getAllMemberQueue({group:group.id!,page:0,size:20},
                    (members) => {if (members.length > 0) dispatch(setRequestListMember(members))},
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                adapter.getAllRejectedRequestQueue({group:group.id!,page:0,size:20},
                    (members) => {if (members.length > 0) dispatch(setRequestRejectedMember(members))},
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }
            return of({})
        }))

    useEffect(() => {
        if(!profile || profile && !profile.id) return;
        let subs = streamObj.subscribe()
        return () => subs.unsubscribe()
    },[profile])
    const onAccept = (event: EventTarget & HTMLButtonElement,member?: Member) => {
        of({}).pipe(
            tap(() => {event.disabled = true}),
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
            }),
            tap(() => {event.disabled = false})
        ).subscribe()
    }
    const onReject = (event: EventTarget & HTMLButtonElement,member?: Member) => {
        of({}).pipe(
            tap(() => {event.disabled = true}),
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
            }),
            tap(() => {event.disabled = false})
        ).subscribe()
    }
    const onDoneReject = (event: EventTarget & HTMLButtonElement,member?: Member) => {
        of({}).pipe(
            tap(() => {event.disabled = true}),
            exhaustMap(async() => {
                if (member && adapter && group) {
                    await adapter.removeMember({member:member.id!, group:group.id!},
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
            }),
            tap(() => {event.disabled = false})
        ).subscribe()
    }
    return(
        <Drawer
            anchor="right"
            open={openNotification}
            onClose={() => {dispatch(setOpenNotificationGroup(!openNotification))}}
            PaperProps={{sx:{backgroundColor:profile!.theme!.background_color,color:profile!.theme!.foreground_color}}}
        >
            <Typography variant="h5" textAlign="center" fontWeight={700}>{tab === 0? "Request Member":"Rejected Member"}</Typography>
            <Typography sx={{maxWidth:"500px",width:"80vw"}} textAlign="center">{tab === 0? "list of request from members to join into your group, or you can decline them":
                "contains a request from member that reject your request"}</Typography>
            <Divider/>
            <Box sx={{color:profile!.theme!.default_background}}>
                <Tabs value={tab} onChange={(e,item) => {setTab(item)}} variant="fullWidth" textColor="inherit" TabIndicatorProps={{sx:{backgroundColor:profile!.theme!.default_background}}}>
                    <Tab value={0} icon={<Badge badgeContent={notificationRequest.length}><Assignment/></Badge>} aria-label="request member"/>
                    <Tab value={1} icon={<Badge badgeContent={notificationReject.length}><AssignmentLateRounded/></Badge>} aria-label="rejected member"/>
                </Tabs>
            </Box>
            <TabPanel targetValue={0} value={tab}>
                <Stack sx={{maxHeight:"100%",overflowY:"auto"}}>
                    {(tab === 0 && notificationRequest.length > 0)?
                        notificationRequest.map((item,i) => (
                            <UserItemListRequest
                                id={item.username+i}
                                image={(item.avatar)?Router.Public.MEMBER_AVATAR.set({name:item.avatar}).build():""}
                                username={item.username}
                                onClick={() => {
                                    dispatch(setMemberPreview(item))
                                    dispatch(memberOpenProfile(true))
                                }}
                                theme={profile!.theme!}
                                onClickAccept={(event) => {dispatch(setMessage({message:"Are you sure to accept it ?",error:false,
                                    isOptional:{onClickOk: () => {onAccept(event!.currentTarget,item)}}}))}}
                                onClickReject={(event) => {dispatch(setMessage({message:"Are you sure to reject it ?",error:false,
                                    isOptional:{onClickOk: () => {onReject(event!.currentTarget,item)}}}))}}
                            />
                        )):<Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
                    }
                </Stack>
            </TabPanel>
            <TabPanel targetValue={1} value={tab}>
                <Stack sx={{maxHeight:"100%",overflowY:"auto"}}>
                    {(tab === 1 && notificationReject.length > 0)?
                        notificationReject.map((item,i) => (
                            <UserItemListReject
                                id={item.username+i}
                                image={(item.avatar)?Router.Public.MEMBER_AVATAR.set({name:item.avatar}).build():""}
                                username={item.username}
                                onClick={() => {
                                    dispatch(setMemberPreview(item))
                                    dispatch(memberOpenProfile(true))
                                }}
                                theme={profile!.theme!}
                                onClickDone={(event) => {onDoneReject(event!.currentTarget,item)}}
                            />
                        )):<Typography textAlign="center" variant="h6" sx={{marginTop:"10px"}}>No Item</Typography>
                    }
                </Stack>
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