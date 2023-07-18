import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, SxProps, Theme, Typography } from "@mui/material";
import { Theme as ThemeObj } from "../../model/model";
import { StateThemeUtils, ThemeButton } from "./global";
import React, { MouseEvent } from "react";

interface UserItemListInterface {
    id?: string
    image?: string
    role?: string
    username: string
    onClick: () => void
    theme: ThemeObj
}
export function UserItemList({image,username,onClick,theme,id,role}: UserItemListInterface) {
    const btnSx = {
        textTransform: "none",
        backgroundColor: theme.background_color? theme.background_color.substring(0,theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
        color: theme.foreground_color? theme.foreground_color : "black",
        borderBottom: `2px solid ${theme.border_color}`,
        borderRadius:0
    } as SxProps<Theme>
    const avatarSx = {
        padding: "1rem"
    } as SxProps<Theme>
    const Image = () => {
        if (image) {
            return <Avatar alt={username} src={image} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h4">{username.charAt(0)}</Typography></Avatar>
    }
    return(
        <ListItem sx={{padding:"0px"}}>
            <ListItemButton id={id} onClick={onClick} sx={btnSx}>
                <ListItemAvatar>
                    <Image/>
                </ListItemAvatar>
                <ListItemText primary={username} secondary={role} 
                    sx={{textAlign:"center",
                        '.MuiListItemText-secondary':{
                            color:(role)?((role === "MANAGER")?theme.info_background:(role === "ADMIN")?theme.default_background:theme.foreground_color):theme.foreground_color
                        }}}/>
            </ListItemButton>
        </ListItem>
    )
}

// interface UserItemListSendInterface {
//     id?: string
//     image?: string
//     username: string
//     onClick: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
//     theme: ThemeObj
//     onClickSend: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
// }
// export function UserItemListSend({image,username,onClick,theme,onClickSend,id}: UserItemListSendInterface) {
//     let btnSx = {
//         textTransform: "none",
//         background: theme.background_color? theme.background_color.substring(0,theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
//         color: theme.foreground_color? theme.foreground_color : "black",
//         borderBottom: `5px solid ${theme.border_color}`,
//         borderRadius:0
//     } as SxProps<Theme>
//     let avatarSx = {
//         padding: "1rem"
//     } as SxProps<Theme>
//     let Image = () => {
//         if (image) {
//             return <Avatar alt={username} src={image} sx={avatarSx}/>
//         } else
//             return <Avatar sx={avatarSx}><Typography variant="h4">{username.charAt(0)}</Typography></Avatar>
//     }
//     return(
//         <Button id={id} onClick={onClick} sx={btnSx}>
//             <Stack direction="row" spacing={2} sx={{alignItems:"center",justifyContent:"start",padding:"8px"}}>
//                 <Image/>
//                 <Stack spacing={1}>
//                     <Typography>{username}</Typography>
//                     <Stack direction="row" spacing={1}>
//                         <ThemeButton onClick={onClickSend}
//                             state={StateThemeUtils.DEFAULT} themeObj={theme} variant="contained">Send</ThemeButton>
//                     </Stack>
//                 </Stack>
//             </Stack>
//         </Button>
//     )
// }

interface UserItemListRequestInterface {
    id?: string
    image?: string
    username: string
    onClick: () => void
    theme: ThemeObj
    notificationFrom: boolean
    onClickAccept?:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    onClickReject?:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
}
export function UserItemListRequest({image,username,onClick,theme,notificationFrom,onClickAccept,onClickReject,id}: UserItemListRequestInterface) {
    const btnSx = {
        textTransform: "none",
        backgroundColor: theme.background_color? theme.background_color.substring(0,theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
        color: theme.foreground_color? theme.foreground_color : "black",
        borderBottom: `5px solid ${theme.border_color}`,
        zIndex:1,
        borderRadius:0
    } as SxProps<Theme>
    const avatarSx = {
        padding: "1rem"
    } as SxProps<Theme>
    const Image = () => {
        if (image) {
            return <Avatar alt={username} src={image} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h4">{username.charAt(0)}</Typography></Avatar>
    }
    return(
        <ListItemButton id={id} onClick={onClick} sx={btnSx}>
            <ListItemAvatar>
                <Image/>
            </ListItemAvatar>
            <Stack spacing={1} sx={{justifyContent:"center",alignItems:"center",width:"100%"}}>
                <Typography>{username}</Typography>
                {(onClickAccept && onClickReject)?
                    ((!notificationFrom)?
                    <Stack direction="row" spacing={1}>
                        <ThemeButton onClick={(event) => {event.stopPropagation();onClickAccept(event)}} sx={{textTransform:"none",zIndex:2}}
                            state={StateThemeUtils.INFO} themeObj={theme} variant="contained">Accept</ThemeButton>
                        <ThemeButton onClick={(event) => {event.stopPropagation();onClickReject(event)}} sx={{textTransform:"none",zIndex:2}}
                            state={StateThemeUtils.DANGER} themeObj={theme} variant="contained">Reject</ThemeButton>
                    </Stack>:<Typography variant="body2" sx={{fontStyle:"italic"}}>waiting for replied...</Typography>):null
                }
            </Stack>
        </ListItemButton>
    )
}

interface UserItemListRejectInterface {
    id?: string
    image?: string
    username: string
    onClick: () => void
    theme: ThemeObj
    onClickDone: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
}
export function UserItemListReject({image,username,onClick,theme,onClickDone,id}: UserItemListRejectInterface) {
    const btnSx = {
        textTransform: "none",
        backgroundColor: theme.background_color? theme.background_color.substring(0,theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
        color: theme.foreground_color? theme.foreground_color : "black",
        borderBottom: `5px solid ${theme.border_color}`,
        borderRadius:0
    } as SxProps<Theme>
    const avatarSx = {
        padding: "1rem"
    } as SxProps<Theme>
    const Image = () => {
        if (image) {
            return <Avatar alt={username} src={image} sx={avatarSx}/>
        } else
            return <Avatar sx={avatarSx}><Typography variant="h4">{username.charAt(0)}</Typography></Avatar>
    }
    return(
        <ListItemButton id={id} onClick={onClick} sx={btnSx}>
            <ListItemAvatar>
                <Image/>
            </ListItemAvatar>
            <Stack spacing={1} sx={{justifyContent:"center",alignItems:"center",width:"100%"}}>
                <Typography>{username}</Typography>
                <Stack direction="row" spacing={1}>
                    <ThemeButton onClick={(event) => {event.stopPropagation();onClickDone(event)}} sx={{textTransform:"none"}}
                        state={StateThemeUtils.INFO} themeObj={theme} variant="contained">Ok</ThemeButton>
                </Stack>
            </Stack>
        </ListItemButton>
    )
}