import { SearchRounded } from "@mui/icons-material";
import { Button, Chip, IconButton, IconButtonProps, InputAdornment, InputBase, styled, TextField, SxProps, Theme, Stack, InputBaseProps, StackProps } from "@mui/material";
import { ChangeEvent } from "react";
import { Theme as ThemeObj } from "../../model/model";

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
})<{themeObj: ThemeObj,state: StateThemeUtils,variant: "contained" | "text" | "outlined"}>((props) => ({
    backgroundColor: (props.variant === "contained")?getUtilsTheme(props.themeObj,props.state).background:undefined,
    color:(props.variant === ("outlined" || "text"))?getUtilsTheme(props.themeObj,props.state).background:getUtilsTheme(props.themeObj,props.state).foreground,
    borderColor: (props.variant === "outlined")?getUtilsTheme(props.themeObj,props.state).background:undefined,
    '&:hover': {
        backgroundColor: (props.variant === "contained")?getUtilsTheme(props.themeObj,props.state).background:undefined,
        borderColor: (props.variant === "outlined")?getUtilsTheme(props.themeObj,props.state).background:undefined,
    }
}))

type SearchFieldInterface = {
    placeholder:string
    onChange: (text: ChangeEvent<HTMLInputElement>) => void
    onSearch: () => void
    theme: ThemeObj
}

export const SearchField = ({placeholder,onChange,onSearch,theme}:SearchFieldInterface) => (
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
        InputProps={{
            endAdornment: <InputAdornment position="end" sx={{color:"inherit"}}>
                    <IconButton sx={{color:"inherit"}} onClick={onSearch}>
                        <SearchRounded sx={{color:"inherit"}}/>
                    </IconButton>
                </InputAdornment>
        }}
    />
)

interface SwitchIconButtonInterface {
    icon1: JSX.Element
    icon2: JSX.Element
    switchIcon: boolean
    props: IconButtonProps
}
export const SwitchIconButton = ({icon1, icon2, switchIcon, props}:SwitchIconButtonInterface) => (
    <IconButton {...props}>
        {(switchIcon)?icon1:icon2}
    </IconButton>
)

interface TextFieldWithChipInterface {
    theme: ThemeObj
    state: StateThemeUtils
    dataItem: string[]
    text: string
    onChange: (text:ChangeEvent<HTMLInputElement>) => void
    onDelete: (item:string) => void
    inputProps?: InputBaseProps
    mainSx?: SxProps<Theme>
    mainProps?: StackProps
}
export const TextFieldWithChip = ({theme,state,dataItem,text,onChange,onDelete,inputProps,mainSx,mainProps}:TextFieldWithChipInterface) => {
    let mainSxDefault = {
        flexWrap:"wrap",
        borderBottom:`3px solid ${getUtilsTheme(theme,state).background}`,
        borderRadius: '10px',
        backgroundColor: 'rgba(255,255,255,.08)',
        ...mainSx
    } as SxProps<Theme>
    let chipSxDefault = {
        backgroundColor:getUtilsTheme(theme,state).background,
        color:getUtilsTheme(theme,state).foreground,
        margin: "4px"
    } as SxProps<Theme>
    return(
        <Stack direction="row" sx={mainSxDefault} {...mainProps}>
            {dataItem.map(item => <Chip label={item} onDelete={() => {onDelete(item)}} 
                sx={chipSxDefault}/>)}
            <InputBase
                {...inputProps}
                value={text}
                onChange={onChange}
                sx={{color: getUtilsTheme(theme,state).background,margin:"5px"}}
            />
        </Stack>
    )
}

