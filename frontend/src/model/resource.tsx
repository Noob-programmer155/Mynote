export const server = process.env.REACT_APP_SERVER!
export const token_name = process.env.REACT_APP_TOKEN_NAME! //NT_TKN;
export const bearer_name = process.env.REACT_APP_BEARER!; //BearerV12
// export const key_token = process.env.REACT_APP_KEY_TOKEN!; //security key token for encrypt and decrypt token
// export const iv_token = process.env.REACT_APP_KEY_IV_TOKEN!; //security key token for encrypt and decrypt token
export const delimiter = '::'
export const emptyNotesId = 'empty'
export const limitFileTheme = 9961472
export const limitFileUser = 5242880
export const defaultTheme = {
    name: "default",
    background_color: "#ffffffff",
    foreground_color: "#363535ff",
    border_color: "#fcd403ff",
    background: "#fa9405ff",
    foreground: "#f0f0f0ff",
    danger_background: "#ff1900ff",
    danger_foreground: "#facfcaff",
    info_background: "#1dc257ff",
    info_foreground: "#b1facbff",
    default_background: "#059df0ff",
    default_foreground: "#bbe5fcff",
    createdDate: new Date().toISOString(),
    createdBy: {first:"",second:""}
}