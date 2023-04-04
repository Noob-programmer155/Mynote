import { AppBar, Avatar, Badge, IconButton, Stack, SxProps, Theme, Toolbar, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { Notifications } from "@mui/icons-material";
import { Router } from "../../data/router-server/router";
import { setOpenProfile } from "../../configuration/redux/reducer/profile-reducer";
import { setOpenNotification } from "../../configuration/redux/reducer/notification-reducer";
import { StateThemeUtils, ThemeButton } from "../container/global";

export default function HeaderView() {
    let theme = useAppSelector(state => state.themeReducer.theme)
    let profile = useAppSelector(state => state.profileReducer.profile)
    let notifCount1 = useAppSelector(state => state.notificationReducer.requestListGroup)
    let notifCount2 = useAppSelector(state => state.notificationReducer.requestRejectedGroup)
    let dispatch = useAppDispatch()
    let avatarSx = {
        padding: "5px"
    } as SxProps<Theme>
    let Image = () => {
        if (profile) {
            if (profile.avatar) {
                return <Avatar alt={profile.username} src={Router.Public.MEMBER_AVATAR.set("name",profile.avatar).build()} sx={avatarSx}/>
            } else
                return <Avatar sx={avatarSx}><Typography variant="h6">{profile.username.charAt(0)}</Typography></Avatar>
        } else return null
    }
    return(
        <AppBar position="fixed" sx={{backgroundColor: theme.foreground_color}}>
            <Toolbar>
                <Typography variant="h5" sx={{fontWeight:700}}>MyNote X</Typography>
                <Stack sx={{ marginLeft:"auto" }} direction="row" spacing={2}>
                    <IconButton
                        onClick={() => {dispatch(setOpenNotification(true))}}
                        sx={{color:"inherit"}}
                    >
                        <Badge badgeContent={notifCount1.length+notifCount2.length}>
                            <Notifications/>
                        </Badge>
                    </IconButton>
                    {(profile)? 
                        <IconButton
                            onClick={() => {dispatch(setOpenProfile(true))}}
                            sx={{color:"inherit"}}
                        >
                            <Image/>
                        </IconButton>:<ThemeButton themeObj={theme} state={StateThemeUtils.DEFAULT} variant="outlined" sx={{textTransform:"none"}}>Sign in</ThemeButton>
                    }
                </Stack>
            </Toolbar>
        </AppBar>
    )
}