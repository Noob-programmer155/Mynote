import { Button, Card, CardActions, CardContent, CardProps, Chip, Collapse, IconButton, InputAdornment, InputBase, Menu, Stack, SxProps, Theme, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { DateConverter } from "../../adapter/converter/attribute";
import { Theme as ThemeObj,NoteCollab, NotePrivate } from "../../model/model";
import { StateThemeUtils, TextFieldWithChip, ThemeButton, ThemeTextField } from "./global";
import { Delete, OpenInNewRounded, Palette, TurnedInRounded } from "@mui/icons-material";
import { SketchPicker } from "react-color";
import { map, of, tap } from "rxjs";

interface NoteHeaderInterface {
    theme: ThemeObj
    noteUpdate?: NoteCollab | NotePrivate
    onChangeTitle?: ((text: ChangeEvent<HTMLInputElement>) => void)
    onChangeCategory?: ((text: ChangeEvent<HTMLInputElement>) => void)
    onTransfer?:(event:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>,data:NoteCollab|NotePrivate) => void
    onDelete?: () => void
    role:string
    isContainer?:boolean
    noteInit: NoteCollab | NotePrivate
}
function NoteHeader({theme,noteUpdate,noteInit,role,onTransfer,onChangeTitle,onChangeCategory,onDelete,isContainer}:NoteHeaderInterface) {
    return(
        <>
            {(noteUpdate)?
                <Stack sx={{width:"100%"}}>
                    {('subtype' in noteUpdate)?
                        <Typography sx={{fontSize:".8rem"}}>{(noteUpdate as NoteCollab).subtype.name}</Typography>:
                        <>
                            {(!isContainer)?
                                <InputBase
                                    required
                                    onClick={(event) => {event.stopPropagation()}}
                                    sx={{color:"inherit"}}
                                    value={(noteUpdate as NotePrivate).category}
                                    placeholder="Category"
                                    onChange={onChangeCategory}
                                    inputProps={{style:{fontSize:".8rem"}}}
                                />:<ThemeTextField
                                    required
                                    themeObj={theme}
                                    state={StateThemeUtils.DEFAULT}
                                    variant="standard"
                                    onClick={(event) => {event.stopPropagation()}}
                                    sx={{color:"inherit"}}
                                    value={(noteUpdate as NotePrivate).category}
                                    placeholder="Category"
                                    onChange={onChangeCategory}
                                    inputProps={{style:{fontSize:".8rem"}}}
                                />
                            }
                        </>
                    }
                    <Box onClick={(event) => {event.stopPropagation()}}>
                        {(!isContainer)?
                            <InputBase
                                required
                                sx={{color:"inherit"}}
                                value={noteUpdate.title}
                                onChange={onChangeTitle}
                                placeholder="Title"
                                multiline
                                minRows={1}
                                inputProps={{style:{fontSize:"2rem",fontWeight:700,lineHeight:"2rem"}}}
                            />:<ThemeTextField
                                required
                                themeObj={theme}
                                state={StateThemeUtils.DEFAULT}
                                variant="standard"
                                sx={{color:"inherit"}}
                                value={noteUpdate.title}
                                onChange={onChangeTitle}
                                placeholder="Title"
                                multiline
                                minRows={1}
                                inputProps={{style:{fontSize:"2rem",fontWeight:700,lineHeight:"2rem"}}}
                            />
                        }
                    </Box>
                    <Stack direction={"row"}>
                        {(onDelete && (role === "ADMIN" || role === "MANAGER"))?
                            <Box>
                                <IconButton sx={{color: theme.danger_background}} onClick={(event) => {event.stopPropagation();onDelete()}}>
                                    <Delete color="inherit" sx={{width:"1.8rem",height:"1.8rem"}}/>
                                </IconButton>
                            </Box>:null
                        }
                        {(onTransfer && (role === "ADMIN" || role === "MANAGER"))? 
                            <Box sx={{marginLeft:"20px"}}>
                                <IconButton sx={{color: theme.default_background}} onClick={(event) => {event.stopPropagation();onTransfer(event,noteInit)}}>
                                    <OpenInNewRounded color="inherit" sx={{width:"1.8rem",height:"1.8rem"}}/>
                                </IconButton>
                            </Box>:null
                        }
                    </Stack>
                </Stack>:<></>
            }
        </>
    )
}

interface NoteBodyInterface {
    theme: ThemeObj
    noteUpdate?: NoteCollab | NotePrivate
    keynoteText?: string
    onChangeDescription?: (text: ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => void
    onChangeKeynotes?: (text: ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => void
    onDeleteKeynotes?: (keynote:string) => void
    isContainer?:boolean
}
function NoteBody({theme,keynoteText,noteUpdate,isContainer,onChangeDescription,onChangeKeynotes,onDeleteKeynotes}:NoteBodyInterface) {
    const [stateKeynotes,setStateKeynotes] = useState(false)
    const chipSxDefault = {
        backgroundColor: theme.default_background,
        color: theme.default_foreground,
        margin: "4px"
    } as SxProps<Theme>
    return(
        <>
            {(noteUpdate && onChangeDescription && onChangeKeynotes && onDeleteKeynotes)?
                <Stack direction="column" spacing={1} onClick={(event) => {event.stopPropagation()}}>
                    <Box sx={{maxHeight:"50vh",overflowY:"auto"}}>
                        {(!isContainer)?
                            <InputBase
                                required
                                value={noteUpdate.description}
                                onChange={onChangeDescription}
                                placeholder="Description"
                                multiline 
                                minRows={2}
                                sx={{color:"inherit",width:"100%"}}
                            />:<ThemeTextField
                                required
                                themeObj={theme}
                                state={StateThemeUtils.DEFAULT}
                                variant="standard"
                                value={noteUpdate.description}
                                onChange={onChangeDescription}
                                placeholder="Description"
                                multiline 
                                minRows={2}
                                sx={{color:"inherit",width:"100%"}}
                            />
                        }
                    </Box>
                    <Stack onClick={() => {setStateKeynotes(!stateKeynotes)}}>
                        <Typography>Keynotes:</Typography>
                        <Stack direction="row" sx={{flexWrap:"wrap"}}>
                            {(stateKeynotes)?
                                <TextFieldWithChip
                                    theme={theme}
                                    onClick={(event) => {event!.stopPropagation()}}
                                    state={StateThemeUtils.DEFAULT}
                                    dataItem={noteUpdate.keynotes?noteUpdate.keynotes:[]}
                                    text={keynoteText}
                                    onChange={onChangeKeynotes}
                                    onDelete={onDeleteKeynotes}
                                    mainSx={{width:"100%"}}
                                    inputProps={{placeholder:"input keynotes (using ',' to separate one and other keynotes)",sx:{width:"100%"},onClick:(event) => {event.stopPropagation()},required:true}}
                                />:noteUpdate.keynotes? noteUpdate.keynotes.map((item,i) => <Chip key={"text-chip-"+i} label={item} sx={chipSxDefault}/>):null
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
        <Stack direction="row" spacing={2} onClick={(event) => {event.stopPropagation()}}>
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

interface NoteListInterface extends NoteHeaderInterface,NoteBodyInterface,NoteFooterInterface {
    id?: string
    cardProps?: CardProps
    onClickSave:(data:NoteCollab|NotePrivate) => void
    onDelete?: () => void
    isContainer?:boolean
}
export function NoteList({id,cardProps,theme,isContainer,noteInit,dateConverter,role,onTransfer,onClickSave,onDelete}:NoteListInterface) {
    const [open,setOpen] = useState(false)
    const [disable,setDisable] = useState(false)
    const [keynoteText, setKeynoteText] = useState("")
    const [openChangeSeverity,setOpenChangeSeverity] = useState(false)
    const [openColorPickerSeverity,setOpenColorPickerSeverity] = useState(false)
    const [noteUpdate,setNoteUpdate] = useState<NoteCollab|NotePrivate>()
    useEffect(() => {
        if (isContainer) {
            setOpen(true)
        }
        setNoteUpdate(noteInit)
    },[noteInit,isContainer])
    const refColorPickerSeverity = useRef(null)
    const mainSx = {
        width: '100%',
        minWidth: '280px',
        maxWidth: '1200px',
        backgroundColor: theme.background,
        borderColor: theme.border_color,
        color: theme.foreground,
        ...cardProps?.sx
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
        <Card id={id} {...cardProps} sx={mainSx} onClick={(event) => {event.stopPropagation();if (!isContainer) setOpen(!open)}}>
            <CardContent sx={{backgroundColor: "rgba(255,255,255,.1)"}}>
                <Stack direction="row" sx={{flexGrow:1}}>
                    <NoteHeader
                        theme={theme}
                        noteInit={noteInit}
                        noteUpdate={noteUpdate}
                        onTransfer={onTransfer}
                        isContainer={isContainer}
                        role={role}
                        onChangeCategory={(text) => {if (noteUpdate) setNoteUpdate({...noteUpdate,category:text.currentTarget.value})}}
                        onChangeTitle={(text) => {if (noteUpdate) setNoteUpdate({...noteUpdate,title:text.currentTarget.value})}}
                        onDelete={onDelete}
                    />
                    <Stack sx={{color: (noteUpdate)? noteUpdate.severity.second:"#fff"}}>
                        <Button
                            variant="text"
                            onClick={(event) => {event.stopPropagation();setOpenChangeSeverity(!openChangeSeverity)}}
                            sx={{padding:0,color:"inherit",textTransform:"none"}}
                        >
                            <Stack sx={{marginRight:(openChangeSeverity)?"38%":0,marginLeft:"auto",transition:"all .25s ease-out"}}>
                                <TurnedInRounded sx={{color:"inherit",width:"2.5rem",height:"2.5rem",margin:"auto"}}/>
                                <Typography>{(noteUpdate)?noteUpdate.severity.first:""}</Typography>
                            </Stack>
                        </Button>
                        <Collapse in={openChangeSeverity}>
                            <ThemeTextField
                                variant="standard"
                                themeObj={theme}
                                state={StateThemeUtils.DEFAULT}
                                value={(noteUpdate)?noteUpdate.severity.first:""}
                                onChange={(text) => {if (noteUpdate) setNoteUpdate({...noteUpdate,severity:{...noteUpdate.severity,first: text.currentTarget.value}})}}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end" sx={{color:theme.default_background}}>
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
                    </Stack>
                </Stack>
            </CardContent>
            <Collapse in={open}>
                <Stack direction="column" spacing={1}>
                    <CardContent>
                        <NoteBody
                            theme={theme}
                            isContainer={isContainer}
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
                                theme={theme}
                                isDisable={disable}
                                onClickSaveAct={() => {of({}).pipe(tap(() => {setDisable(true)}),map(() => {onClickSave(noteUpdate)}),tap(() => {setDisable(false)})).subscribe()}}
                                onClickCancelAct={() => {setNoteUpdate(noteInit)}}
                            />:null
                        }
                    </CardActions>
                    <CardContent sx={{backgroundColor: "rgba(0,0,0,.25)"}}>
                        {(isContainer)?
                            null:
                            <NoteFooter
                              noteUpdate={noteUpdate}
                                dateConverter={dateConverter}
                            />
                        }
                    </CardContent>
                </Stack>
            </Collapse>
        </Card>
    )
}
