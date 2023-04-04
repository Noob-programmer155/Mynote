import { Backdrop, Card, CardActions, CardContent, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { Theme as ThemeObj } from "../../model/model";
import { StateThemeUtils, ThemeButton, ThemeTextField } from "./global";

interface LoginInterface {
    open: boolean
    onClose: () => void
    onChangeUsername: (text: ChangeEvent<HTMLInputElement>) => void
    onChangePassword: (text: ChangeEvent<HTMLInputElement>) => void
    onClickLogin: () => void
    onClickSignin: () => void
    theme: ThemeObj
    data: {username: string, password: string}
}

export function Login({open, onClose, onChangePassword, onChangeUsername, onClickLogin, onClickSignin, theme, data}: LoginInterface): JSX.Element {
    let cardSx = {
        maxWidth: "400px",
        width: "90vw",
        background: "white",
        padding: "20px 0"
    } as SxProps<Theme>
    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
                            state={StateThemeUtils.DEFAULT}
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
                        sx={{margin: "auto"}}
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