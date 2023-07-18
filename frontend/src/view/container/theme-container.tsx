import { Backdrop, Box, Button, Card, IconButton, InputAdornment, Link, Menu, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { Theme as ThemeObj } from "../../model/model";
import { Router } from "../../model/data/router-server/router";
import React, { ChangeEvent, MouseEvent, useMemo, useRef, useState } from "react";
import { StateThemeUtils, ThemeButton, ThemeTextField } from "./global";
import { AddCircle, AddPhotoAlternate, Close, ModeEditOutlineOutlined, Square } from "@mui/icons-material";
import { SketchPicker } from "react-color";
import { DateConverter } from "../../usecase/converter/attribute";

interface ThemeListInterface {
    theme: ThemeObj
    themeActive: ThemeObj
    onClick: (event?:MouseEvent<HTMLDivElement,globalThis.MouseEvent>) => void
    dateConverter: DateConverter
    isActivate: boolean
    isDisabled: boolean
    onClickAdd?: () => void
    onClickActivate?: () => void
    onClickRemove?: () => void
}
export function ThemeList({theme,themeActive,onClick,dateConverter,isActivate,isDisabled,onClickAdd,onClickActivate,onClickRemove}:ThemeListInterface) {
    return(
        <Card sx={{backgroundImage:(theme.background_images)?`url('${Router.Public.THEME_IMAGE.set({name:theme.background_images}).build()}')`:"none",
            backgroundSize:"cover",border:`4px solid ${theme.border_color}`}}>
                <Box sx={{backgroundColor:(theme.background_images)? theme.background_color.substring(0,7)+'AF':theme.background,
                    color:(theme.background_images)?theme.foreground_color:theme.foreground}}>
                        <Button component={"div"} onClick={(event) => {onClick();event.stopPropagation()}} sx={{color:"inherit",width:"100%",padding:"10px"}}>
                            <Stack sx={{width:"100%"}}>
                                <Typography textAlign="center" variant="h5" sx={{padding:"10px"}}>{theme.name}</Typography>
                                <Stack direction="column" spacing={1} sx={{flexWrap:"wrap"}}>
                                    <Typography variant="caption">created by:</Typography>
                                    <Stack direction={"row"} sx={{width:"100%"}}>
                                        <Typography variant="body2" sx={{flexGrow:1}}>{theme.createdBy?.first}</Typography>
                                        <Typography variant="body2">{theme.createdDate?dateConverter.to(new Date(theme.createdDate)):'undefined'}</Typography>
                                    </Stack>
                                    {(!theme.isMyTheme)?
                                        <ThemeButton
                                            themeObj={themeActive}
                                            state={StateThemeUtils.DEFAULT}
                                            variant="contained"
                                            sx={{textTransform:"none"}}
                                            onClick={(onClickAdd)?(event) => {event.stopPropagation();onClickAdd()}:(event) => {event.stopPropagation()}}
                                            disabled={isDisabled}
                                        ><AddCircle/> Add</ThemeButton>:<Stack direction="row" spacing={2} sx={{justifyContent:"center"}}>
                                            <>
                                                {(!isActivate && onClickActivate !== undefined)?
                                                    <ThemeButton
                                                        themeObj={themeActive}
                                                        state={StateThemeUtils.INFO}
                                                        variant="contained"
                                                        sx={{textTransform:"none"}}
                                                        onClick={(event) => {event.stopPropagation();onClickActivate()}}
                                                        disabled={isDisabled}
                                                    >Activate</ThemeButton>:null
                                                }
                                            </>
                                            <>
                                                {(!isActivate && onClickRemove !== undefined)?
                                                    <ThemeButton
                                                        themeObj={themeActive}
                                                        state={StateThemeUtils.DANGER}
                                                        variant="contained"
                                                        sx={{textTransform:"none"}}
                                                        onClick={(event) => {event.stopPropagation();onClickRemove()}}
                                                        disabled={isDisabled}
                                                    >Remove</ThemeButton>:null
                                                }
                                            </>
                                        </Stack>
                                    }
                                </Stack>
                            </Stack>
                        </Button>
                </Box>
        </Card>
    )
}

interface ThemePreviewInterface {
    themeActive: ThemeObj
    theme: ThemeObj
    open: boolean,
    onClose: (event?:MouseEvent<HTMLElement,globalThis.MouseEvent>) => void
    isMyTheme: boolean
    isUpdate: boolean
    isDisabled: boolean
    isError: boolean
    themeUpdate: ThemeObj
    image?: string
    onThemeUpdate: (theme:ThemeObj) => void
    onChangeName: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onClickUpdate?: (event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void
    onClickSave?: (event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void
    onClickCancelUpdate?: (event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void
    onThemeImageUpload: (file:ChangeEvent<HTMLInputElement>) => void
}
export function ThemePreview({themeActive,theme,open,onClose,isMyTheme,isUpdate,isDisabled,isError,themeUpdate,image,onChangeName,onThemeUpdate,onThemeImageUpload,onClickUpdate,onClickSave,onClickCancelUpdate}:ThemePreviewInterface) {
    const menuRef = useRef<Array<HTMLButtonElement|null>>([])
    const breakPointsLarge = useMediaQuery('(min-width:600px)')
    const [menuRefState, setMenuRefState] = useState(0)
    const [openMenu,setOpenMenu] = useState<{open:boolean,themeAttr:keyof ThemeObj}>({open:false,themeAttr:"name"})
    const [color,setColor] = useState("#fff")
    const isUpdateUser = () => {
        if (isUpdate)
            if (onClickSave) return updateTheme(isDisabled,true,themeActive,undefined,onClickSave,undefined)
            else return updateTheme(isDisabled,false,themeActive,onClickCancelUpdate,undefined,onClickUpdate!)
        else 
            return null
    }
    const img = useMemo(() => image
    ,[image])
    return(
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 5, maxHeight:"100vh", overflowY:"auto"}}
            open={open}
            onClick={onClose}
        >
            <Paper 
                onClick={(event) => {event.stopPropagation()}}
                sx={{backgroundColor:theme.background_color? theme.background_color.substring(0,7)+'cd' : "rgba(255,255,255,.80)",color: theme.foreground_color,
                    padding:"10px",width:"90vw",maxWidth:"1200px",maxHeight:"100%",overflow:"auto"}}>
                        <Stack spacing={2} sx={{padding:"15px 0 15px 0"}}>
                            <Stack direction="row" sx={{alignItems:"center",justifyContent:"right"}}>
                                <IconButton onClick={onClose}>
                                    <Close sx={{color:themeActive.danger_background,fontSize:"2.5rem"}}/>
                                </IconButton>
                            </Stack>
                            {(isMyTheme)?
                                <>
                                    <ThemeTextField
                                        id="theme-container-preview"
                                        variant="standard"
                                        placeholder=""
                                        state={StateThemeUtils.DEFAULT} 
                                        themeObj={themeActive}
                                        value={themeUpdate.name}
                                        onChange={onChangeName}
                                        error={isError}
                                        helperText={(isError)?"theme already exists":((isUpdate)?"special character not allowed, except '-'":"")}
                                        InputProps= {{
                                            endAdornment: <InputAdornment position="end" sx={{color:"inherit"}}>
                                                    <ModeEditOutlineOutlined sx={{color:"inherit"}}/>
                                                </InputAdornment>
                                        }}
                                    />
                                    <Stack spacing={2}>
                                        <Stack spacing={2}>
                                            <Typography>Background & Foreground</Typography>
                                            <Stack direction={(breakPointsLarge)?"row":"column"} spacing={2} sx={{flexWrap:"wrap",justifyContent:"center"}}>
                                                <ThemeButton
                                                    id="theme-container1-preview"
                                                    ref={(element) => {menuRef.current[0] = element}}
                                                    themeObj={themeActive}
                                                    state={StateThemeUtils.DEFAULT}
                                                    variant="contained"
                                                    onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"background_color"});setMenuRefState(0)}}
                                                    sx={{textTransform:"none"}}
                                                >Background <Square sx={{color:themeUpdate.background_color}}/></ThemeButton>
                                                <ThemeButton
                                                    id="theme-container2-preview"
                                                    ref={(element) => {menuRef.current[1] = element}}
                                                    themeObj={themeActive}
                                                    state={StateThemeUtils.DEFAULT}
                                                    variant="contained"
                                                    onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"foreground_color"});setMenuRefState(1)}}
                                                    sx={{textTransform:"none"}}
                                                >Foreground <Square sx={{color:themeUpdate.foreground_color}}/></ThemeButton>
                                                <Stack direction="row" sx={{alignItems:"center",justifyContent:"center"}}>
                                                    <IconButton
                                                        id="theme-container3-preview"
                                                        component="label"
                                                    >
                                                        <AddPhotoAlternate sx={{color:themeActive.default_background}}/> <input hidden accept=".jpg,.png,.jpeg" type="file" onChange={onThemeImageUpload}/>
                                                    </IconButton>
                                                </Stack>
                                            </Stack>
                                            <Typography>Note Body</Typography>
                                            <Stack direction={(breakPointsLarge)?"row":"column"} spacing={2} sx={{flexWrap:"wrap",justifyContent:"center"}}>
                                                <ThemeButton
                                                    id="theme-container4-preview"
                                                    ref={(element) => {menuRef.current[2] = element}}
                                                    themeObj={themeActive}
                                                    state={StateThemeUtils.DEFAULT}
                                                    variant="contained"
                                                    sx={{textTransform:"none"}}
                                                    onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"background"});setMenuRefState(2)}}
                                                >Background <Square sx={{color:themeUpdate.background}}/></ThemeButton>
                                                <ThemeButton
                                                    id="theme-container5-preview"
                                                    ref={(element) => {menuRef.current[3] = element}}
                                                    themeObj={themeActive}
                                                    state={StateThemeUtils.DEFAULT}
                                                    variant="contained"
                                                    sx={{textTransform:"none"}}
                                                    onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"foreground"});setMenuRefState(3)}}
                                                >Foreground <Square sx={{color:themeUpdate.foreground}}/></ThemeButton>
                                                <ThemeButton
                                                    id="theme-container6-preview"
                                                    ref={(element) => {menuRef.current[4] = element}}
                                                    themeObj={themeActive}
                                                    state={StateThemeUtils.DEFAULT}
                                                    variant="contained"
                                                    sx={{textTransform:"none"}}
                                                    onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"border_color"});setMenuRefState(4)}}
                                                >Border <Square sx={{color:themeUpdate.border_color}}/></ThemeButton>
                                            </Stack>
                                            <Typography>Utilities</Typography>
                                            <Stack spacing={2}>
                                                <Stack sx={{backgroundColor:"rgba(255,255,255,.5)",padding:"10px",borderRadius:"10px"}}>
                                                    <Typography>Default Utils</Typography>
                                                    <Stack direction={(breakPointsLarge)?"row":"column"} spacing={2} sx={{flexWrap:"wrap",justifyContent:"center"}}>
                                                        <ThemeButton
                                                            id="theme-container7-preview"
                                                            ref={(element) => {menuRef.current[5] = element}}
                                                            themeObj={themeActive}
                                                            state={StateThemeUtils.DEFAULT}
                                                            variant="contained"
                                                            sx={{textTransform:"none"}}
                                                            onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"default_background"});setMenuRefState(5)}}
                                                        >Background <Square sx={{color:themeUpdate.default_background}}/></ThemeButton>
                                                        <ThemeButton
                                                            id="theme-container8-preview"
                                                            ref={(element) => {menuRef.current[6] = element}}
                                                            themeObj={themeActive}
                                                            state={StateThemeUtils.DEFAULT}
                                                            variant="contained"
                                                            sx={{textTransform:"none"}}
                                                            onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"default_foreground"});setMenuRefState(6)}}
                                                        >Foreground <Square sx={{color:themeUpdate.default_foreground}}/></ThemeButton>
                                                    </Stack>
                                                </Stack>
                                                <Stack sx={{backgroundColor:"rgba(255,255,255,.5)",padding:"10px",borderRadius:"10px"}}>
                                                    <Typography>Info Utils</Typography>
                                                    <Stack direction={(breakPointsLarge)?"row":"column"} spacing={2} sx={{flexWrap:"wrap",justifyContent:"center"}}>
                                                        <ThemeButton
                                                            id="theme-container7-preview"
                                                            ref={(element) => {menuRef.current[5] = element}}
                                                            themeObj={themeActive}
                                                            state={StateThemeUtils.DEFAULT}
                                                            variant="contained"
                                                            sx={{textTransform:"none"}}
                                                            onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"info_background"});setMenuRefState(5)}}
                                                        >Background <Square sx={{color:themeUpdate.info_background}}/></ThemeButton>
                                                        <ThemeButton
                                                            id="theme-container8-preview"
                                                            ref={(element) => {menuRef.current[6] = element}}
                                                            themeObj={themeActive}
                                                            state={StateThemeUtils.DEFAULT}
                                                            variant="contained"
                                                            sx={{textTransform:"none"}}
                                                            onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"info_foreground"});setMenuRefState(6)}}
                                                        >Foreground <Square sx={{color:themeUpdate.info_foreground}}/></ThemeButton>
                                                    </Stack>
                                                </Stack>
                                                <Stack sx={{backgroundColor:"rgba(255,255,255,.5)",padding:"10px",borderRadius:"10px"}}>
                                                    <Typography>Danger/Warning Utils</Typography>
                                                    <Stack direction={(breakPointsLarge)?"row":"column"} spacing={2} sx={{flexWrap:"wrap",justifyContent:"center"}}>
                                                        <ThemeButton
                                                            id="theme-container7-preview"
                                                            ref={(element) => {menuRef.current[5] = element}}
                                                            themeObj={themeActive}
                                                            state={StateThemeUtils.DEFAULT}
                                                            variant="contained"
                                                            sx={{textTransform:"none"}}
                                                            onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"danger_background"});setMenuRefState(5)}}
                                                        >Background <Square sx={{color:themeUpdate.danger_background}}/></ThemeButton>
                                                        <ThemeButton
                                                            id="theme-container8-preview"
                                                            ref={(element) => {menuRef.current[6] = element}}
                                                            themeObj={themeActive}
                                                            state={StateThemeUtils.DEFAULT}
                                                            variant="contained"
                                                            sx={{textTransform:"none"}}
                                                            onClick={() => {setOpenMenu({open:!openMenu.open,themeAttr:"danger_foreground"});setMenuRefState(6)}}
                                                        >Foreground <Square sx={{color:themeUpdate.danger_foreground}}/></ThemeButton>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        {isUpdateUser()}
                                    </Stack>
                                </>:<Typography variant="h6" sx={{color: theme.foreground_color,textAlign:"center",fontWeight:700}}>{theme.name}</Typography>
                            }
                            {themePreview(themeUpdate,img)}
                        </Stack>
                        <Menu
                            anchorEl={menuRef.current[menuRefState]}
                            open={openMenu.open}
                            onClose={() => {setOpenMenu({...openMenu,open:!openMenu.open})}}
                            sx={{zIndex: (theme) => theme.zIndex.drawer + 6}}
                            MenuListProps={{sx:{padding:0}}}
                        >
                            <Box onClick={(event) => {event.stopPropagation()}}>
                                <SketchPicker color={color} onChangeComplete={(color) => {setColor(color.hex);onThemeUpdate({...themeUpdate, [openMenu.themeAttr.toString()]:color.hex.toUpperCase()+"FF"})}}/>
                            </Box>
                        </Menu>
            </Paper>  
        </Backdrop>

    )
}

const updateTheme = (isDisabled: boolean,isSave: boolean,theme:ThemeObj,onClickCancel?:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void),onClickSave?:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void),onClickUpdate?:((event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void)) => (
    <Stack direction="row" spacing={2} sx={{justifyContent:"flex-end",marginTop:"20px"}}>
        {(isSave)?
            <ThemeButton
                id="btn-update-theme-preview"
                variant="contained"
                themeObj={theme}
                state={StateThemeUtils.DEFAULT}
                onClick={onClickSave!}
                disabled={isDisabled}
                sx={{textTransform:"none"}}
            >
                Save Theme
            </ThemeButton>:
            <>
                <ThemeButton
                    id="btn-update-theme-preview"
                    variant="contained"
                    themeObj={theme}
                    state={StateThemeUtils.DEFAULT}
                    onClick={onClickUpdate!}
                    disabled={isDisabled}
                    sx={{textTransform:"none"}}
                >
                    Update Theme
                </ThemeButton>
                <ThemeButton
                    id="btn-cancel-update-theme-preview"
                    variant="contained"
                    themeObj={theme}
                    state={StateThemeUtils.DANGER}
                    onClick={onClickCancel!}
                    sx={{textTransform:"none"}}
                >
                    Cancel
                </ThemeButton>
            </>
        }
    </Stack>
)

const ContainerThemePreview = (theme:{themeUpdate: ThemeObj}) => (
    <>
        <Typography sx={{width:"100%",margin:"7px"}} variant="h2">This Example Text</Typography>
        <Typography sx={{width:"100%",margin:"7px"}} variant="h4">This Example Text</Typography>
        <Typography sx={{width:"100%",margin:"7px"}} variant="body1">This Example Text</Typography>
        <ThemeButton
            variant="contained"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.DEFAULT}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Default</ThemeButton>
        <ThemeButton
            variant="text"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.DEFAULT}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Text Default</ThemeButton>
        <ThemeButton
            variant="outlined"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.DEFAULT}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Outline Default</ThemeButton>
        <ThemeButton
            variant="contained"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.INFO}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Info</ThemeButton>
        <ThemeButton
            variant="text"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.INFO}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Text Info</ThemeButton>
        <ThemeButton
            variant="outlined"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.INFO}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Outline Info</ThemeButton>
        <ThemeButton
            variant="contained"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.DANGER}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Danger</ThemeButton>
        <ThemeButton
            variant="text"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.DANGER}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Text Danger</ThemeButton>
        <ThemeButton
            variant="outlined"
            themeObj={theme.themeUpdate}
            state={StateThemeUtils.DANGER}
            onClick={() => {}}
            disabled={false}
            sx={{margin:"7px",textTransform: "none"}}
        >Button Outline Danger</ThemeButton>
        <ThemeTextField
            variant="standard"
            placeholder="This is placeholder"
            state={StateThemeUtils.DEFAULT} 
            themeObj={theme.themeUpdate}
            error={false}
            sx={{margin:"7px"}}
        />
        <ThemeTextField
            variant="filled"
            placeholder="This is placeholder"
            state={StateThemeUtils.DEFAULT} 
            themeObj={theme.themeUpdate}
            error={false}
            sx={{margin:"7px"}}
        />
        <ThemeTextField
            variant="outlined"
            placeholder="This is placeholder"
            state={StateThemeUtils.DEFAULT} 
            themeObj={theme.themeUpdate}
            error={false}
            sx={{margin:"7px"}}
        />
        <Paper sx={{backgroundColor:theme.themeUpdate.background? theme.themeUpdate.background.substring(0,7)+'cd' : "rgba(255,255,255,.80)",
            color:theme.themeUpdate.foreground,border: `3px solid ${theme.themeUpdate.border_color}`,margin:"7px",width:"100%"}}>
            <Typography variant="h5" textAlign={"center"} sx={{padding:"0 5rem"}}>This is Note</Typography>
        </Paper>
    </>
)

const themePreview = (themeUpdate: ThemeObj,background?:string) => {
    return(
        <Card>
            <Stack direction="row" sx={{flexWrap:"wrap",backgroundColor:themeUpdate.background_color? themeUpdate.background_color.substring(0,themeUpdate.background_color.length-2)+'cd' : "rgba(255,255,255,.80)",
                backgroundImage: (background)?`url(${background.replace(/\n/g, '')})`:((themeUpdate.background_images)?`url(${Router.Public.THEME_IMAGE.set({name:themeUpdate.background_images}).build()})`:"none"),
                backgroundSize:"cover",color: themeUpdate.foreground_color}}>
                    <ContainerThemePreview themeUpdate={themeUpdate}/>
            </Stack>
        </Card>
    )
}