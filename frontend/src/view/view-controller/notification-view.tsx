import { Badge, Divider, Drawer, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { setOpenNotification } from "../../configuration/redux/reducer/notification-reducer";
import { useState } from "react";
import { Assignment, AssignmentLateRounded } from "@mui/icons-material";
import { UserItemListRequest } from "../container/user-list";
import { Router } from "../../data/router-server/router";
import { setGroupPreview, setOpenProfile as groupOpenProfile } from "../../configuration/redux/reducer/group-reducer";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { MemberAdapter } from "../../configuration/adapter/member-adapter";
import { GroupAdapter } from "../../configuration/adapter/group-adapter";
import { setMemberPreview, setOpenProfile as memberOpenProfile} from "../../configuration/redux/reducer/member-reducer";

type NotificationViewForMemberType = {
    adapter?: MemberAdapter
}
export function NotificationViewForMember({adapter}:NotificationViewForMemberType) {
    const [tab,setTab] = useState(0)
    let openNotification = useAppSelector(state => state.notificationReducer.openNotification)
    let notificationRequest = useAppSelector(state => state.notificationReducer.requestListGroup)
    let notificationReject = useAppSelector(state => state.notificationReducer.requestRejectedGroup)
    let theme = useAppSelector(state => state.themeReducer.theme)
    let dispatch = useAppDispatch()
    const onAccept = (id?: string) => {
        if (id && adapter) {
            adapter.sendConfirmGroup({group: id},
                (data) => {
                    if (data)
                        if(data.data)
                            dispatch(setMessage({message:"Group Confirmed",error:false}))
                        else
                            dispatch(setMessage({message:"Can`t Confirm Group",error:true}))
                },
                (error) => {
                    if (error)
                        dispatch(setMessage({message:error,error:true}))
                })
        } else
            dispatch(setMessage({message:"id not found",error:true}))
    }
    const onReject = (id?: string) => {
        if (id && adapter) {
            adapter.sendRejectGroup({group: id},
                (data) => {
                    if (data)
                        if(data.data)
                            dispatch(setMessage({message:"Group Rejected",error:false}))
                        else
                            dispatch(setMessage({message:"Can`t Rejected Group",error:true}))
                },
                (error) => {
                    if (error)
                        dispatch(setMessage({message:error,error:true}))
                })
        } else
            dispatch(setMessage({message:"id not found",error:true}))
    }
    return(
        <Drawer
            anchor="right"
            open={openNotification}
            onClose={() => {dispatch(setOpenNotification(!openNotification))}}
            PaperProps={{sx:{backgroundColor:theme.background_color,color:theme.foreground_color}}}
        >
            <Typography variant="h5" textAlign="center" fontWeight={700}>{tab === 0? "Request Group":"Rejected Group"}</Typography>
            <Typography sx={{maxWidth:"500px",width:"80vw"}} textAlign="center">{tab === 0? "list of request from group to make connection with you contains requests from the group for you so that you can collaborate with them, but you can also decline them":
                "contains a request to enter a group from you that has been rejected, don't worry there is still another chance"}</Typography>
            <Divider/>
            <Tabs value={tab} onChange={(e,item) => {setTab(item)}} variant="fullWidth">
                <Tab value={0} icon={<Badge badgeContent={notificationRequest.length}><Assignment/></Badge>} aria-label="request group"/>
                <Tab value={1} icon={<Badge badgeContent={notificationReject.length}><AssignmentLateRounded/></Badge>} aria-label="rejected group"/>
            </Tabs>
            <Stack>
                {(tab == 0 && notificationRequest.length > 0)?
                    notificationRequest.map(item => (
                        <UserItemListRequest
                            image={(item.avatar)?Router.Public.GROUP_AVATAR.set("name",item.avatar).build():""}
                            username={item.username}
                            onClick={() => {
                                dispatch(setGroupPreview(item))
                                dispatch(groupOpenProfile(true))
                            }}
                            theme={theme}
                            onClickAccept={() => {onAccept(item.id)}}
                            onClickReject={() => {onReject(item.id)}}
                        />
                    )):<Typography>No Item</Typography>
                }
            </Stack>
        </Drawer>
    )
}

type NotificationViewForGroupType = {
    adapter?: GroupAdapter
}
export function NotificationViewForGroup({adapter}:NotificationViewForGroupType) {
    const [tab,setTab] = useState(0)
    let openNotification = useAppSelector(state => state.notificationReducer.openNotification)
    let notificationRequest = useAppSelector(state => state.notificationReducer.requestListMember)
    let notificationReject = useAppSelector(state => state.notificationReducer.requestRejectedMember)
    let theme = useAppSelector(state => state.themeReducer.theme)
    let group = useAppSelector(state => state.groupReducer.group)
    let dispatch = useAppDispatch()
    const onAccept = (id?: string) => {
        if (id && adapter && group) {
            adapter.sendConfirmMember({member:id, group:group.id!},
                (data) => {
                    if (data)
                        if(data.data)
                            dispatch(setMessage({message:"Member Confirmed",error:false}))
                        else
                            dispatch(setMessage({message:"Can`t Confirm Member",error:true}))
                },
                (error) => {
                    if (error)
                        dispatch(setMessage({message:error,error:true}))
                })
        } else
            dispatch(setMessage({message:"id not found",error:true}))
    }
    const onReject = (id?: string) => {
        if (id && adapter && group) {
            adapter.sendRejectMember({member:id, group:group.id!},
                (data) => {
                    if (data)
                        if(data.data)
                            dispatch(setMessage({message:"Member Rejected",error:false}))
                        else
                            dispatch(setMessage({message:"Can`t Rejected Member",error:true}))
                },
                (error) => {
                    if (error)
                        dispatch(setMessage({message:error,error:true}))
                })
        } else
            dispatch(setMessage({message:"id not found",error:true}))
    }
    return(
        <Drawer
            anchor="right"
            open={openNotification}
            onClose={() => {dispatch(setOpenNotification(!openNotification))}}
            PaperProps={{sx:{backgroundColor:theme.background_color,color:theme.foreground_color}}}
        >
            <Typography variant="h5" textAlign="center" fontWeight={700}>{tab === 0? "Request Member":"Rejected Member"}</Typography>
            <Typography sx={{maxWidth:"500px",width:"80vw"}} textAlign="center">{tab === 0? "list of request from members to join into your group, or you can decline them":
                "contains a request from member that reject your request"}</Typography>
            <Divider/>
            <Tabs value={tab} onChange={(e,item) => {setTab(item)}} variant="fullWidth">
                <Tab value={0} icon={<Badge badgeContent={notificationRequest.length}><Assignment/></Badge>} aria-label="request member"/>
                <Tab value={1} icon={<Badge badgeContent={notificationReject.length}><AssignmentLateRounded/></Badge>} aria-label="rejected member"/>
            </Tabs>
            <Stack>
                {(tab == 0)?
                    notificationRequest.map(item => (
                        <UserItemListRequest
                            image={(item.avatar)?Router.Public.GROUP_AVATAR.set("name",item.avatar).build():""}
                            username={item.username}
                            onClick={() => {
                                dispatch(setMemberPreview(item))
                                dispatch(memberOpenProfile(true))
                            }}
                            theme={theme}
                            onClickAccept={() => {onAccept(item.id)}}
                            onClickReject={() => {onReject(item.id)}}
                        />
                    )):<Typography>No Item</Typography>
                }
            </Stack>
        </Drawer>
    )
}