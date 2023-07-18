import { Button } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../configuration/redux/hooks";
import { SearchField } from "./container/global";
import { Login } from "./container/login";
import { UserItemList, UserItemListReject, UserItemListRequest } from "./container/user-list";
import { NoteList } from "./container/note-container";
import { Group, Member, NoteCollab, Theme } from "../model/model";
import { DateConverter } from "../usecase/converter/attribute";
import { SketchPicker } from 'react-color'
import { from } from "rxjs";
import { ThemeList, ThemePreview } from "./container/theme-container";
import { ThemeView } from "./view-controller/theme-view";
import { MainAdapter } from "../adapter/adapter";
import { ReduxRoute } from "../usecase/other/redux-item-route";
import { setRoute } from "../configuration/redux/reducer/route-reducer";
import { Pair } from "../model/model-side";

export default function ViewTest(): JSX.Element {
    const themeAdapter = MainAdapter.THEME
    const[open0, setOpen0] = useState(false)
    const[open, setOpen] = useState(false)
    const[open1, setOpen1] = useState(false)
    const[val, setVal] = useState("note 1")
    const[desc, setDesc] = useState("asgdui uidh huisdhio uisbdkhksdb juksdh ukhsgdujkg jkvd ")
    const date = new Date().toISOString()
    const[text,setText] = useState("")
    const[color,setColor] = useState("#fff")
    const[keynotes,setKeynotes] = useState<string[]>([])
    const dateConverter = new DateConverter()
    const theme = useAppSelector(state => state.profileReducer.theme)
    const [theme1,setTheme1] = useState(theme)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const [severity,setSeverity] = useState<Pair<string,string>>({first:"High severity",second:"#ffdff6ff"})
    const dispatch = useAppDispatch()
    let onChange = (textWrap:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let data = textWrap.target.value
        if (data.endsWith(',')) {
            setKeynotes([...keynotes,data.substring(0,data.length-1)])
            setText('')
        } else  
            setText(data)
    }
    return(
        <div style={{backgroundColor:"white"}}>
            {/* <SearchField placeholder="Search Note, member, etc" onChange={(text) => {}} onSearch={() => {}} theme={theme} isDropDownButton={false}/>
            <UserItemList image="" username="asd" onClick={() => {}} theme={theme}/>
            <SignIn open={open0} onClose={(event) => {setOpen0(false)}} onChangePassword={(text) => {setVal(text.currentTarget.value)}} 
                onChangeUsername={(text) => {setVal(text.currentTarget.value)}} onChangeAvatar={() => {}} onClickSignIn={() => {}}
                theme={theme} avatarPreview={{alt: "asda",src:""}} data={{username:val,password:val}}/>
            <Login open={open} onClose={(event) => {setOpen(false)}} onChangePassword={(text) => {setVal(text.currentTarget.value)}} 
                onChangeUsername={(text) => {setVal(text.currentTarget.value)}} onClickLogin={() => {}} onClickSignin={() => {setOpen0(true);setOpen(false)}}
                theme={theme} data={{username:val,password:val}}/>
            <Button variant="contained" onClick={() => {setOpen(true)}}>open</Button>
            <Button variant="contained" onClick={() => {setOpen1(true)}}>open</Button>
            <UserPreview profile={{username:"amar"} as Member} otherUsers={[{username:"group1",isMember:false},{username:"group2",isMember:false},{username:"group1",isMember:false},
                {username:"group1",isMember:false},{username:"group1",isMember:false},{username:"group1",isMember:false}]} 
                isProfile={false} isUpdate={false} theme={theme} openUpdateCont={false}
                onClickUpdate={() => {}} onClickCancelUpdate={() => {}}
                data={{username:"amar",oldPassword:val,newPassword:val,avatar:"",
                    onClickPasswordUpdate:() => {},
                    onUsernameChange:(username) => {setVal(username.currentTarget.value)},
                    onChangeAvatar:(avatar) => {},
                    onPasswordNewChange:(password) => {setVal(password.currentTarget.value)},
                    onPasswordOldChange:(password) => {setVal(password.currentTarget.value)},
                    onClickViewOtherUser: () => {}}} onTheme={() => {}}
            dataGroupMember={{id:"sghas",isMember:true} as Group} onClickSend={() => {}}/>*/}
            {/* <NoteList theme={theme!} noteUpdate={{title:"note 1",subtype: {name:"subtype 1",color:"cyan"},severity: severity,
                description: "asgdui uidh huisdhio uisbdkhksdb juksdh ukhsgdujkg jkvd ", keynotes: keynotes,createdBy: {first:"ama",second:"ids"},
                createdDate: date, lastModifiedBy: {first:"ama",second:"ids"}, lastModifiedDate: date,
                member: {username:"amar"}} as NoteCollab} dateConverter={new DateConverter()} keynoteText={text}
                onChangeDescription={(description) => {setDesc(description.target.value)}}
                onChangeTitle={(title) => {setVal(title.target.value)}} 
                onChangeKeynotes={onChange} openUpdateCont={false}
                onDeleteKeynotes={(keynote) => {setKeynotes(keynotes.filter(data => data !== keynote ))}}
                onClickCancel={() => {}} onClickSave={() => {}}
                onChangeSeverity={(severity) => {setSeverity(severity)}}/> */}
            {/* <UserItemListRequest image="" username="asd" onClick={() => {}} theme={theme} onClickAccept={() => {}} onClickReject={() => {}}/>
            <UserItemListReject image="" username="asd" onClick={() => {}} theme={theme} onClickDone={() => {}}/>
            <SketchPicker color={color} onChangeComplete={(color) => {setColor(color.hex);console.log(color.hex)}}/>
            <ThemeList theme={theme} onClick={() => {}} dateConverter={dateConverter}/>
            <ThemePreview isMyTheme={true} isUpdate={true} open={open1} onClose={() => {setOpen1(!open1)}} themeActive={theme} theme={theme} themeImage="" themeUpdate={theme1} 
                onThemeImageUpload={(file) => {}} onThemeUpdate={(theme) => {setTheme1(theme)}} onClickUpdate={() => {}} onClickCancelUpdate={() => {}}/> */}
            {/* <Button variant="contained" onClick={() => {dispatch(setRoute(ReduxRoute.THEME))}}>open</Button>
            <ThemeView adapterTheme={themeAdapter} dateConverter={dateConverter}/> */}
        </div>
    )
}