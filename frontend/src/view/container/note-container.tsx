import { Button, Card, CardActions, CardContent, CardProps, Chip, Collapse, IconButton, InputAdornment, InputBase, Menu, Popover, Stack, SxProps, Theme, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { DateConverter } from "../../adapter/converter/attribute";
import { Theme as ThemeObj,NoteCollab, NotePrivate, Subtype } from "../../model/model";
import { StateThemeUtils, TextFieldWithChip, ThemeButton, ThemeTextField } from "./global";
import { Delete, Palette, TurnedInRounded } from "@mui/icons-material";
import { SketchPicker } from "react-color";

interface NoteHeaderInterface {
    noteUpdate?: NoteCollab | NotePrivate
    onChangeTitle?: ((text: ChangeEvent<HTMLInputElement>) => void)
    onChangeCategory?: ((text: ChangeEvent<HTMLInputElement>) => void)
    onClickTrigger?: () => void
}
function NoteHeader({noteUpdate,onChangeTitle,onChangeCategory,onClickTrigger}:NoteHeaderInterface) {
    return(
        <>
            {(noteUpdate)?
                <Stack>
                    {('subtype' in noteUpdate)?
                        <Typography sx={{fontSize:".8rem"}}>{(noteUpdate as NoteCollab).subtype.name}</Typography>:
                        <InputBase
                            sx={{color:"inherit"}}
                            value={(noteUpdate as NotePrivate).category}
                            placeholder="Category"
                            onChange={onChangeCategory}
                            onClick={onClickTrigger}
                            inputProps={{style:{fontSize:".8rem"}}}
                        />
                    }
                    <Box onClick={(event) => {event.stopPropagation()}}>
                        <InputBase
                            sx={{color:"inherit"}}
                            value={noteUpdate.title}
                            onChange={onChangeTitle}
                            onClick={onClickTrigger}
                            multiline
                            minRows={1}
                            inputProps={{style:{fontSize:"2rem",fontWeight:700}}}
                        />
                    </Box>
                </Stack>:<></>
            }
        </>
    )
}

interface NoteBodyInterface {
    theme: ThemeObj,
    noteUpdate?: NoteCollab | NotePrivate
    keynoteText?: string
    onChangeDescription?: (text: ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => void
    onChangeKeynotes?: (text: ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => void
    onDeleteKeynotes?: (keynote:string) => void
    onClickTrigger?: () => void
}
function NoteBody({theme,keynoteText,noteUpdate,onChangeDescription,onChangeKeynotes,onDeleteKeynotes,onClickTrigger}:NoteBodyInterface) {
    const [stateKeynotes,setStateKeynotes] = useState(false)
    const chipSxDefault = {
        backgroundColor: theme.default_background,
        color: theme.default_foreground,
        margin: "4px"
    } as SxProps<Theme>
    return(
        <>
            {(noteUpdate && keynoteText && onChangeDescription && onChangeKeynotes && onDeleteKeynotes)?
                <Stack direction="column" spacing={1} onClick={(event) => {event.stopPropagation()}}>
                    <InputBase
                        value={noteUpdate.description}
                        onChange={onChangeDescription}
                        onClick={onClickTrigger}
                        multiline 
                        minRows={2}
                        sx={{color:"inherit"}}
                    />
                    <Stack onClick={() => {setStateKeynotes(!stateKeynotes)}}>
                        <Typography>Keynotes:</Typography>
                        <Stack direction="row" sx={{flexWrap:"wrap"}}>
                            {(stateKeynotes)?
                                <TextFieldWithChip
                                    theme={theme}
                                    onClick={onClickTrigger}
                                    state={StateThemeUtils.DEFAULT}
                                    dataItem={noteUpdate.keynotes?noteUpdate.keynotes:[]}
                                    text={keynoteText}
                                    onChange={onChangeKeynotes}
                                    onDelete={onDeleteKeynotes}
                                    inputProps={{placeholder:"input keynotes",onClick:(event) => {event.stopPropagation()}}}
                                />:noteUpdate.keynotes? noteUpdate.keynotes.map(item => <Chip label={item} sx={chipSxDefault}/>):null
                            }
                        </Stack>
                    </Stack>
                </Stack>:<></>
            }
        </>
    )
}

interface NoteFooterInterface {
    noteUpdate?: NoteCollab | NotePrivate
    dateConverter: DateConverter
}
function NoteFooter({noteUpdate,dateConverter}:NoteFooterInterface) {
    return(
        <>
            {(noteUpdate)?
                <Stack direction="column" sx={{flexWrap:"wrap"}}>
                    <Typography variant="caption">last modified by:</Typography>
                    <Typography variant="body2">{`${noteUpdate.lastModifiedBy?.first} at ${noteUpdate.lastModifiedDate?dateConverter.to(new Date(noteUpdate.lastModifiedDate)):'undefined'}`}</Typography>
                    <Typography variant="caption">created by:</Typography>
                    <Typography variant="body2">{`${noteUpdate.createdBy?.first} at ${noteUpdate.createdDate?dateConverter.to(new Date(noteUpdate.createdDate)):'undefined'}`}</Typography>
                </Stack>
                :<></>
            }
        </>
    )
}

interface NoteActionsInterface {
    theme:ThemeObj
    isDisable: boolean
    onClickSaveAct?:() => void
    onClickCancelAct?:() => void
}
function NoteActions({theme,isDisable,onClickSaveAct,onClickCancelAct}:NoteActionsInterface) {
    return(
        <Stack direction="row" spacing={2}>
            <ThemeButton
                id="btn-signin"
                variant="contained" 
                onClick={onClickSaveAct} 
                sx={{margin: "auto",textTransform: "none"}}
                themeObj={theme}
                disabled={isDisable}
                state={StateThemeUtils.DEFAULT}
            >Save</ThemeButton>
            <ThemeButton
                id="btn-signin"
                variant="contained" 
                onClick={onClickCancelAct} 
                sx={{margin: "auto",textTransform: "none"}}
                themeObj={theme}
                disabled={isDisable}
                state={StateThemeUtils.DANGER}
            >Cancel</ThemeButton>
        </Stack>
    )
}

interface NoteListInterface extends NoteHeaderInterface,NoteBodyInterface,NoteActionsInterface,NoteFooterInterface {
    id?: string
    cardProps?: CardProps
    onDelete?: () => void
    onClickSave:(data:NoteCollab|NotePrivate) => void
    onClickCancel:(dataInit: NoteCollab|NotePrivate) => void
    isContainer?:boolean
    noteInit: NoteCollab | NotePrivate
}
export function NoteList({id,cardProps,theme,isContainer,isDisable,noteInit,dateConverter,onClickTrigger,onClickSave,onClickCancel,onDelete}:NoteListInterface) {
    const RenderComp = React.memo<{theme:ThemeObj,noteInit:NoteCollab | NotePrivate}>((data) => {
        const [open,setOpen] = useState(false)
        const [keynoteText, setKeynoteText] = useState("")
        const [openChangeSeverity,setOpenChangeSeverity] = useState(false)
        const [openColorPickerSeverity,setOpenColorPickerSeverity] = useState(false)
        const [noteUpdate,setNoteUpdate] = useState<NoteCollab|NotePrivate>()
        useEffect(() => {
            setNoteUpdate(noteInit)
        },[noteInit])
        useEffect(() => {
            if (isContainer) {
                setOpen(true)
            }
        },[isContainer])
        const refColorPickerSeverity = useRef(null)
        const mainSx = {
            width: '100%',
            backgroundColor: data.theme.background,
            borderColor: data.theme.border_color,
            color: data.theme.foreground
        } as SxProps<Theme>

        const onChangeKeynotes = (textWrap:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (noteUpdate) {
                let data = textWrap.target.value
                if (data.endsWith(',')) {
                    setNoteUpdate({...noteUpdate, keynotes: (noteUpdate.keynotes)?[...noteUpdate.keynotes,data.substring(0,data.length-1)]:[data.substring(0,data.length-1)]})
                    setKeynoteText('')
                } else  
                    setKeynoteText(data)
            }
        }

        return(
            <Card id={id} sx={mainSx} {...cardProps} onClick={(event) => {event.stopPropagation();if (!isContainer) setOpen(!open)}}>
                <CardContent sx={{backgroundColor: "rgba(255,255,255,.1)"}}>
                    <Stack direction="row" sx={{flexGrow:1}}>
                        <NoteHeader
                            noteUpdate={noteUpdate}
                            onClickTrigger={onClickTrigger}
                            onChangeCategory={(text) => {if (noteUpdate) setNoteUpdate({...noteUpdate,category:text.currentTarget.value})}}
                            onChangeTitle={(text) => {if (noteUpdate) setNoteUpdate({...noteUpdate,title:text.currentTarget.value})}}
                        />
                        <Stack sx={{color: (noteUpdate)? noteUpdate.severity.second:"#fff"}}>
                            <Button
                                variant="text"
                                onClick={(event) => {event.stopPropagation();setOpenChangeSeverity(!openChangeSeverity)}}
                                sx={{padding:0,color:"inherit",textTransform:"none"}}
                            >
                                <Stack>
                                    <TurnedInRounded sx={{color:"inherit",width:"2.5rem",height:"2.5rem",margin:"auto"}}/>
                                    <Typography>{(noteUpdate)?noteUpdate.severity.first:""}</Typography>
                                </Stack>
                            </Button>
                            <Collapse in={openChangeSeverity}>
                                <ThemeTextField
                                    variant="standard"
                                    onClick={(event) => {event.stopPropagation();if (onClickTrigger) onClickTrigger()}}
                                    themeObj={data.theme}
                                    state={StateThemeUtils.DEFAULT}
                                    value={(noteUpdate)?noteUpdate.severity.first:""}
                                    onChange={(text) => {if (noteUpdate) setNoteUpdate({...noteUpdate,severity:{...noteUpdate.severity,first: text.currentTarget.value}})}}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{color:data.theme.default_background}}>
                                            <IconButton ref={refColorPickerSeverity} onClick={(event) => {event.stopPropagation();setOpenColorPickerSeverity(!openColorPickerSeverity)}} color="inherit">
                                                <Palette sx={{color:"inherit",width:"1.5rem",height:"1.5rem",margin:"auto"}}/>
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                />
                            </Collapse>
                            <Menu
                                anchorEl={refColorPickerSeverity.current}
                                open={openColorPickerSeverity}
                                onClose={() => {setOpenColorPickerSeverity(!openColorPickerSeverity)}}
                                sx={{zIndex: (theme) => theme.zIndex.drawer + 2}}
                                MenuListProps={{sx:{padding:0}}}
                            >
                                <Box onClick={(event) => {event.stopPropagation()}}>
                                    <SketchPicker color={(noteUpdate)? noteUpdate.severity.second:"#fff"} onChangeComplete={(color) => {if(noteUpdate) setNoteUpdate({...noteUpdate,severity:{...noteUpdate.severity,second: color.hex.toUpperCase()+"FF"}})}}/>
                                </Box>
                            </Menu>
                            {(onDelete)?
                                <Box>
                                    <IconButton sx={{color: data.theme.danger_background,marginLeft:"auto"}} onClick={onDelete}>
                                        <Delete color="inherit" sx={{width:"1.8rem",height:"1.8rem"}}/>
                                    </IconButton>
                                </Box>:null
                            }
                        </Stack>
                    </Stack>
                </CardContent>
                <Stack direction="column" spacing={1}>
                    <Collapse in={open}>
                        <CardContent>
                            <NoteBody
                                theme={data.theme}
                                onClickTrigger={onClickTrigger}
                                noteUpdate={noteUpdate}
                                keynoteText={keynoteText}
                                onChangeDescription={(text) => {if (noteUpdate) setNoteUpdate({...noteUpdate,description:text.currentTarget.value})}}
                                onChangeKeynotes={onChangeKeynotes}
                                onDeleteKeynotes={(keynote) => {if (noteUpdate) setNoteUpdate({...noteUpdate,keynotes:noteUpdate.keynotes!.filter(item => item !== keynote)})}}
                            />
                        </CardContent>
                        <CardActions sx={{justifyContent:"center"}}>
                            {(noteUpdate && noteInit !== noteUpdate)?
                                <NoteActions
                                    theme={data.theme}
                                    isDisable={isDisable}
                                    onClickSaveAct={() => {onClickSave(noteUpdate)}}
                                    onClickCancelAct={() => {onClickCancel(noteInit)}}
                                />:null
                            }
                        </CardActions>
                        <CardContent sx={{backgroundColor: "rgba(0,0,0,.25)"}}>
                            <NoteFooter
                                noteUpdate={noteUpdate}
                                dateConverter={dateConverter}
                            />
                        </CardContent>
                    </Collapse>
                </Stack>
            </Card>
        )
    })
    return <RenderComp theme={theme} noteInit={noteInit}/>
}
