import { ExpandMore, ModeEditOutlineOutlined } from "@mui/icons-material"
import { Avatar, AvatarGroup, Box, Stack, SxProps, Theme, Typography, IconButton, InputAdornment, Accordion, AccordionSummary, AccordionDetails, Paper, Divider } from "@mui/material"
import { ChangeEvent } from "react"
import { Theme as ThemeObj } from "../../model/model"
import { Group, Member } from "../../model/model"
import { StateThemeUtils, ThemeButton, ThemeTextField } from "./global"

type UserPreview = {
    profile: Group | Member
    otherUsers: Group[] | Member[]
    isProfile: boolean
    isUpdate:boolean
    theme: ThemeObj
    openUpdateCont: boolean
    onClickUpdate:() => void
    onClickCancelUpdate:() => void
    data: {username:string,avatar:string,oldPassword:string,newPassword:string,
        onUsernameChange:(username: ChangeEvent<HTMLInputElement>) => void,
        onChangeAvatar: (file:ChangeEvent<HTMLInputElement>) => void,
        onPasswordOldChange:(password: ChangeEvent<HTMLInputElement>) => void,
        onPasswordNewChange:(password: ChangeEvent<HTMLInputElement>) => void,
        onClickPasswordUpdate: () => void,
        onClickUser:() => void
    }
}

export function UserPreview({profile,otherUsers,isProfile,isUpdate,theme,openUpdateCont,onClickCancelUpdate,onClickUpdate,data}:UserPreview) {
    let mainSx = {
        width: "95vw",
        background: theme.background_color? theme.background_color.substring(0,theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
        maxWidth: "450px"
    } as SxProps<Theme>
    let Image = (username:string,variantText: "inherit" | "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "overline",
        avatar?:string,avatarSx?: SxProps<Theme>) => {
        if (avatar) {
            return <Avatar alt={username} src={avatar} sx={{padding: "2rem",...avatarSx}}/>
        } else
            return <Avatar sx={{padding: "2rem",...avatarSx}}><Typography variant={variantText}>{username.charAt(0)}</Typography></Avatar>
    }
    let isUpdateUser = () => {
        if (isUpdate && openUpdateCont)
            return updateProfile(theme,onClickUpdate,onClickCancelUpdate)
        else 
            return null
    }
    return(
        <Paper elevation={3} sx={mainSx}>
            <Stack direction="column" spacing={2} sx={{padding:"10px"}}>
                <Box sx={{margin:"auto !important", paddingTop:"20px"}}>
                    <IconButton id="avatar-member-preview" disabled={!isProfile} component="label" sx={{padding:"0px"}}>
                        <input hidden accept="image/*" type="file" onChange={data.onChangeAvatar}/>
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
                            disabled={!isProfile}
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
                {(isProfile)?modifyPassword(theme,data.onPasswordOldChange,data.onPasswordNewChange,data.onClickPasswordUpdate,{oldPassword:data.oldPassword,newPassword:data.newPassword}):null}
                <Divider sx={{backgroundColor: theme.foreground_color}}/>
                <Stack direction="row">
                    {
                        <>
                            {(isProfile)?<ThemeButton
                                id="btn-password-member-preview"
                                variant="outlined"
                                themeObj={theme}
                                state={StateThemeUtils.DEFAULT}
                                sx={{textTransform:"none"}}
                                onClick={data.onClickUser}
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
                {isUpdateUser()}
            </Stack>
        </Paper>
    )
}

const modifyPassword = (
        theme:ThemeObj,
        onChangeOldPassword:(oldPassword: ChangeEvent<HTMLInputElement>) => void,
        onChangeNewPassword:(newPassword: ChangeEvent<HTMLInputElement>) => void,
        onClickUpdate:() => void,
        data:{oldPassword:string,newPassword:string}) => (
    <Accordion sx={{background:"rgba(255,255,255,.25)"}}>
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
                    value={data.oldPassword}
                    onChange={onChangeOldPassword}
                />
                <ThemeTextField
                    id="new-password-member-preview"
                    variant="standard"
                    label="New Password"
                    themeObj={theme}
                    type="password"
                    state={StateThemeUtils.DEFAULT}
                    value={data.newPassword}
                    onChange={onChangeNewPassword}
                />
                <ThemeButton
                    id="btn-password-member-preview"
                    variant="contained"
                    themeObj={theme}
                    state={StateThemeUtils.DEFAULT}
                    onClick={onClickUpdate}
                >
                    Update Password
                </ThemeButton>
            </Stack>
        </AccordionDetails>
    </Accordion>
)

const updateProfile = (theme:ThemeObj,onClickUpdate:() => void,onClickCancel:() => void) => (
    <Stack direction="row" spacing={2} sx={{justifyContent:"flex-end"}}>
        <ThemeButton
            id="btn-update-member-preview"
            variant="contained"
            themeObj={theme}
            state={StateThemeUtils.INFO}
            onClick={onClickUpdate}
        >
            Update Profile
        </ThemeButton>
        <ThemeButton
            id="btn-cancel-update-member-preview"
            variant="contained"
            themeObj={theme}
            state={StateThemeUtils.DANGER}
            onClick={onClickCancel}
        >
            Cancel
        </ThemeButton>
    </Stack>
)