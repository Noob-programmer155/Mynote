import { Backdrop, Box, Card, CardActionArea, CircularProgress, Divider, IconButton, Paper, Stack, Tab, Tabs, Tooltip, Typography, Zoom, useMediaQuery } from "@mui/material";
import { UIEvent, useEffect, useRef, useState } from "react";
import { SearchField, SearchSuggestContainer, StateThemeUtils, TabPanel, ThemeFab } from "../container/global";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { ThemeAdapter } from "../../adapter/theme-adapter";
import { EMPTY, Subject, debounceTime, distinctUntilChanged, every, exhaustMap, filter, iif, map, mergeMap, of, tap } from "rxjs";
import { setSearchGuess, setTheme, setThemePreview, setThemes } from "../../configuration/redux/reducer/theme-reducer";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ThemeList } from "../container/theme-container";
import { DateConverter, FileConverter } from "../../adapter/converter/attribute";
import { setThemeProfile, setThemesProfiles } from "../../configuration/redux/reducer/profile-reducer";
import { ReduxRoute } from "../../model/data/router-server/redux-item-route";
import { ThemePreview } from "../container/theme-container";
import { defaultTheme, limitFileTheme } from "../../model/resource";
import { setGlobalThemeSearch, setMyThemeSearch } from "../../configuration/redux/reducer/search-reducer";
import { Theme } from "../../model/model";
import { Add, AddCircle, ArrowBack, Close } from "@mui/icons-material";
import { validateName } from "../../usecase/other/validate";

interface ThemeViewInterface {
    adapterTheme: ThemeAdapter
    dateConverter: DateConverter
    fileConverter: FileConverter
}
export function ThemeView({adapterTheme,dateConverter,fileConverter}:ThemeViewInterface) {
    const large = useMediaQuery("(min-width:1000px)")
    const [tab, setTab] = useState(0)
    const [openView, setOpenView] = useState(false)
    const [isSaveContainer,setIsSaveContainer] = useState(false)
    const [disable, setDisable] = useState(false)
    const [loadingMyTheme,setLoadingMyTheme] = useState(false)
    const [loadingGlobal,setLoadingGlobal] = useState(false)
    const [loadingGuess,setLoadingGuess] = useState(false)
    const [searchNameTheme,setSearchNameTheme] = useState("")
    const [searchEv] = useState(() => new Subject<string>())
    const [image,setImage] = useState<string>()
    const refSearch = useRef<HTMLDivElement | null>(null)
    const route = useAppSelector(state => state.routeReducer.route)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const themesProfile = useAppSelector(state => state.profileReducer.themes)
    const themes = useAppSelector(state => state.themeReducer.themes)
    const myThemeSearch = useAppSelector(state => state.searchAndFilterReducer.myThemeSearch)
    const globalThemeSearch = useAppSelector(state => state.searchAndFilterReducer.globalThemeSearch)
    const themeGuess = useAppSelector(state => state.themeReducer.themeGuess)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (profile && profile.id) {
            if (route === ReduxRoute.THEME) {
                of({}).pipe(
                    tap(() => {setSearchNameTheme("")}),
                    tap(() => {dispatch(setGlobalThemeSearch({...globalThemeSearch,page:0,endPage:false}))}),
                    exhaustMap(async() => {
                        await adapterTheme.getSearchData({name:"",page:0,size:globalThemeSearch.size},
                            (themesNew) => {
                                if (themesNew.length < globalThemeSearch.size) {
                                    dispatch(setGlobalThemeSearch({...globalThemeSearch,endPage:true}))
                                }
                                dispatch(setThemes(themesNew))
                            },(error) => {
                                if (error)
                                    dispatch(setMessage({message:error,error:true}))   
                            }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    }),
                    every(() => profile !== undefined),
                    tap(() => {dispatch(setMyThemeSearch({...myThemeSearch,page:0,endPage:false}))}),
                    exhaustMap(async () => {
                        await adapterTheme.getMemberSearchData({name:"",page:0,size:myThemeSearch.size},
                            (themesNew) => {
                                if (themesNew.length < myThemeSearch.size) {
                                    dispatch(setMyThemeSearch({...myThemeSearch,endPage:true}))
                                }
                                dispatch(setThemesProfiles(themesNew))
                            },(error) => {
                                if (error)
                                    dispatch(setMessage({message:error,error:true}))   
                            }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    })
                ).subscribe()
            }  
        }
    },[route])

    useEffect(() => {
        searchEv.next(searchNameTheme)
    },[searchNameTheme])

    useEffect(() => {
        searchEv.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            mergeMap(item => iif(() => tab===1,of({}).pipe(
                tap(() => {setLoadingGuess(true)}),
                exhaustMap(async() => {
                    await adapterTheme.getSearch({name:item,page:0,size:5},
                        (themesNew) => {
                            dispatch(setSearchGuess(themesNew))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                tap(() => {setLoadingGuess(false)})
            ),of({}).pipe(
                tap(() => {setLoadingGuess(true)}),
                exhaustMap(async() => {
                    await adapterTheme.getMemberSearch({name:item,page:0,size:5},
                        (themesNew) => {
                            dispatch(setSearchGuess(themesNew))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                tap(() => {setLoadingGuess(false)})
            )))
        ).subscribe()
    },[])

    const onSearchMyTheme = (adapterTheme:ThemeAdapter,name:string,page:number,size:number,isGlobal:boolean) => {
        iif(() => isGlobal,of({}).pipe(
            tap(() => {dispatch(setGlobalThemeSearch({...globalThemeSearch,page:page,endPage:false}))}),
            exhaustMap(async() => {
                await adapterTheme.getSearchData({name:name,page:page,size:size},
                    (themesNew) => {
                        if (themesNew.length < globalThemeSearch.size) {
                            dispatch(setGlobalThemeSearch({...globalThemeSearch,endPage:true}))
                        }
                        dispatch(setThemes(themesNew))
                    },(error) => {
                        if (error)
                            dispatch(setMessage({message:error,error:true}))   
                    }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ),of({}).pipe(
            tap(() => {dispatch(setMyThemeSearch({...myThemeSearch,page:page,endPage:false}))}),
            exhaustMap(async() => {
                await adapterTheme.getMemberSearchData({name:name,page:page,size:size},
                    (themesNew) => {
                        if (themesNew.length < myThemeSearch.size) {
                            dispatch(setMyThemeSearch({...myThemeSearch,endPage:true}))
                        }
                        dispatch(setThemesProfiles(themesNew))
                    },(error) => {
                        if (error)
                            dispatch(setMessage({message:error,error:true}))   
                    }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        )).subscribe()
    }

    const onScrollMyTheme = (event:UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
        if(event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight && !loadingMyTheme) {
            iif(() => !myThemeSearch.endPage,of(myThemeSearch.page).pipe(
                tap(page => {dispatch(setMyThemeSearch({...myThemeSearch,page:page+1}))}),
                tap(() => {setLoadingMyTheme(true)}),
                exhaustMap(async() => {
                    await adapterTheme.getMemberSearchData({name:searchNameTheme,page:myThemeSearch.page+1,size:myThemeSearch.size},
                        (themesNew) => {
                            if (themesNew.length > 0) {
                                if (themesNew.length < myThemeSearch.size) {
                                    dispatch(setMyThemeSearch({...myThemeSearch,endPage:true}))
                                }
                            } else dispatch(setMyThemeSearch({...myThemeSearch,page:myThemeSearch.page-1,endPage:true}))
                            dispatch(setThemesProfiles([...themesProfile,...themesNew]))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                tap(() => {setLoadingMyTheme(false)})
            ),EMPTY).subscribe()
        }
    }

    const onScrollGlobal = (event:UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
        if(event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight && !loadingGlobal) {
            iif(() => !globalThemeSearch.endPage,of(globalThemeSearch.page).pipe(
                tap(page => {dispatch(setGlobalThemeSearch({...globalThemeSearch,page:page+1}))}),
                tap(() => {setLoadingGlobal(true)}),
                exhaustMap(async() => {
                    await adapterTheme.getSearchData({name:searchNameTheme,page:globalThemeSearch.page+1,size:globalThemeSearch.size},
                        (themesNew) => {
                            if (themesNew.length > 0) {
                                if (themesNew.length < globalThemeSearch.size) {
                                    dispatch(setGlobalThemeSearch({...globalThemeSearch,endPage:true}))
                                }
                            } else dispatch(setGlobalThemeSearch({...globalThemeSearch,page:globalThemeSearch.page-1,endPage:true}))
                            dispatch(setThemes([...themes,...themesNew]))
                        },(error) => {
                            if (error)
                                dispatch(setMessage({message:error,error:true}))   
                        }, (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                tap(() => {setLoadingGlobal(false)})
            ),EMPTY).subscribe()
        }
    }

    const onActivateTheme = (theme:Theme) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                await adapterTheme.activateTheme({theme: theme.id!},
                    (res) => {if (res) if(res.data) {
                            dispatch(setMessage({message:"Theme Activated",error:false}))
                            dispatch(setThemeProfile(theme))
                            dispatch(setRoute(ReduxRoute.HOME))
                        } else dispatch(setMessage({message:"Can`t Activate Theme",error:true}))},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onAddTheme = (theme:Theme) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                await adapterTheme.addTo({theme: theme.id!},
                    (res) => {if (res) if(res.data) {
                        dispatch(setMessage({message:"Theme Added",error:false}))
                        dispatch(setThemesProfiles([...themesProfile,{...theme,isMyTheme:true}]))
                        dispatch(setThemes([...themes.filter(item => item.id !== theme.id)]))
                    } else dispatch(setMessage({message:"Can`t Add Theme",error:true}))},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onRemoveTheme = (theme:Theme) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                await adapterTheme.removeFrom({theme: theme.id!},
                    (res) => {if (res) if(res.data) {
                        dispatch(setMessage({message:"Theme Removed",error:false}))
                        dispatch(setThemesProfiles([...themesProfile.filter(item => item.id !== theme.id)]))
                        dispatch(setThemes([...themes,{...theme,isMyTheme:false}]))
                    } else dispatch(setMessage({message:"Can`t Remove Theme",error:true}))},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    return(
        <>
            {(profile && profile.id)?
                <>
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 4}}
                        open={route === ReduxRoute.THEME}
                        onClick={() => {dispatch(setRoute(ReduxRoute.HOME))}}
                    >
                        <Paper sx={{backgroundColor:themeProfile.background_color,color:themeProfile.foreground_color,maxWidth:"2048px",maxHeight:"1080px",width:"90vw",height:"90vh",position:"relative"}} onClick={(event) => {event.stopPropagation()}}>
                            <Stack direction={(large)?"row":"column"} sx={{color:themeProfile.default_background,height:(large)?"100%":"80%"}}>
                                {(!large)?
                                    <Stack direction={"row"} sx={{width:"100%",justifyContent:"right"}}>
                                        <IconButton onClick={() => {dispatch(setRoute(ReduxRoute.HOME))}}>
                                            <Close sx={{color:themeProfile.danger_background,fontSize:"2rem"}}/>
                                        </IconButton>
                                    </Stack>:<></>
                                }
                                <Tabs orientation={(large)?"vertical":"horizontal"} variant={(large)?"standard":"fullWidth"} value={tab} onChange={(e,item) => {setSearchNameTheme("");setTab(item)}} 
                                    sx={{borderRight:(large)?2:0}}
                                    TabIndicatorProps={{sx:{backgroundColor:themeProfile.default_background}}} 
                                    textColor="inherit">
                                    <Tab value={0} label="My Theme" sx={{textTransform:"none"}}/>
                                    <Tab value={1} label="Others" sx={{textTransform:"none"}}/>
                                </Tabs>
                                <Stack sx={{width:"100%",height:"100%"}}>    
                                    <SearchField
                                        refTarget={refSearch}
                                        theme={themeProfile}
                                        value={searchNameTheme}
                                        onSearch={() => {onSearchMyTheme(adapterTheme,searchNameTheme,0,myThemeSearch.size,tab===1)}}
                                        onChange={(event) => {setSearchNameTheme(event.currentTarget.value)}}
                                        placeholder="Search theme name"
                                        isDropDownButton={false}
                                        sx={{margin:"10px"}}
                                    />
                                    <Divider/>
                                    <TabPanel
                                        targetValue={0}
                                        value={tab}
                                        sx={{color: themeProfile.foreground_color,margin:"10px",maxHeight:"100%",overflowY:"auto"}}
                                        props={{onScroll:onScrollMyTheme}}
                                    >
                                        <Typography variant="h3">Active Theme</Typography>
                                        <Grid2 container sx={{width:"100%"}}>
                                            <Grid2 id="theme-list--1" xs={12} sm={6} md={4} xl={3}>
                                                <ThemeList 
                                                    theme={themeProfile} 
                                                    onClick={() => {
                                                        dispatch(setThemePreview(themeProfile))
                                                        dispatch(setTheme(themeProfile))
                                                        setImage(undefined)
                                                        setIsSaveContainer(false)
                                                        setOpenView(true)
                                                    }}
                                                    dateConverter={dateConverter}
                                                    themeActive={themeProfile}
                                                    isActivate={true}
                                                    isDisabled={disable}
                                                />
                                            </Grid2>
                                        </Grid2>
                                        <Typography variant="h3" sx={{marginTop:"10px"}}>My Theme</Typography>
                                        <Grid2 container spacing={1} sx={{width:"100%"}}>
                                            {(themesProfile.length > 0)?themesProfile.filter(th => th.id !== themeProfile.id).map((themeProf,i) => (
                                                <Grid2 id={"theme-list-"+i} key={"theme-list-"+i} xs={12} sm={6} md={4} xl={3}>
                                                    <ThemeList 
                                                        key={"theme-list-item"+i}
                                                        theme={themeProf} 
                                                        onClick={() => {
                                                            setIsSaveContainer(false)
                                                            dispatch(setThemePreview(themeProf))
                                                            dispatch(setTheme(themeProf))
                                                            setOpenView(true)
                                                            setImage(undefined)
                                                        }}
                                                        dateConverter={dateConverter}
                                                        themeActive={themeProfile}
                                                        isActivate={false}
                                                        isDisabled={disable}
                                                        onClickActivate={() => {
                                                            onActivateTheme(themeProf)
                                                        }}
                                                        onClickRemove={() => {
                                                            onRemoveTheme(themeProf)
                                                        }}
                                                    />
                                                </Grid2>
                                            )):<Grid2 xs={12}><Typography textAlign="center">No Item</Typography></Grid2>}
                                        </Grid2>
                                        {(loadingMyTheme)?
                                            <Box sx={{color:themeProfile.default_background}}>
                                                <CircularProgress color="inherit"/>
                                            </Box>:<></>
                                        }
                                    </TabPanel>
                                    <TabPanel
                                        targetValue={1}
                                        value={tab}
                                        sx={{color: themeProfile.foreground_color,margin:"10px",maxHeight:"100%",overflowY:"auto"}}
                                        props={{onScroll:onScrollGlobal}}
                                    >
                                        <Grid2 container spacing={1} sx={{width:"100%"}}>
                                            {(themes.length > 0)?themes.map((themeProf,i) => (
                                                <Grid2 id={"theme-list-all"+i} key={"theme-list-all"+i} xs={12} sm={6} md={4} xl={3}>
                                                    <ThemeList
                                                        key={"theme-list-all-item"+i}
                                                        theme={themeProf} 
                                                        onClick={() => {
                                                            setIsSaveContainer(false)
                                                            dispatch(setThemePreview(themeProf))
                                                            dispatch(setTheme(themeProf))
                                                            setOpenView(true)
                                                            setImage(undefined)
                                                        }}
                                                        themeActive={themeProfile}
                                                        isActivate={false}
                                                        isDisabled={disable}
                                                        onClickAdd={() => {
                                                            onAddTheme(themeProf)
                                                        }}
                                                        dateConverter={dateConverter}
                                                        />
                                                </Grid2>  
                                            )):<Grid2 xs={12}><Typography textAlign="center">No Item</Typography></Grid2>}
                                        </Grid2>
                                        {(loadingGlobal)?
                                            <Box sx={{color:themeProfile.default_background}}>
                                                <CircularProgress color="inherit"/>
                                            </Box>:<></>
                                        }
                                    </TabPanel>
                                </Stack>
                            </Stack>
                            <Zoom in={tab === 0}>
                                <Tooltip title={"add new themes"}>
                                    <ThemeFab
                                        themeObj={themeProfile}
                                        state={StateThemeUtils.DEFAULT}
                                        onClick={() => {
                                            dispatch(setThemePreview(defaultTheme))
                                            dispatch(setTheme(defaultTheme))
                                            setIsSaveContainer(true)
                                            setOpenView(true)
                                            setImage(undefined)
                                        }}
                                        sx={{position:"absolute",bottom:"2rem",right:"30px"}}
                                    >
                                        <Add color="inherit"/>
                                    </ThemeFab>
                                </Tooltip>
                            </Zoom>
                        </Paper>
                    </Backdrop>
                    <ThemePreviewView adapterTheme={adapterTheme} image={image} setImage={(data) => {setImage(data)}} open={openView} isSave={isSaveContainer} onClose={() => {if (isSaveContainer) setIsSaveContainer(false); setOpenView(!openView)}} fileConverter={fileConverter}/>
                    <SearchSuggestContainer
                        open={themeGuess.length > 0}
                        data={themeGuess}
                        loading={loadingGuess}
                        sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}
                        refTarget={refSearch.current}
                        sxPaper={{width:`${(refSearch.current)? refSearch.current.offsetWidth:0}px`,backgroundColor:themeProfile.background_color,color:themeProfile.foreground_color,maxHeight:"50vh",overflowY:"auto"}}
                        colorLoading={themeProfile.foreground_color}
                        onClose={() => {dispatch(setSearchGuess([]))}}
                        onClick={(data) => {setSearchNameTheme(data.name)}}
                    />
                </>:null
            }
        </>
    )
}

interface ThemePreviewViewInterface {
    adapterTheme: ThemeAdapter
    open: boolean
    onClose: () => void
    image:string|undefined
    setImage:(data:string|undefined) => void
    isSave:boolean
    fileConverter: FileConverter
}
function ThemePreviewView({adapterTheme,open,image,onClose,setImage,isSave,fileConverter}:ThemePreviewViewInterface) {
    const [avatar,setAvatar] = useState<Blob>()
    const [disable,setDisable] = useState(false)
    const [errorVal,setErrorVal] = useState(false)
    const theme = useAppSelector(state => state.themeReducer.themePreview)
    const themeUpdate = useAppSelector(state => state.themeReducer.theme)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const themes = useAppSelector(state => state.profileReducer.themes)
    const dispatch =useAppDispatch()

    useEffect(() => {
        setAvatar(undefined)
    },[theme])

    const onUpdate = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(avatar)
                    await adapterTheme.modify({data: {...themeUpdate!,background_images:undefined}, image:avatar},
                        (theme) => {if (theme) {
                            dispatch(setThemesProfiles([...themes.filter(item => item.id! !== theme.id!),theme]))
                            dispatch(setMessage({message:"Theme Modified",error:false}))
                        }},
                        (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                else
                    await adapterTheme.modify({data: {...themeUpdate!,background_images:undefined}},
                        (theme) => {if (theme) {
                            dispatch(setThemesProfiles([...themes.filter(item => item.id! !== theme.id!),theme]))
                            dispatch(setMessage({message:"Theme Modified",error:false}))
                        }},
                        (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false);onClose()})
        ).subscribe()
    }

    const onSave = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(avatar)
                    await adapterTheme.save({data: {...themeUpdate!,background_images:undefined}, image:avatar},
                        (theme) => {if (theme) {
                            dispatch(setThemesProfiles([...themes.filter(item => item.id! !== theme.id!),theme]))
                            dispatch(setMessage({message:"Theme Saved",error:false}))
                        }},
                        (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                else
                    await adapterTheme.save({data: {...themeUpdate!,background_images:undefined}},
                        (theme) => {if (theme) {
                            dispatch(setThemesProfiles([...themes.filter(item => item.id! !== theme.id!),theme]))
                            dispatch(setMessage({message:"Theme Saved",error:false}))
                        }},
                        (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false);onClose()})
        ).subscribe()
    }

    const onValidate = (name:string) => {
        of(name).pipe(
            filter(name => validateName(name)),
            map(name => {dispatch(setTheme({...themeUpdate!,name:name}));return name}),
            exhaustMap(async(name) => {
                await adapterTheme.validate({name: name},
                    (res) => {if(res)if(res.data) setErrorVal(false); else setErrorVal(true)},
                    (error) => {if (error) dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    }
    return(
        (theme && profile)?((isSave)?
            <ThemePreview
                open={open}
                isMyTheme={true}
                isUpdate={true}
                isDisabled={disable}
                isError={errorVal}
                themeActive={themeProfile}
                theme={theme}
                themeUpdate={themeUpdate!}
                image={image}
                onThemeImageUpload={(file) => {
                    if (file.currentTarget.files) {
                        if (file.currentTarget.files[0].size < limitFileTheme) {
                            setAvatar(file.currentTarget.files[0])
                            fileConverter.to(file.currentTarget.files[0],(avatar) => {setImage(avatar)})
                        } else dispatch(setMessage({message:"limit file exceeded,file must lower than/equals 10mb",error:true})) 
                    }
                }}
                onChangeName={(text) => {onValidate(text.currentTarget.value)}}
                onThemeUpdate={(theme) => {dispatch(setTheme(theme))}}
                onClickSave={onSave}
                onClose={onClose}
            />:
            <ThemePreview
                open={open}
                isMyTheme={theme.createdBy!.second === profile.id!}
                isUpdate={JSON.stringify(theme) !== JSON.stringify(themeUpdate)}
                isDisabled={disable}
                isError={errorVal}
                themeActive={themeProfile}
                theme={theme}
                themeUpdate={themeUpdate!}
                image={image}
                onThemeImageUpload={(file) => {
                    if (file.currentTarget.files) {
                        if (file.currentTarget.files[0].size < limitFileTheme) {
                            setAvatar(file.currentTarget.files[0])
                            fileConverter.to(file.currentTarget.files[0],(avatar) => {setImage(avatar)})
                        } else dispatch(setMessage({message:"limit file exceeded,file must lower than/equals 10mb",error:true})) 
                    }
                }}
                onChangeName={(text) => {onValidate(text.currentTarget.value)}}
                onThemeUpdate={(theme) => {dispatch(setTheme(theme))}}
                onClickCancelUpdate={() => {dispatch(setTheme(theme!))}}
                onClickUpdate={onUpdate}
                onClose={onClose}
            />):null
    )
}