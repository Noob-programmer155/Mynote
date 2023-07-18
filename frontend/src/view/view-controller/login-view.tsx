import { useEffect, useState } from "react";
import { Login } from "../container/login";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { ReduxRoute } from "../../usecase/other/redux-item-route";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import { exhaustMap, interval, of, tap } from "rxjs";
import { PublicAdapter } from "../../adapter/public-adapter";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { setLogin, setProfile, setThemeProfile } from "../../configuration/redux/reducer/profile-reducer";
import { MemberAdapter } from "../../adapter/member-adapter";

interface LoginViewInterface {
    adapterPublic: PublicAdapter
    adapterMember: MemberAdapter
}
export function LoginView({adapterPublic,adapterMember}: LoginViewInterface) {
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [disableBtn,setDisableBtn] = useState(false)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const login = useAppSelector(state => state.profileReducer.login)
    const open = useAppSelector(state => state.routeReducer.route)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if(!login) return;
        let subs = interval(30000).pipe(
            exhaustMap(async () => {
                await adapterMember.getProfile(
                    (res) => {if(res) {
                        dispatch(setProfile(res))
                        dispatch(setThemeProfile(res.theme!))
                    }},
                    (err) => {if (err) dispatch(setMessage({message:err,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                return of({})
            })).subscribe()
        return () => subs.unsubscribe()
    },[login])

    const onClick = () => {
        of({}).pipe(
            tap(() => {setDisableBtn(true)}),
            exhaustMap(async () => {
                await adapterPublic.login({username:username,password:password},
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
            }),
            tap(() => {setDisableBtn(false);setUsername("");setPassword("")})
        ).subscribe()
    }

    return(
        <Login 
            open={open === ReduxRoute.SIGNUP} 
            onClose={() => {dispatch(setRoute(ReduxRoute.HOME))}} 
            onChangePassword={(text) => {setPassword(text.currentTarget.value)}}
            onChangeUsername={(text) => {setUsername(text.currentTarget.value)}}
            onClickLogin={() => {onClick()}}
            onClickSignin={() => {dispatch(setRoute(ReduxRoute.SIGNIN))}}
            disableLoginBtn={disableBtn}
            theme={themeProfile}
            data={{username:username,password:password}}
        />
    )
}