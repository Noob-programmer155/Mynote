import { Card, CardActions, CardContent, Chip, Collapse, IconButton, InputBase, Popover, Stack, SxProps, Theme, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useState } from "react";
import { DateConverter } from "../../configuration/converter/attribute";
import { Theme as ThemeObj,NoteCollab, NotePrivate } from "../../model/model";
import { StateThemeUtils, TextFieldWithChip, ThemeButton } from "./global";
import { TurnedInRounded } from "@mui/icons-material";

interface NoteHeaderInterface {
    note: NoteCollab | NotePrivate
    title: string
    onChangeTitle: (text: ChangeEvent<HTMLInputElement>) => void
}
function NoteHeader({note,title,onChangeTitle}:NoteHeaderInterface) {
    return(
        <Stack >
            <Typography variant="body1">
                {('subtype' in note)?(note as NoteCollab).subtype.name:(note as NotePrivate).category}
            </Typography>
            <Box onClick={(event) => {event.stopPropagation()}}>
                <InputBase
                    sx={{color:"inherit"}}
                    value={title}
                    onChange={onChangeTitle}
                    multiline
                    minRows={1}
                    inputProps={{style:{fontSize:"2rem",fontWeight:700}}}
                />
            </Box>
        </Stack>
    )
}

interface NoteBodyInterface {
    theme: ThemeObj,
    note: NoteCollab | NotePrivate
    description: string
    keynotes: string
    onChangeDescription: (text: ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => void
    onChangeKeynotes: (text: ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => void
    onDeleteKeynotes: (keynote:string) => void
}
function NoteBody({theme,note,description,onChangeDescription,keynotes,onChangeKeynotes,onDeleteKeynotes}:NoteBodyInterface) {
    const [stateKeynotes,setStateKeynotes] = useState(false)
    let chipSxDefault = {
        backgroundColor: theme.default_background,
        color: theme.default_foreground,
        margin: "4px"
    } as SxProps<Theme>
    return(
        <Stack direction="column" spacing={1} onClick={(event) => {event.stopPropagation()}}>
            <InputBase
                value={description}
                onChange={onChangeDescription}
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
                            state={StateThemeUtils.DEFAULT}
                            dataItem={note.keynotes?note.keynotes:[]}
                            text={keynotes}
                            onChange={onChangeKeynotes}
                            onDelete={onDeleteKeynotes}
                            inputProps={{placeholder:"input keynotes",onClick:(event) => {event.stopPropagation()}}}
                        />:note.keynotes? note.keynotes.map(item => <Chip label={item} sx={chipSxDefault}/>):null
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}

interface NoteFooterInterface {
    note: NoteCollab | NotePrivate
    dateConverter: DateConverter
}
function NoteFooter({note,dateConverter}:NoteFooterInterface) {
    return(
        <Stack direction="column" sx={{flexWrap:"wrap"}}>
            <Typography variant="caption">last modified by:</Typography>
            <Typography variant="body2">{`${note.lastModifiedBy?.first} at ${note.lastModifiedDate?dateConverter.to(new Date(note.lastModifiedDate)):'undefined'}`}</Typography>
            <Typography variant="caption">created by:</Typography>
            <Typography variant="body2">{`${note.createdBy?.first} at ${note.createdDate?dateConverter.to(new Date(note.createdDate)):'undefined'}`}</Typography>
        </Stack>
    )
}

interface NoteActionsInterface {
    theme:ThemeObj
    onClickSave:() => void
    onClickCancel:() => void
}
function NoteActions({theme,onClickSave,onClickCancel}:NoteActionsInterface) {
    return(
        <Stack direction="row" spacing={2}>
            <ThemeButton
                id="btn-signin"
                variant="contained" 
                onClick={onClickSave} 
                sx={{margin: "auto"}}
                themeObj={theme}
                state={StateThemeUtils.INFO}
            >Save</ThemeButton>
            <ThemeButton
                id="btn-signin"
                variant="contained" 
                onClick={onClickCancel} 
                sx={{margin: "auto"}}
                themeObj={theme}
                state={StateThemeUtils.DANGER}
            >Cancel</ThemeButton>
        </Stack>
    )
}

interface NoteListInterface extends NoteHeaderInterface,NoteBodyInterface,NoteActionsInterface,NoteFooterInterface {
    id?: string
    openUpdateCont: boolean
}
export function NoteList({id,theme,note,dateConverter,title,description,keynotes,openUpdateCont,onChangeTitle,onChangeDescription,onChangeKeynotes,onDeleteKeynotes,onClickSave,onClickCancel}:NoteListInterface) {
    const [open,setOpen] = useState(false)
    const [severityOpen,setSeverityOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    let mainSx = {
        width: '95vw',
        maxWidth: '400px',
        backgroundColor: theme.background,
        borderColor: theme.border_color,
        color: theme.foreground
    } as SxProps<Theme>
    return(
        <Card id={id} sx={mainSx} onClick={() => {setOpen(!open)}}>
            <CardContent sx={{backgroundColor: "rgba(255,255,255,.1)"}}>
                <Stack direction="row" sx={{flexGrow:1}}>
                    <NoteHeader
                        note={note}
                        title={title}
                        onChangeTitle={onChangeTitle}
                    />
                    <Stack sx={{color: note.severity.second}}>
                        <IconButton
                            onClick={(event) => {event.stopPropagation();setSeverityOpen(!severityOpen);setAnchorEl(event.currentTarget)}}
                            sx={{padding:0,color:"inherit"}}
                        >
                            <TurnedInRounded sx={{color:"inherit",width:"2.5rem",height:"2.5rem",margin:"auto"}}/>
                        </IconButton>
                        <Popover
                            open={severityOpen}
                            anchorEl={anchorEl}
                            onClick={(event) => {event.stopPropagation()}}
                            onClose={() => {setSeverityOpen(!severityOpen)}}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center"
                            }}
                            PaperProps={{sx:{backgroundColor:theme.background_color}}}
                        >
                            <Typography variant="body2" textAlign="center" sx={{fontWeight:"bold",color: theme.foreground_color,padding:"8px"}}>{note.severity.first}</Typography>
                        </Popover>
                    </Stack>
                </Stack>
            </CardContent>
            <Stack direction="column" spacing={1}>
                <Collapse in={open}>
                    <CardContent>
                        <NoteBody
                            theme={theme}
                            note={note}                          
                            description={description}
                            keynotes={keynotes}
                            onChangeDescription={onChangeDescription}
                            onChangeKeynotes={onChangeKeynotes}
                            onDeleteKeynotes={onDeleteKeynotes}
                        />
                    </CardContent>
                    <CardActions sx={{justifyContent:"center"}}>
                        {(openUpdateCont)?
                            <NoteActions
                                theme={theme}
                                onClickSave={onClickSave}
                                onClickCancel={onClickCancel}
                            />:null
                        }
                    </CardActions>
                    <CardContent sx={{backgroundColor: "rgba(0,0,0,.25)"}}>
                        <NoteFooter
                            note={note}
                            dateConverter={dateConverter}
                        />
                    </CardContent>
                </Collapse>
            </Stack>
        </Card>
    )
}
