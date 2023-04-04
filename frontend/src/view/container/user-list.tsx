import { Avatar, Button, Stack, SxProps, Theme, Typography } from "@mui/material";
import { Theme as ThemeObj } from "../../model/model";
import { StateThemeUtils, ThemeButton } from "./global";

interface UserItemListInterface {
    image?: string
    username: string
    onClick: () => void
    theme: ThemeObj
}
export function UserItemList({image,username,onClick,theme}: UserItemListInterface) {
    let btnSx = {
        textTransform: "none",
        background: theme.background_color? theme.background_color.substring(0,theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
        color: theme.foreground_color? theme.foreground_color : "black",
        borderBottom: `5px solid ${theme.border_color}`,
        borderRadius:0
    } as SxProps<Theme>
    let avatarSx = {
        padding: "1rem"
    } as SxProps<Theme>
    let Image = () => {
        if (image) {
            return <Avatar alt={username} src={image} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h4">{username.charAt(0)}</Typography></Avatar>
    }
    return(
        <Button onClick={onClick} sx={btnSx}>
            <Stack direction="row" spacing={2} sx={{alignItems:"center",justifyContent:"start",padding:"8px"}}>
                <Image/>
                <Typography>{username}</Typography>
            </Stack>
        </Button>
    )
}

interface UserItemListRequestInterface {
    image?: string
    username: string
    onClick: () => void
    theme: ThemeObj
    onClickAccept: () => void
    onClickReject: () => void
}
export function UserItemListRequest({image,username,onClick,theme,onClickAccept,onClickReject}: UserItemListRequestInterface) {
    let btnSx = {
        textTransform: "none",
        background: theme.background_color? theme.background_color.substring(0,theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
        color: theme.foreground_color? theme.foreground_color : "black",
        borderBottom: `5px solid ${theme.border_color}`,
        borderRadius:0
    } as SxProps<Theme>
    let avatarSx = {
        padding: "1rem"
    } as SxProps<Theme>
    let Image = () => {
        if (image) {
            return <Avatar alt={username} src={image} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h4">{username.charAt(0)}</Typography></Avatar>
    }
    return(
        <Button onClick={onClick} sx={btnSx}>
            <Stack direction="row" spacing={2} sx={{alignItems:"center",justifyContent:"start",padding:"8px"}}>
                <Image/>
                <Stack spacing={1}>
                    <Typography>{username}</Typography>
                    <Stack direction="row" spacing={1}>
                        <ThemeButton onClick={onClickAccept}
                            state={StateThemeUtils.INFO} themeObj={theme} variant="contained">Accept</ThemeButton>
                        <ThemeButton onClick={onClickReject}
                            state={StateThemeUtils.DANGER} themeObj={theme} variant="contained">Reject</ThemeButton>
                    </Stack>
                </Stack>
            </Stack>
        </Button>
    )
}

interface UserItemListRejectInterface {
    image?: string
    username: string
    onClick: () => void
    theme: ThemeObj
    onClickDone: () => void
}
export function UserItemListReject({image,username,onClick,theme,onClickDone}: UserItemListRejectInterface) {
    let btnSx = {
        textTransform: "none",
        background: theme.background_color? theme.background_color.substring(0,theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
        color: theme.foreground_color? theme.foreground_color : "black",
        borderBottom: `5px solid ${theme.border_color}`,
        borderRadius:0
    } as SxProps<Theme>
    let avatarSx = {
        padding: "1rem"
    } as SxProps<Theme>
    let Image = () => {
        if (image) {
            return <Avatar alt={username} src={image} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h4">{username.charAt(0)}</Typography></Avatar>
    }
    return(
        <Button onClick={onClick} sx={btnSx}>
            <Stack direction="row" spacing={2} sx={{alignItems:"center",justifyContent:"start",padding:"8px"}}>
                <Image/>
                <Stack spacing={1}>
                    <Typography>{username}</Typography>
                    <Stack direction="row" spacing={1}>
                        <ThemeButton onClick={onClickDone}
                            state={StateThemeUtils.DEFAULT} themeObj={theme} variant="contained">Ok</ThemeButton>
                    </Stack>
                </Stack>
            </Stack>
        </Button>
    )
}