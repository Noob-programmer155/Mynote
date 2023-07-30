import { useEffect, useState } from "react"
import { PublicAdapter } from "../../adapter/public-adapter"
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks"
import { SignInMember, SignInGroup } from "../container/signup"
import { ReduxRoute } from "../../model/data/router-server/redux-item-route"
import { setRoute } from "../../configuration/redux/reducer/route-reducer"
import { exhaustMap, filter, iif, map, mergeMap, of, tap } from "rxjs"
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer"
import { FileConverter } from "../../adapter/converter/attribute"
import { MemberAdapter } from "../../adapter/member-adapter"
import { GroupAdapter } from "../../adapter/group-adapter"
import { setGroupProfile, setGroupsProfiles, setLogin, setProfile, setThemeProfile } from "../../configuration/redux/reducer/profile-reducer"
import { setMember } from "../../configuration/redux/reducer/member-reducer"
import { setGroup } from "../../configuration/redux/reducer/group-reducer"
import { ValidateSaveVariable, validateName } from "../../usecase/other/validate" 
import { limitFileUser } from "../../model/resource"

interface SignInMemberViewInterface {
    adapterPublic: PublicAdapter
    adapterMember: MemberAdapter
    fileConverter: FileConverter
}
export function SignInMemberView({adapterPublic,adapterMember,fileConverter}: SignInMemberViewInterface) {
    const [avatar,setAvatar] = useState<Blob>()
    const [disableBtn,setDisableBtn] = useState(false)
    const [errorVal,setErrorVal] = useState(false)
    const open = useAppSelector(state => state.routeReducer.route)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const newProfile = useAppSelector(state => state.memberReducer.member)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if(open) {
            dispatch(setMember({username: "",password: "",avatar:""}))
            setAvatar(undefined)
        }
    },[open])
    const onClick = () => {
        of({}).pipe(
            tap(() => {setDisableBtn(true)}),
            exhaustMap(async () => {
                if (newProfile && ValidateSaveVariable.validateMember(newProfile)) {
                    if(avatar)
                        await adapterPublic.signIn({data:{username:newProfile.username,password:newProfile.password},image:avatar},
                            async (res) => {if (res) {
                                dispatch(setMessage({message:res.data,error:false}))
                                dispatch(setLogin(true))
                                await adapterMember.getProfile(
                                    (res) => {if(res) {
                                        dispatch(setProfile(res))
                                        dispatch(setThemeProfile(res.theme!))
                                        dispatch(setRoute(ReduxRoute.HOME))
                                    }},
                                    (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                            }},
                            (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    else
                        await adapterPublic.signIn({data:{username:newProfile.username,password:newProfile.password}},
                            async (res) => {if(res) {
                                dispatch(setMessage({message:res.data,error:false}))
                                dispatch(setLogin(true))
                                await adapterMember.getProfile(
                                    (res) => {if(res) {
                                        dispatch(setProfile(res))
                                        dispatch(setThemeProfile(res.theme!))
                                        dispatch(setRoute(ReduxRoute.HOME))
                                    }},
                                    (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                            }},
                            (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else {
                    dispatch(setMessage({message:"all important field must be added",error:true}))
                }
            }),
            tap(() => {setDisableBtn(false)})
        ).subscribe()
    }

    const onValidateMember = (name:string) => {
        of(name).pipe(
            tap(() => {setDisableBtn(true)}),
            filter(name => validateName(name)),
            map(name => {dispatch(setMember({...newProfile,username:name}));return name}),
            exhaustMap(async (name) => {
                await adapterPublic.validateUserName({name:name},
                    (res) => {if(res)if(res.data){setDisableBtn(false);setErrorVal(false)}else setErrorVal(true)},
                    (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))}
                )
            })
        ).subscribe()
    }

    return(
        <>
            {(newProfile && (!newProfile.id || newProfile.id && newProfile.id.length <= 0))?
                <SignInMember
                    open={open === ReduxRoute.SIGNIN} 
                    onClose={() => {dispatch(setRoute(ReduxRoute.HOME))}} 
                    onChangePassword={(text) => {dispatch(setMember({...newProfile,password:text.currentTarget.value}))}}
                    onChangeUsername={(text) => {onValidateMember(text.currentTarget.value)}}
                    onClickSignIn={() => {onClick()}}
                    onChangeAvatar={(file) => {
                        if (file.currentTarget.files) {
                            if (file.currentTarget.files[0].size < limitFileUser) {
                                setAvatar(file.currentTarget.files[0])
                                fileConverter.to(file.currentTarget.files[0],(avatar) => {dispatch(setMember({...newProfile,avatar:avatar}))})
                            } else dispatch(setMessage({message:"limit file exceeded,file must lower than/equals 5mb",error:true}))
                        }
                    }}
                    avatarPreview={newProfile.avatar}
                    disableSignInBtn={disableBtn}
                    errorValidateUsername={errorVal}
                    theme={themeProfile}
                    username={newProfile.username}
                    password={newProfile.password!}
                />:null
            }
        </>
    )
}

interface SignInGroupViewInterface {
    adapterGroup: GroupAdapter
    fileConverter: FileConverter
    open: boolean,
    onClose: () => void
}
export function SignInGroupView({adapterGroup,fileConverter,open,onClose}: SignInGroupViewInterface) {
    const [avatar,setAvatar] = useState<Blob>()
    const [disableBtn,setDisableBtn] = useState(false)
    const [errorVal,setErrorVal] = useState(false)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const groupProfiles = useAppSelector(state => state.profileReducer.groups)
    const group = useAppSelector(state => state.groupReducer.group)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if(open) {
            dispatch(setGroup({username: "", avatar:""}))
            setAvatar(undefined)
        }
    },[open])
    const onClick = () => {
        of({}).pipe(
            tap(() => {setDisableBtn(true)}),
            exhaustMap(async () => {
                if(group && ValidateSaveVariable.validateGroup(group)) {
                    if(avatar)
                        await adapterGroup.save({data:{username:group.username},image:avatar},
                            (group) => {if (group) {
                                dispatch(setGroupProfile(group))
                                dispatch(setGroupsProfiles([...groupProfiles,group]))
                                dispatch(setMessage({message:"create group success",error:false}))
                                onClose()}
                            },
                            (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    else
                        await adapterGroup.save({data:{username:group.username}},
                            (group) => {if (group) {
                                dispatch(setGroupProfile(group))
                                dispatch(setMessage({message:"create group success",error:false}))
                                dispatch(setGroupsProfiles([...groupProfiles,group]))
                                onClose()}
                            },
                            (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                } else {
                    dispatch(setMessage({message:"all important field must be added",error:true}))
                }
            }),
            tap(() => {setDisableBtn(false)})
        ).subscribe()
    }

    const onValidateGroup = (name:string) => {
        of(name).pipe(
            filter(name => validateName(name)),
            map(name => {dispatch(setGroup({...group,username:name}));return name}),
            exhaustMap(async (name) => {
                await adapterGroup.validate({name:name},
                    (res) => {if(res)if(res.data){setDisableBtn(false);setErrorVal(false)}else setErrorVal(true)},
                    (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))}
                )  
            })
        ).subscribe()
    }

    return(
        <>
            {(group && (!group.id || group.id && group.id.length <= 0))?
                <SignInGroup 
                    open={open} 
                    onClose={onClose} 
                    onChangeUsername={(text) => {onValidateGroup(text.currentTarget.value)}}
                    onClickCreate={onClick}
                    onChangeAvatar={(file) => {
                        if (file.currentTarget.files) {
                            if (file.currentTarget.files[0].size < limitFileUser) {
                                setAvatar(file.currentTarget.files[0])
                                fileConverter.to(file.currentTarget.files[0],(avatar) => {dispatch(setGroup({...group,avatar:avatar}))})
                            } else dispatch(setMessage({message:"limit file exceeded,file must lower than/equals 5mb",error:true}))
                        }
                    }}
                    avatarPreview={group.avatar}
                    disableSignInBtn={disableBtn}
                    errorValidateUsername={errorVal}
                    theme={themeProfile}
                    username={group.username}
                />:null
            }
        </>
    )
}