import { Avatar, Button, Stack, SxProps, Theme, Typography } from "@mui/material";
import { Theme as ThemeObj } from "../../model/model";
import { StateThemeUtils, ThemeButton } from "./global";
import React, { MouseEvent } from "react";

interface UserItemListInterface {
    id?: string
    image?: string
    username: string
    onClick: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    theme: ThemeObj
}
export function UserItemList({image,username,onClick,theme,id}: UserItemListInterface) {
    const RenderComp = React.memo<{username:string,theme:ThemeObj,id?:string,image?:string}>((data) => {
        const btnSx = {
            textTransform: "none",
            backgroundColor: data.theme.background_color? data.theme.background_color.substring(0,data.theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
            color: data.theme.foreground_color? data.theme.foreground_color : "black",
            borderBottom: `5px solid ${data.theme.border_color}`,
            borderRadius:0
        } as SxProps<Theme>
        const avatarSx = {
            padding: "1rem"
        } as SxProps<Theme>
        const Image = () => {
            if (data.image) {
                return <Avatar alt={data.username} src={data.image} sx={avatarSx}/>
            } else
                return <Avatar sx={avatarSx}><Typography variant="h4">{data.username.charAt(0)}</Typography></Avatar>
        }
        return(
            <Button id={data.id} onClick={onClick} sx={btnSx}>
                <Stack direction="row" spacing={2} sx={{alignItems:"center",justifyContent:"start",padding:"8px"}}>
                    <Image/>
                    <Typography>{data.username}</Typography>
                </Stack>
            </Button>
        )
    })
    return <RenderComp username={username} theme={theme} id={id} image={image}/>
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
    onClick: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    theme: ThemeObj
    onClickAccept:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    onClickReject:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
}
export function UserItemListRequest({image,username,onClick,theme,onClickAccept,onClickReject,id}: UserItemListRequestInterface) {
    const RenderComp = React.memo<{username:string,theme:ThemeObj,id?:string,image?:string}>((data) => {
        const btnSx = {
            textTransform: "none",
            backgroundColor: data.theme.background_color? data.theme.background_color.substring(0,data.theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
            color: data.theme.foreground_color? data.theme.foreground_color : "black",
            borderBottom: `5px solid ${data.theme.border_color}`,
            borderRadius:0
        } as SxProps<Theme>
        const avatarSx = {
            padding: "1rem"
        } as SxProps<Theme>
        const Image = () => {
            if (data.image) {
                return <Avatar alt={data.username} src={data.image} sx={avatarSx}/>
            } else
                return <Avatar sx={avatarSx}><Typography variant="h4">{data.username.charAt(0)}</Typography></Avatar>
        }
        return(
            <Button id={data.id} onClick={onClick} sx={btnSx}>
                <Stack direction="row" spacing={2} sx={{alignItems:"center",justifyContent:"start",padding:"8px"}}>
                    <Image/>
                    <Stack spacing={1}>
                        <Typography>{data.username}</Typography>
                        <Stack direction="row" spacing={1}>
                            <ThemeButton onClick={onClickAccept} sx={{textTransform:"none"}}
                                state={StateThemeUtils.INFO} themeObj={data.theme} variant="contained">Accept</ThemeButton>
                            <ThemeButton onClick={onClickReject} sx={{textTransform:"none"}}
                                state={StateThemeUtils.DANGER} themeObj={data.theme} variant="contained">Reject</ThemeButton>
                        </Stack>
                    </Stack>
                </Stack>
            </Button>
        )
    })
    return <RenderComp username={username} theme={theme} id={id} image={image}/>
}

interface UserItemListRejectInterface {
    id?: string
    image?: string
    username: string
    onClick: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
    theme: ThemeObj
    onClickDone: ((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)
}
export function UserItemListReject({image,username,onClick,theme,onClickDone,id}: UserItemListRejectInterface) {
    const RenderComp = React.memo<{username:string,theme:ThemeObj,id?:string,image?:string}>((data) => {
        const btnSx = {
            textTransform: "none",
            backgroundColor: data.theme.background_color? data.theme.background_color.substring(0,data.theme.background_color.length-2)+'24' : "rgba(255,255,255,.35)",
            color: data.theme.foreground_color? data.theme.foreground_color : "black",
            borderBottom: `5px solid ${data.theme.border_color}`,
            borderRadius:0
        } as SxProps<Theme>
        const avatarSx = {
            padding: "1rem"
        } as SxProps<Theme>
        const Image = () => {
            if (data.image) {
                return <Avatar alt={data.username} src={data.image} sx={avatarSx}/>
            } else
                return <Avatar sx={avatarSx}><Typography variant="h4">{data.username.charAt(0)}</Typography></Avatar>
        }
        return(
            <Button id={data.id} onClick={onClick} sx={btnSx}>
                <Stack direction="row" spacing={2} sx={{alignItems:"center",justifyContent:"start",padding:"8px"}}>
                    <Image/>
                    <Stack spacing={1}>
                        <Typography>{data.username}</Typography>
                        <Stack direction="row" spacing={1}>
                            <ThemeButton onClick={onClickDone} sx={{textTransform:"none"}}
                                state={StateThemeUtils.INFO} themeObj={data.theme} variant="contained">Ok</ThemeButton>
                        </Stack>
                    </Stack>
                </Stack>
            </Button>
        )
    })
    return <RenderComp username={username} theme={theme} id={id} image={image}/>
}