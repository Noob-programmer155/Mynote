import { Backdrop, Card, CardActions, CardContent, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ChangeEvent, MouseEvent } from "react";
import { Theme as ThemeObj } from "../../model/model";
import { StateThemeUtils, ThemeButton, ThemeTextField } from "./global";

interface LoginInterface {
    open: boolean
    onClose: (event?:MouseEvent<HTMLElement,globalThis.MouseEvent>) => void
    onChangeUsername: ((text: ChangeEvent<HTMLInputElement>) => void)
    onChangePassword: ((text: ChangeEvent<HTMLInputElement>) => void)
    onClickLogin: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    onClickSignin: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    theme: ThemeObj
    disableLoginBtn: boolean
    data: {username: string, password: string}
}

export function Login({open, onClose, onChangePassword, onChangeUsername, onClickLogin, disableLoginBtn, onClickSignin, theme, data}: LoginInterface): JSX.Element {
    const cardSx = {
        maxWidth: "400px",
        maxHeight: "100%",
        overflow: "auto",
        width: "90vw",
        backgroundColor: theme.background_color,
        color: theme.foreground_color,
        padding: "20px 0"
    } as SxProps<Theme>
    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, maxHeight:"100vh", overflowY:"auto"}}
            open={open}
            onClick={onClose}
        >
            <Card sx={cardSx} onClick={(e) => {e.stopPropagation()}}>
                <CardContent>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h4" textAlign="center" sx={{color: theme.foreground_color, fontWeight: "bold"}}>Login</Typography>
                        <ThemeTextField
                            id="username-login"
                            variant="standard"
                            label="Username"
                            themeObj={theme}
                            state={StateThemeUtils.DEFAULT}
                            value={data.username}
                            onChange={onChangeUsername}/>
                        <ThemeTextField
                            id="password-login"
                            variant="standard" 
                            label="Password"
                            type="password"
                            themeObj={theme}
                            state={StateThemeUtils.DEFAULT}
                            value={data.password}
                            onChange={onChangePassword}/>
                        <ThemeButton
                            id="btn-to-signin"
                            variant="text" 
                            onClick={onClickSignin} 
                            sx={{margin: "auto", textTransform: "none"}}
                            themeObj={theme}
                            state={StateThemeUtils.INFO}
                        >
                            your are not a member?,come on join us
                        </ThemeButton>
                    </Stack>
                </CardContent>
                <CardActions>
                    <ThemeButton 
                        id="btn-login"
                        variant="contained" 
                        onClick={onClickLogin} 
                        sx={{margin: "auto",textTransform: "none"}}
                        disabled = {disableLoginBtn}
                        themeObj={theme}
                        state={StateThemeUtils.DEFAULT}
                    >
                            <Typography>Login</Typography>
                    </ThemeButton>
                </CardActions>
            </Card>
        </Backdrop>
    )
}