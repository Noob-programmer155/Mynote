import { Avatar, Backdrop, Box, Card, CardActions, CardContent, IconButton, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ChangeEvent, MouseEvent } from "react";
import { Theme as ThemeObj } from "../../model/model";
import { StateThemeUtils, ThemeButton, ThemeTextField } from "./global";

interface SignInMemberInterface {
    open: boolean
    onClose: (event?:MouseEvent<HTMLElement,globalThis.MouseEvent>) => void
    onChangeUsername: ((text: ChangeEvent<HTMLInputElement>) => void)
    onChangePassword: ((text: ChangeEvent<HTMLInputElement>) => void)
    onChangeAvatar: ((text: ChangeEvent<HTMLInputElement>) => void)
    onClickSignIn: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    theme: ThemeObj
    disableSignInBtn: boolean
    errorValidateUsername: boolean
    avatarPreview?: string
    username: string
    password: string
}

export function SignInMember({open, onClose, onChangePassword, onChangeUsername, onChangeAvatar, onClickSignIn, disableSignInBtn, errorValidateUsername, avatarPreview, theme, username, password}: SignInMemberInterface): JSX.Element {
    const cardSx = {
        maxWidth: "400px",
        maxHeight: "100%",
        overflow: "auto",
        width: "90vw",
        backgroundColor: theme.background_color,
        color: theme.foreground_color,
        padding: "20px 0"
    } as SxProps<Theme>
    const avatarSx = {
        padding: "1.4rem"
    } as SxProps<Theme>
    const IsImage = () => {
        if (avatarPreview) {
            return <Avatar alt={username} src={avatarPreview} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h2">{username.charAt(0)}</Typography></Avatar>
    }
    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2, maxHeight:"100vh", overflowY:"auto"}}
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
                            required
                            state={StateThemeUtils.DEFAULT}
                            error={errorValidateUsername}
                            helperText={(errorValidateUsername)?"username already exists":"special character not allowed, except '-'"}
                            value={username}
                            onChange={onChangeUsername}/>
                        <ThemeTextField
                            id="password-signin"
                            variant="standard" 
                            label="Password"
                            type="password"
                            themeObj={theme}
                            required
                            state={StateThemeUtils.DEFAULT}
                            helperText="must be adding"
                            value={password}
                            onChange={onChangePassword}/>
                    </Stack>
                </CardContent>
                <CardActions>
                    <ThemeButton 
                        id="btn-signin"
                        variant="contained" 
                        onClick={onClickSignIn} 
                        sx={{margin: "auto",textTransform:"none"}}
                        themeObj={theme}
                        disabled={disableSignInBtn}
                        state={StateThemeUtils.DEFAULT}
                    >
                            <Typography>Sign In</Typography>
                    </ThemeButton>
                </CardActions>
            </Card>
        </Backdrop>
    )
}

interface SignInGroupInterface {
    open: boolean
    onClose: (event?:MouseEvent<HTMLElement,globalThis.MouseEvent>) => void
    onChangeUsername: ((text: ChangeEvent<HTMLInputElement>) => void)
    onChangeAvatar: ((text: ChangeEvent<HTMLInputElement>) => void)
    onClickCreate: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    theme: ThemeObj
    disableSignInBtn: boolean
    errorValidateUsername: boolean
    avatarPreview?: string
    username: string
}

export function SignInGroup({open, onClose, onChangeUsername, onChangeAvatar, onClickCreate, disableSignInBtn, errorValidateUsername, avatarPreview, theme, username}: SignInGroupInterface): JSX.Element {
    const cardSx = {
        maxWidth: "400px",
        maxHeight: "100%",
        overflow: "auto",
        width: "90vw",
        backgroundColor: theme.background_color,
        color: theme.foreground_color,
        padding: "20px 0"
    } as SxProps<Theme>
    const avatarSx = {
        padding: "1.4rem"
    } as SxProps<Theme>
    const IsImage = () => {
        if (avatarPreview) {
            return <Avatar alt={username} src={avatarPreview} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h2">{username.charAt(0)}</Typography></Avatar>
    }
    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2, maxHeight:"100vh", overflowY:"auto"}}
            open={open}
            onClick={onClose}
        >
            <Card sx={cardSx} onClick={(e) => {e.stopPropagation()}}>
                <CardContent>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h4" textAlign="center" sx={{color: theme.foreground_color, fontWeight: "bold"}}>Create Group</Typography>
                        <Box sx={{margin:"auto !important", paddingTop:"20px"}}>
                            <IconButton id="avatar-signin" component="label" sx={{padding:"0px"}}>
                                <input hidden accept="image/*" type="file" onChange={onChangeAvatar}/>
                                <IsImage/>
                            </IconButton>
                        </Box>
                        <Typography variant="caption" sx={{color: theme.foreground_color,textAlign:"center"}}>(click avatar to change image)</Typography>
                        <ThemeTextField
                            id="username-signin-group"
                            variant="standard"
                            label="Group Name"
                            themeObj={theme}
                            required
                            state={StateThemeUtils.DEFAULT}
                            error={errorValidateUsername}
                            helperText={(errorValidateUsername)?"username already exists":""}
                            value={username}
                            onChange={onChangeUsername}/>
                    </Stack>
                </CardContent>
                <CardActions>
                    <ThemeButton 
                        id="btn-signin"
                        variant="contained" 
                        onClick={onClickCreate} 
                        sx={{margin: "auto", textTransform:"none"}}
                        themeObj={theme}
                        disabled={disableSignInBtn}
                        state={StateThemeUtils.DEFAULT}
                    >
                            <Typography>Create Group</Typography>
                    </ThemeButton>
                </CardActions>
            </Card>
        </Backdrop>
    )
}