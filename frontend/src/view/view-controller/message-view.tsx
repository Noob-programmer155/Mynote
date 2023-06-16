import { useEffect, useState } from "react"
import { useAppSelector } from "../../configuration/redux/hooks"
import { Message } from "../../configuration/redux/reducer/message-response-reducer"
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material"
import { Theme } from "../../model/model"
import { StateThemeUtils, ThemeButton } from "../container/global"

export function MessageView() {
    const [messages,setMessages] = useState<Message[]>([])
    const message = useAppSelector(state => state.messageRespon.message)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)

    useEffect(() => {
        setMessages((m) => [...m,message])
    },[message])

    const onDelete = (data: Message) => {
        setMessages(messages.filter(item => item !== data))
    }
    return(
        <>
            {messages.map((data,i) => (
                    (data.message)?
                        <MessageContainer
                            key={`key-message-container-${i}`}
                            data={data}
                            theme={themeProfile}
                            onDelete={onDelete}
                        />:null
                ))
            }
        </>    
    ) 
}

interface MessageContainerInterface {
    data: Message
    theme: Theme
    onDelete: (data: Message) => void
}
function MessageContainer({data,theme,onDelete}:MessageContainerInterface) {
    const[open,setOpen] = useState(true)
    if (data.isOptional) {
        return(
            <Dialog
                open={open}
                onClose={() => {setOpen(false)}}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 20,backgroundColor:theme.background_color,color:theme.foreground_color}}
            >
                <DialogTitle>{(data.isOptional.title)?data.isOptional.title:"Information"}</DialogTitle>
                <DialogContent><DialogContentText>{data.message}</DialogContentText></DialogContent>
                <DialogActions>
                    <ThemeButton
                        variant="text"
                        themeObj={theme}
                        state={StateThemeUtils.INFO}
                        onClick={(event) => {event.stopPropagation();data.isOptional!.onClickOk();onDelete(data);setOpen(false)}}
                    >Ok</ThemeButton>
                </DialogActions>
            </Dialog>
        )
    }
    else
        return(
            <Snackbar open={open} anchorOrigin={{horizontal:"center",vertical:"top"}} autoHideDuration={6000} onClose={() => {setOpen(false);onDelete(data)}} sx={{zIndex:(theme) => theme.zIndex.drawer + 21}}>
                <Alert onClose={() => {setOpen(false);onDelete(data)}} severity={(data.error)?"error":"success"} sx={{width: '100%'}}>
                    {data.message}
                </Alert>
            </Snackbar>
        )
}