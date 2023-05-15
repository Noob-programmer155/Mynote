import { ExpandMore, ModeEditOutlineOutlined } from "@mui/icons-material"
import { Avatar, AvatarGroup, Box, Stack, SxProps, Theme, Typography, IconButton, InputAdornment, Accordion, AccordionSummary, AccordionDetails, Paper, Divider, PaperProps } from "@mui/material"
import { ChangeEvent, MouseEvent } from "react"
import { Theme as ThemeObj } from "../../model/model"
import { Group, Member } from "../../model/model"
import { StateThemeUtils, ThemeButton, ThemeTextField } from "./global"
import { Router } from "../../model/data/router-server/router"
import { Role } from "../../model/model-side"

type GroupPreviewType = {
    profile: Group
    otherUsers: Member[] 
    isUpdate:boolean
    isDisable:boolean
    theme: ThemeObj
    paperProps?: PaperProps
    onClickUpdate:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    onClickCancelUpdate:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    data: {username:string,avatar?:string,
        onUsernameChange:(username: ChangeEvent<HTMLInputElement>) => void,
        onChangeAvatar: (file:ChangeEvent<HTMLInputElement>) => void
    },
    dataGroupMemberAuth?: Member //use it for make decision if group member or not or you`re a member or not, if not send button request will appears
    roleGroupMemberAuth?: Role
    onClickSend: (data:{group:string,member:string}) => void
    onClickDelete: (data:{group:string}) => void
}

export function GroupPreview({profile,otherUsers,isUpdate,isDisable,theme,paperProps,onClickCancelUpdate,onClickUpdate,onClickSend,onClickDelete,data,dataGroupMemberAuth,roleGroupMemberAuth}:GroupPreviewType) {
    const mainSx = {
        width: "90vw",
        backgroundColor: theme.background_color? theme.background_color.substring(0,7)+'24' : "rgba(255,255,255,.35)",
        color: theme.foreground_color.substring(0,7)+'24',
        maxWidth: "450px"
    } as SxProps<Theme>
    const Image = (username:string,variantText: "inherit" | "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "overline",
        avatar?:string,avatarSx?: SxProps<Theme>) => {
        if (avatar) {
            return <Avatar alt={username} src={Router.Public.GROUP_AVATAR.set({name:avatar}).build()} sx={{padding: "2rem",...avatarSx}}/>
        } else
            return <Avatar sx={{padding: "2rem",...avatarSx}}><Typography variant={variantText}>{username.charAt(0)}</Typography></Avatar>
    }
    const isUpdateUser = () => {
        if (roleGroupMemberAuth && roleGroupMemberAuth === "MANAGER" && isUpdate)
            return updateProfile(isDisable,theme,onClickUpdate,onClickCancelUpdate)
        else 
            return null
    }
    const isMember = () => {
        if (dataGroupMemberAuth) {
            if (!otherUsers.includes(dataGroupMemberAuth)) {
                return <ThemeButton
                        id="btn-send-member-preview"
                        variant="contained"
                        themeObj={theme}
                        state={StateThemeUtils.INFO}
                        onClick={() => {onClickSend({group:profile.id!,member:dataGroupMemberAuth.id!})}}
                        sx={{textTransform:"none"}}
                    >Join</ThemeButton>
            } else return null
        }
    }
    return(
        <Paper elevation={3} sx={mainSx} {...paperProps}>
            <Stack direction="column" spacing={2} sx={{padding:"10px"}}>
                <Box sx={{margin:"auto !important", paddingTop:"20px"}}>
                    <IconButton id="avatar-member-preview" disabled={!(roleGroupMemberAuth && roleGroupMemberAuth === "MANAGER")} component="label" sx={{padding:"0px"}}>
                        <input hidden accept=".jpg,.png" type="file" onChange={data.onChangeAvatar}/>
                        {Image(profile.username,"h4",profile.avatar)}
                    </IconButton>
                </Box>
                {(roleGroupMemberAuth && roleGroupMemberAuth === "MANAGER")?
                    <>
                        <Typography variant="caption" sx={{color: theme.foreground_color,textAlign:"center"}}>(click avatar to change image)</Typography>
                        <ThemeTextField 
                            id="username-member-preview"
                            variant="standard"
                            placeholder="Username"
                            state={StateThemeUtils.DEFAULT} 
                            themeObj={theme}
                            value={data.username}
                            onChange={data.onUsernameChange}
                            InputProps= {{
                                endAdornment: <InputAdornment position="end" sx={{color:"inherit"}}>
                                        <ModeEditOutlineOutlined sx={{color:"inherit"}}/>
                                    </InputAdornment>
                            }}
                        />
                    </>
                    :<Typography variant="h6" sx={{color: theme.foreground_color,textAlign:"center",fontWeight:700}}>{profile.username}</Typography>}
                <Divider sx={{backgroundColor: theme.foreground_color}}/>
                <Stack direction="row">
                    {
                        <>
                            {(otherUsers && otherUsers.length > 0)?
                                <AvatarGroup total={otherUsers.length} sx={{marginLeft:"auto",'& .MuiAvatarGroup-avatar':{fontSize:".75rem"}}}>
                                    {
                                        otherUsers.slice(0,otherUsers.length > 6?6:otherUsers.length).map(grp => Image(grp.username,"caption",grp.avatar,{padding:0}))
                                    }
                                </AvatarGroup>
                            : <Typography textAlign="center">no groups</Typography>}
                        </>
                    }
                </Stack>
                <Divider sx={{backgroundColor: theme.foreground_color}}/>
                {isMember()}
                {isUpdateUser()}
                {(roleGroupMemberAuth && roleGroupMemberAuth === "MANAGER")?deleteGroup(isDisable,theme,onClickDelete,profile,roleGroupMemberAuth):null}
            </Stack>
        </Paper>
    )
}

type MemberPreview = {
    profile: Member
    otherUsers: Group[]
    isProfile: boolean
    isUpdate?: boolean
    isDisable: boolean
    theme: ThemeObj
    paperProps?: PaperProps
    onClickUpdate?:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    onClickCancelUpdate?:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    data: {username:string,avatar?:string,oldPassword?:string,newPassword?:string,
        onUsernameChange?:(username: ChangeEvent<HTMLInputElement>) => void,
        onChangeAvatar?: (file:ChangeEvent<HTMLInputElement>) => void,
        onPasswordOldChange?:(password: ChangeEvent<HTMLInputElement>) => void,
        onPasswordNewChange?:(password: ChangeEvent<HTMLInputElement>) => void,
        onClickPasswordUpdate?:(event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void,
        onClickViewOtherUser:(groups:Group[]) => void
    },
    onTheme?: (event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void,
    dataGroup?: Group //use it for make decision if group member or not or you`re a member or not, if not send button request will appears
    onClickSend?: (data:{group:string}) => void
    onClickDemoted?: (data:{member:string,group:string}) => void
    onClickPromoted?: (data:{member:string,group:string}) => void
    onClickDeleteMember?: (data:{member:string,group:string}) => void
}

export function MemberPreview({profile,otherUsers,isProfile,isDisable,isUpdate,theme,paperProps,onClickCancelUpdate,onTheme,onClickUpdate,onClickSend,onClickDemoted,
        onClickPromoted,onClickDeleteMember,data,dataGroup}:MemberPreview) {
    const mainSx = {
        width: "90vw",
        backgroundColor: theme.background_color? theme.background_color.substring(0,7)+'24' : "rgba(255,255,255,.35)",
        color: theme.foreground_color.substring(0,7)+'24',
        maxWidth: "450px"
    } as SxProps<Theme>
    const Image = (username:string,variantText: "inherit" | "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "overline",
        avatar?:string,avatarSx?: SxProps<Theme>) => {
        if (avatar) {
            return <Avatar alt={username} src={Router.Public.MEMBER_AVATAR.set({name:avatar}).build()} sx={{padding: "2rem",...avatarSx}}/>
        } else
            return <Avatar sx={{padding: "2rem",...avatarSx}}><Typography variant={variantText}>{username.charAt(0)}</Typography></Avatar>
    }
    const isUpdateUser = () => {
        if (isUpdate && onClickUpdate && onClickCancelUpdate)
            return updateProfile(isDisable,theme,onClickUpdate,onClickCancelUpdate)
        else 
            return null
    }
    const isMember = () => {
        if (dataGroup && dataGroup.roleMember) {
            if (dataGroup.roleMember === ("MANAGER" || "ADMIN")) {
                if(!otherUsers.includes(dataGroup) && onClickSend) {
                    return <ThemeButton
                            id="btn-send-member-preview"
                            variant="contained"
                            themeObj={theme}
                            state={StateThemeUtils.INFO}
                            onClick={() => {onClickSend({group:dataGroup.id!})}}
                            sx={{textTransform:"none"}}
                        >Connect</ThemeButton>
                } else {
                    if(dataGroup.roleMember === "MANAGER") {
                        if (profile.role === "ADMIN" && onClickDemoted) {
                            return <ThemeButton
                                    id="btn-send-member-demoted-preview"
                                    variant="contained"
                                    themeObj={theme}
                                    state={StateThemeUtils.DANGER}
                                    onClick={() => {onClickDemoted({group:dataGroup.id!,member:profile.id!})}}
                                    sx={{textTransform:"none"}}
                                >Demoted</ThemeButton>
                        } else if(profile.role === "MEMBER" && onClickPromoted) {
                            return <ThemeButton
                                    id="btn-send-member-promoted-preview"
                                    variant="contained"
                                    themeObj={theme}
                                    state={StateThemeUtils.INFO}
                                    onClick={() => {onClickPromoted({group:dataGroup.id!,member:profile.id!})}}
                                    sx={{textTransform:"none"}}
                                >Promoted</ThemeButton>
                        } else return null
                    }
                }
            }
        }
    }
    return(
        <Paper elevation={3} sx={mainSx} {...paperProps}>
            <Stack direction="column" spacing={2} sx={{padding:"10px"}}>
                <Box sx={{marginLeft:"auto !important", paddingTop:"20px",display:(isProfile)?"block":"none"}}>
                    <ThemeButton
                        id="avatar-member-preview-themes"
                        sx={{padding:"0px",textTransform:"none"}}
                        themeObj={theme}
                        variant="text"
                        state={StateThemeUtils.INFO}
                        onClick={onTheme}
                    >
                        Want`s to change theme ?, click me
                    </ThemeButton>
                </Box>
                <Box sx={{margin:"auto !important", paddingTop:"20px"}}>
                    <IconButton id="avatar-member-preview" disabled={!isProfile} component="label" sx={{padding:"0px"}}>
                        <input hidden accept=".jpg,.png" type="file" onChange={data.onChangeAvatar}/>
                        {Image(profile.username,"h4",profile.avatar)}
                    </IconButton>
                </Box>
                {(isProfile)?
                    <>
                        <Typography variant="caption" sx={{color: theme.foreground_color,textAlign:"center"}}>(click avatar to change image)</Typography>
                        <ThemeTextField 
                            id="username-member-preview"
                            variant="standard"
                            placeholder="Username"
                            state={StateThemeUtils.DEFAULT} 
                            themeObj={theme}
                            value={data.username}
                            onChange={data.onUsernameChange}
                            InputProps= {{
                                endAdornment: <InputAdornment position="end" sx={{color:"inherit"}}>
                                        <ModeEditOutlineOutlined sx={{color:"inherit"}}/>
                                    </InputAdornment>
                            }}
                        />
                    </>
                    :<Typography variant="h6" sx={{color: theme.foreground_color,textAlign:"center",fontWeight:700}}>{profile.username}</Typography>}
                {(isProfile && data.onPasswordOldChange && data.onPasswordNewChange && data.onClickPasswordUpdate)?
                    modifyPassword(isDisable,theme,data.onPasswordOldChange,data.onPasswordNewChange,data.onClickPasswordUpdate):null}
                <Divider sx={{backgroundColor: theme.foreground_color}}/>
                <Stack direction="row">
                    {
                        <>
                            {(isProfile && otherUsers && otherUsers.length > 0)?<ThemeButton
                                id="btn-password-member-preview"
                                variant="outlined"
                                themeObj={theme}
                                state={StateThemeUtils.INFO}
                                sx={{textTransform:"none"}}
                                onClick={() => {data.onClickViewOtherUser(otherUsers)}}
                            >
                                View
                            </ThemeButton>:null}
                            {(otherUsers && otherUsers.length > 0)?
                                <AvatarGroup total={otherUsers.length} sx={{marginLeft:"auto",'& .MuiAvatarGroup-avatar':{fontSize:".75rem"}}}>
                                    {
                                        otherUsers.slice(0,otherUsers.length > 6?6:otherUsers.length).map(grp => Image(grp.username,"caption",grp.avatar,{padding:0}))
                                    }
                                </AvatarGroup>
                            : <Typography textAlign="center">no groups</Typography>}
                        </>
                    }
                </Stack>
                <Divider sx={{backgroundColor: theme.foreground_color}}/>
                {isMember()}
                {isUpdateUser()}
                {(dataGroup && dataGroup.roleMember === "MANAGER" && onClickDeleteMember)?deleteMember(isDisable,theme,onClickDeleteMember,profile,dataGroup):null}
            </Stack>
        </Paper>
    )
}

const modifyPassword = (
        isDisabled:boolean,
        theme:ThemeObj,
        onChangeOldPassword:(oldPassword: ChangeEvent<HTMLInputElement>) => void,
        onChangeNewPassword:(newPassword: ChangeEvent<HTMLInputElement>) => void,
        onClickUpdate:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)) => (
    <Accordion sx={{backgroundColor:"rgba(255,255,255,.25)"}}>
        <AccordionSummary
            expandIcon={<ExpandMore/>}
        >
            <Stack direction="column">
                <Typography variant="h6" sx={{color: theme.foreground_color, fontWeight: "bold"}}>Update Password?</Typography>
                <Typography variant="caption" sx={{color: theme.foreground_color}}>(click to update)</Typography>
            </Stack>
        </AccordionSummary>
        <AccordionDetails>
            <Stack direction="column" spacing={2}>
                <ThemeTextField
                    id="old-password-member-preview"
                    variant="standard"
                    label="Old Password"
                    themeObj={theme}
                    type="password"
                    state={StateThemeUtils.DEFAULT}
                    onChange={onChangeOldPassword}
                />
                <ThemeTextField
                    id="new-password-member-preview"
                    variant="standard"
                    label="New Password"
                    themeObj={theme}
                    type="password"
                    state={StateThemeUtils.DEFAULT}
                    onChange={onChangeNewPassword}
                />
                <ThemeButton
                    id="btn-password-member-preview"
                    variant="contained"
                    themeObj={theme}
                    disabled={isDisabled}
                    state={StateThemeUtils.DEFAULT}
                    onClick={onClickUpdate}
                    sx={{textTransform:"none"}}
                >
                    Update Password
                </ThemeButton>
            </Stack>
        </AccordionDetails>
    </Accordion>
)

const updateProfile = (isDisabled:boolean,theme:ThemeObj,onClickUpdate:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void),onClickCancel:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)) => (
    <Stack direction="row" spacing={2} sx={{justifyContent:"flex-end"}}>
        <ThemeButton
            id="btn-update-member-preview"
            variant="contained"
            themeObj={theme}
            disabled={isDisabled}
            state={StateThemeUtils.DEFAULT}
            onClick={onClickUpdate}
            sx={{textTransform:"none"}}
        >
            Update Profile
        </ThemeButton>
        <ThemeButton
            id="btn-cancel-update-member-preview"
            variant="contained"
            themeObj={theme}
            state={StateThemeUtils.DANGER}
            onClick={onClickCancel}
            sx={{textTransform:"none"}}
        >
            Cancel
        </ThemeButton>
    </Stack>
)

const deleteGroup = (isDisabled:boolean,theme:ThemeObj,onClickDelete:((data:{group:string}) => void),profile:Group , role: Role) => (
    <Stack direction="row" spacing={2} sx={{justifyContent:"flex-end"}}>
        {
            (role !== "MANAGER")?
                <ThemeButton
                    id="btn-delete-member-group"
                    variant="contained"
                    themeObj={theme}
                    disabled={isDisabled}
                    state={StateThemeUtils.DANGER}
                    onClick={() => {onClickDelete({group:profile.id!})}}
                    sx={{textTransform:"none"}}
                >
                    Delete Group
                </ThemeButton>:null
        }
    </Stack>
)

const deleteMember = (isDisabled:boolean,theme:ThemeObj,onClickDeleteMember:((data:{group:string,member:string}) => void),profile: Member,dataGroup: Group) => (
    <Stack direction="row" spacing={2} sx={{justifyContent:"flex-end"}}>
        {
            (profile.role !== "MANAGER")?
                <ThemeButton
                    id="btn-delete-member-group-member"
                    variant="contained"
                    themeObj={theme}
                    disabled={isDisabled}
                    state={StateThemeUtils.DANGER}
                    onClick={() => {onClickDeleteMember({group:dataGroup.id!,member:profile.id!})}}
                    sx={{textTransform:"none"}}
                >
                    Delete Member
                </ThemeButton>:null
        }
    </Stack>
)