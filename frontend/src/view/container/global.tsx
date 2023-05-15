import { ArrowDropDown, Cancel, SearchRounded } from "@mui/icons-material";
import { Button, Chip, IconButton, IconButtonProps, InputAdornment, InputBase, styled, TextField, SxProps, Theme, Stack, InputBaseProps, StackProps, Box, Fab, Tooltip, Paper, Typography, Menu, MenuItem, CircularProgress } from "@mui/material";
import { ChangeEvent, MouseEvent, RefObject, useRef } from "react";
import { Theme as ThemeObj } from "../../model/model";
import { IdAndName } from "../../model/model-side";

export const enum StateThemeUtils {
    DANGER,
    INFO,
    DEFAULT
}

function getUtilsTheme(theme: ThemeObj,state: StateThemeUtils):{background: string, foreground: string} {
    switch (state) {
        case StateThemeUtils.DANGER:
            return {background: theme.danger_background, foreground: theme.danger_foreground}
        case StateThemeUtils.INFO:
            return {background: theme.info_background, foreground: theme.info_foreground}
        default:
            return {background: theme.default_background, foreground: theme.default_foreground}
    }
}

export const ThemeTextField = styled(TextField, {
    shouldForwardProp: (props) => props !== ("themeObj" || "state")
})<{themeObj: ThemeObj,state: StateThemeUtils}>((props) => ({
    "& label": {
        color: getUtilsTheme(props.themeObj,props.state).foreground
    },
    "& label.Mui-focused": {
        color: getUtilsTheme(props.themeObj,props.state).background
    },
    "& .MuiInput-root": {
        color: getUtilsTheme(props.themeObj,props.state).background
    },
    "& .MuiInput-underline:hover:before": {
        borderBottomColor: getUtilsTheme(props.themeObj,props.state).background + "!important"
    },
    "& .MuiInput-underline:before": {
        borderBottomColor: getUtilsTheme(props.themeObj,props.state).foreground
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: getUtilsTheme(props.themeObj,props.state).background
    },
    "& .MuiFilledInput-root": {
        backgroudColor: getUtilsTheme(props.themeObj,props.state).background,
        color: getUtilsTheme(props.themeObj,props.state).foreground,
    },
    "& .MuiFilledInput-underline:hover:before": {
        borderBottomColor: getUtilsTheme(props.themeObj,props.state).background
    },
    "& .MuiFilledInput-underline:before": {
        borderBottomColor: getUtilsTheme(props.themeObj,props.state).foreground
    },
    "& .MuiFilledInput-underline:after": {
        borderBottomColor: getUtilsTheme(props.themeObj,props.state).background
    },
    "& .MuiOutlinedInput-root": {
        color: getUtilsTheme(props.themeObj,props.state).background,
        borderColor: getUtilsTheme(props.themeObj,props.state).foreground,
        "&.Mui-focused fieldset": {
            borderColor: getUtilsTheme(props.themeObj,props.state).background
        },
        "&:hover fieldset": {
            borderColor: getUtilsTheme(props.themeObj,props.state).background
        },
    }
}))

export const ThemeButton = styled(Button, {
    shouldForwardProp: (props:PropertyKey) => props !== ("themeObj" || "state" || "variant")
})<{themeObj: ThemeObj,state: StateThemeUtils,variant: string}>((props) => ({
    backgroundColor: (props.variant === "contained")?getUtilsTheme(props.themeObj,props.state).background:undefined,
    color:((props.variant === "outlined") || (props.variant === "text"))?getUtilsTheme(props.themeObj,props.state).background:getUtilsTheme(props.themeObj,props.state).foreground,
    borderColor: (props.variant === "outlined")?getUtilsTheme(props.themeObj,props.state).background:undefined,
    '&:hover': {
        backgroundColor: (props.variant === "contained")?getUtilsTheme(props.themeObj,props.state).background:undefined,
        borderColor: (props.variant === "outlined")?getUtilsTheme(props.themeObj,props.state).background:undefined,
    }
}))

export const ThemeFab = styled(Fab,{
    shouldForwardProp: (props:PropertyKey) => props !== ("themeObj" || "state")
})<{themeObj: ThemeObj,state: StateThemeUtils}>((props) => ({
    backgroundColor: getUtilsTheme(props.themeObj,props.state).background,
    color: getUtilsTheme(props.themeObj,props.state).foreground
}))

interface SearchFieldInterface {
    placeholder:string
    onChange: (text: ChangeEvent<HTMLInputElement>) => void
    onSearch: (event?:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => void
    onClear?: () => void
    theme: ThemeObj
    isDropDownButton: boolean
    buttonPropsDropDown?: IconButtonProps
    buttonPropsClear?: IconButtonProps
    refTarget?: ((data: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null
    value?: string
}

export const SearchField = ({value,refTarget,placeholder,onChange,onSearch,onClear,theme,buttonPropsDropDown,buttonPropsClear,isDropDownButton}:SearchFieldInterface) => (
    <ThemeTextField
        onChange={onChange}
        onKeyDown={(event) => {
            if (event.key === 'Enter') {
                onSearch()
            }
        }}
        variant="outlined"
        size="small"
        state={StateThemeUtils.DEFAULT}
        themeObj={theme}
        placeholder={placeholder}
        ref={refTarget}
        value={value}
        InputProps={{
            endAdornment: <InputAdornment position="end" sx={{color:"inherit"}}>
                    <Tooltip title={(isDropDownButton)?"select menu search":"search"}>
                        <IconButton sx={{color:"inherit"}} onClick={onSearch} {...buttonPropsDropDown}>
                            <SearchRounded sx={{color:"inherit"}}/>
                            {(isDropDownButton)?<ArrowDropDown sx={{color:"inherit",padding:0,margin:0}}/>:null}
                        </IconButton>
                    </Tooltip>
                    {(onClear)?
                        <Tooltip title="clear text">
                            <IconButton sx={{color:"inherit"}} onClick={onClear} {...buttonPropsClear}>
                                <Cancel sx={{color:"inherit"}}/>
                            </IconButton>
                        </Tooltip>:null
                    }
                </InputAdornment>
        }}
    />
)

interface TextFieldWithChipInterface {
    theme: ThemeObj
    state: StateThemeUtils
    dataItem: string[]
    text?: string
    onChange: (text:ChangeEvent<HTMLInputElement>) => void
    onDelete: (item:string) => void
    onClick?: () => void
    inputProps?: InputBaseProps
    mainSx?: SxProps<Theme>
    mainProps?: StackProps
}
export const TextFieldWithChip = ({theme,state,dataItem,text,onChange,onDelete,onClick,inputProps,mainSx,mainProps}:TextFieldWithChipInterface) => {
    const mainSxDefault = {
        flexWrap:"wrap",
        borderBottom:`3px solid ${getUtilsTheme(theme,state).background}`,
        borderRadius: '10px',
        backgroundColor: 'rgba(255,255,255,.08)',
        ...mainSx
    } as SxProps<Theme>
    const chipSxDefault = {
        backgroundColor:getUtilsTheme(theme,state).background,
        color:getUtilsTheme(theme,state).foreground,
        margin: "4px"
    } as SxProps<Theme>
    return(
        <Stack direction="row" sx={mainSxDefault} {...mainProps}>
            {dataItem.map(item => <Chip label={item} onClick={() => {onDelete(item)}} onDelete={() => {onDelete(item)}} 
                sx={chipSxDefault}/>)}
            <InputBase
                {...inputProps}
                value={text}
                onClick={onClick}
                onChange={onChange}
                sx={{color: getUtilsTheme(theme,state).background,margin:"5px"}}
            />
        </Stack>
    )
}

type TabPanelType = {
    targetValue: number | string
    value: number | string
    sx?: SxProps<Theme>
    children: JSX.Element | JSX.Element[]
}
export const TabPanel = ({targetValue,value,sx,children}:TabPanelType) => {
    return <Box sx={{...sx,display: (targetValue === value)? "inline-block":"none", height: "inherit"}} >
        {children}
    </Box>
}

interface SearchSuggestContainerInterface {
    open: boolean
    refTarget: any
    loading: boolean
    data: Array<IdAndName<string>>
    onClick: (id:IdAndName<string>) => void
    onClose: () => void
    sxPaper: SxProps<Theme>
    colorLoading?: string
    sx: SxProps<Theme>
}
export const SearchSuggestContainer = ({open,loading,refTarget,data,onClick,onClose,sx,colorLoading,sxPaper}:SearchSuggestContainerInterface) => {
    return(
        <Menu
            open={open}
            anchorEl={refTarget}
            sx={sx}
            PaperProps={{sx:sxPaper}}
            onClose={onClose}
        >
            {(!loading)?
                <div>
                    {(data.length > 0)?data.map(item => (
                        <MenuItem
                            onClick={() => {onClick(item)}}
                        >
                            {item.name}
                        </MenuItem>
                    )):<MenuItem>No Suggestion</MenuItem>}
                </div>:<MenuItem sx={{color:(colorLoading)?colorLoading:"blueviolet"}}><CircularProgress color="inherit"/></MenuItem>
            }
        </Menu>
    )
}