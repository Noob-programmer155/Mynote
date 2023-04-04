import { Button } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useAppSelector } from "../configuration/redux/hooks";
import { SearchField } from "./container/global";
import { Login } from "./container/login";
import { UserPreview } from "./container/user-container";
import { SignIn } from "./container/signup";
import { UserItemList, UserItemListReject, UserItemListRequest } from "./container/user-list";
import { NoteList } from "./container/note-container";
import { NoteCollab } from "../model/model";
import { DateConverter } from "../configuration/converter/attribute";
import { SketchPicker } from 'react-color'
import { from } from "rxjs";

export default function ViewTest(): JSX.Element {
    const[open, setOpen] = useState(false)
    const[val, setVal] = useState("note 1")
    const[desc, setDesc] = useState("asgdui uidh huisdhio uisbdkhksdb juksdh ukhsgdujkg jkvd ")
    const theme = useAppSelector(state => state.themeReducer.theme)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const date = new Date().toISOString()
    const[text,setText] = useState("")
    const[color,setColor] = useState("#fff")
    const[keynotes,setKeynotes] = useState<string[]>([])
    let onChange = (textWrap:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let data = textWrap.target.value
        if (data.endsWith(',')) {
            setKeynotes([...keynotes,data.substring(0,data.length-1)])
            setText('')
        } else  
            setText(data)
    }
    return(
        <div style={{background:"white"}}>
            <SearchField placeholder="Search Note, member, etc" onChange={(text) => {}} onSearch={() => {}} theme={theme}/>
            <UserItemList image="" username="asd" onClick={() => {}} theme={theme}/>
            <SignIn open={open} onClose={() => {setOpen(false)}} onChangePassword={(text) => {setVal(text.currentTarget.value)}} 
                onChangeUsername={(text) => {setVal(text.currentTarget.value)}} onChangeAvatar={() => {}} onClickSignIn={() => {}}
                theme={theme} avatarPreview={{alt: "asda",src:""}} data={{username:val,password:val}}/>
            <Button variant="contained" onClick={() => {setOpen(true)}}>open</Button>
            <UserPreview profile={{username:"amar"}} otherUsers={[{username:"group1"},{username:"group2"},{username:"group1"},{username:"group1"},{username:"group1"},{username:"group1"}]} 
                isProfile={true} isUpdate={true} theme={theme} openUpdateCont={false}
                onClickUpdate={() => {}} onClickCancelUpdate={() => {}}
                data={{username:"amar",oldPassword:val,newPassword:val,avatar:"",
                    onClickPasswordUpdate:() => {},
                    onUsernameChange:(username) => {setVal(username.currentTarget.value)},
                    onChangeAvatar:(avatar) => {},
                    onPasswordNewChange:(password) => {setVal(password.currentTarget.value)},
                    onPasswordOldChange:(password) => {setVal(password.currentTarget.value)},
                    onClickUser: () => {}}}/>
            <NoteList theme={theme} note={{title:"note 1",subtype: {name:"subtype 1",color:"cyan"}, severity: {first:"high_alert ",second:"red"},
                description: "asgdui uidh huisdhio uisbdkhksdb juksdh ukhsgdujkg jkvd ", keynotes: keynotes,createdBy: {first:"ama",second:"ids"},
                createdDate: date, lastModifiedBy: {first:"ama",second:"ids"}, lastModifiedDate: date,
                member: {username:"amar"}} as NoteCollab} dateConverter={new DateConverter()} title={val} description={desc} keynotes={text}
                onChangeDescription={(description) => {setDesc(description.target.value)}}
                onChangeTitle={(title) => {setVal(title.target.value)}} 
                onChangeKeynotes={onChange} openUpdateCont={false}
                onDeleteKeynotes={(keynote) => {setKeynotes(keynotes.filter(data => data !== keynote ))}}
                onClickCancel={() => {}} onClickSave={() => {}}/>
            <UserItemListRequest image="" username="asd" onClick={() => {}} theme={theme} onClickAccept={() => {}} onClickReject={() => {}}/>
            <UserItemListReject image="" username="asd" onClick={() => {}} theme={theme} onClickDone={() => {}}/>
            <SketchPicker color={color} onChangeComplete={(color) => {setColor(color.hex);console.log(color.hex);
            }}/>
        </div>
    )
}