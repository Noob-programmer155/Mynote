import { Avatar, Backdrop, Box, Card, CardActions, CardContent, IconButton, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { Theme as ThemeObj } from "../../model/model";
import { StateThemeUtils, ThemeButton, ThemeTextField } from "./global";

interface SignInInterface {
    open: boolean
    onClose: () => void
    onChangeUsername: (text: ChangeEvent<HTMLInputElement>) => void
    onChangePassword: (text: ChangeEvent<HTMLInputElement>) => void
    onChangeAvatar: (text: ChangeEvent<HTMLInputElement>) => void
    onClickSignIn: () => void,
    theme: ThemeObj
    avatarPreview: {alt: string, src?: string}
    data: {username: string, password: string}
}

export function SignIn({open, onClose, onChangePassword, onChangeUsername, onChangeAvatar, onClickSignIn, avatarPreview, theme, data}: SignInInterface): JSX.Element {
    let cardSx = {
        maxWidth: "400px",
        width: "90vw",
        background: "white",
        padding: "20px 0"
    } as SxProps<Theme>
    let avatarSx = {
        padding: "1.4rem"
    } as SxProps<Theme>
    let IsImage = () => {
        if (avatarPreview.src) {
            return <Avatar alt={avatarPreview.alt} src={avatarPreview?.src} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h2">{avatarPreview.alt.charAt(0)}</Typography></Avatar>
    }
    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={onClose}
        >
            <Card sx={cardSx} onClick={(e) => {e.stopPropagation()}}>
                <CardContent>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h4" textAlign="center" sx={{color: theme.foreground_color, fontWeight: "bold"}}>Sign In</Typography>
                        <Box sx={{margin:"auto !important", paddingTop:"20px"}}>
                            <IconButton id="avatar-signin" component="label" sx={{padding:"0px"}}>
                                <input hidden accept="image/*" type="file" onChange={onChangeAvatar}/>
                                <IsImage/>
                            </IconButton>
                        </Box>
                        <Typography variant="caption" sx={{color: theme.foreground_color,textAlign:"center"}}>(click avatar to change image)</Typography>
                        <ThemeTextField
                            id="username-signin"
                            variant="standard"
                            label="Username"
                            themeObj={theme}
                            state={StateThemeUtils.DEFAULT}
                            value={data.username}
                            onChange={onChangeUsername}/>
                        <ThemeTextField
                            id="password-signin"
                            variant="standard" 
                            label="Password"
                            type="password"
                            themeObj={theme}
                            state={StateThemeUtils.DEFAULT}
                            value={data.password}
                            onChange={onChangePassword}/>
                    </Stack>
                </CardContent>
                <CardActions>
                    <ThemeButton 
                        id="btn-signin"
                        variant="contained" 
                        onClick={onClickSignIn} 
                        sx={{margin: "auto"}}
                        themeObj={theme}
                        state={StateThemeUtils.DEFAULT}
                    >
                            <Typography>Sign In</Typography>
                    </ThemeButton>
                </CardActions>
            </Card>
        </Backdrop>
    )
}