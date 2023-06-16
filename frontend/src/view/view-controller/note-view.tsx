import { Backdrop, Badge, Box, Card, CardActionArea, CardActions, CardContent, Chip, CircularProgress, Divider, Drawer, FormControlLabel, IconButton, InputAdornment, Menu, MenuItem, Paper, Slide, Stack, Switch, SxProps, Theme, Tooltip, Typography, Zoom, useMediaQuery } from "@mui/material";
import { NoteAdapter } from "../../adapter/note-adapter";
import { SearchField, SearchSuggestContainer, StateThemeUtils, ThemeButton, ThemeFab, ThemeSwitch, ThemeTextField } from "../container/global";
import { useAppDispatch, useAppSelector } from "../../configuration/redux/hooks";
import { Add, AddCircle, ArrowBackRounded, Delete, Edit, FilterAlt, InfoRounded, Notifications, OpenInNew, OpenInNewRounded, Palette, People, Square } from "@mui/icons-material";
import { Group, Member, NoteCollab, NotePrivate, Subtype, Theme as ThemeObj } from "../../model/model";
import { GroupAdapter } from "../../adapter/group-adapter";
import React, { ChangeEvent, DragEvent, MouseEvent, MutableRefObject, UIEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EMPTY, every, exhaustMap, filter, iif, interval, map, mergeMap, of, switchMap, tap } from "rxjs";
import { setMessage } from "../../configuration/redux/reducer/message-response-reducer";
import { setRoute } from "../../configuration/redux/reducer/route-reducer";
import { NoteList } from "../container/note-container";
import { delimiter, emptyNotesId } from "../../model/data/resource/resource"
import { DateConverter, NoteCollabArrayConverter, NotePrivateArrayConverter } from "../../adapter/converter/attribute";
import { setNoteCollab, setNotePrivate, setNotePrivates, setSubtype, setSubtypes } from "../../configuration/redux/reducer/note-reducer";
import { SubtypeAdapter } from "../../adapter/subtype-adapter";
import { PublicAdapter } from "../../adapter/public-adapter";
import { SketchPicker } from "react-color";
import { ProfileGroupMemberView } from "./user-view";
import { IdAndName, Single } from "../../model/model-side";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { setNoteCollabFilter, setNoteCollabSearch, setNotePrivateFilter, setNotePrivateSearch } from "../../configuration/redux/reducer/search-reducer";
import { instanceofModel } from "../../model/model";
import { setGroupMemberProfiles, setGroupProfile } from "../../configuration/redux/reducer/profile-reducer";
import { setGroup, setGroupPreview, setOpenProfile as groupOpenProfile } from "../../configuration/redux/reducer/group-reducer";
import { ValidateAndSortArrayModel, ValidateLastModels, ValidateSaveVariable } from "../../adapter/other/validate";
import { setOpenNotificationGroup } from "../../configuration/redux/reducer/notification-reducer";

interface NoteGroupViewInterface {
    adapterNote: NoteAdapter
    adapterGroup: GroupAdapter
    adapterPublic: PublicAdapter
    adapterSubtype: SubtypeAdapter
    dateConverter: DateConverter
    noteArrayCollabConverter: NoteCollabArrayConverter
    noteArrayPrivateConverter: NotePrivateArrayConverter
    sx?: SxProps<Theme>
}
export function GroupNoteView({adapterGroup,adapterNote,adapterPublic,adapterSubtype,dateConverter,noteArrayCollabConverter,noteArrayPrivateConverter,sx}:NoteGroupViewInterface) {
    const [notesDataSearch,setNotesDataSearch] = useState<NoteCollab[]>([])
    const [subtypeGuess,setSubtypeGuess] = useState<IdAndName<string>[]>([])
    const [memberGuess,setMemberGuess] = useState<IdAndName<string>[]>([])
    const [loadingGuess,setLoadingGuess] = useState(false)
    const [loading,setLoading] = useState(false)
    const [disable,setDisable] = useState(false)
    const [isSearch,setIsSearch] = useState(false)
    const [open,setOpen] = useState(false)
    const [openAdd,setOpenAdd] = useState(false)
    const [openMembers,setOpenMembers] = useState(false)
    const filterNote = useAppSelector(state => state.searchAndFilterReducer.noteCollabFilter)
    const searchNote = useAppSelector(state => state.searchAndFilterReducer.noteCollabSearch)
    const subtypeAdd = useAppSelector(state => state.noteReducer.subtype)
    const subtypes = useAppSelector(state => state.noteReducer.subtypes)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const groupProfiles = useAppSelector(state => state.profileReducer.groups)
    const groupProfile = useAppSelector(state => state.profileReducer.group)
    const members = useAppSelector(state => state.profileReducer.members)
    const refSubtypeGuess = useRef<HTMLDivElement | null>(null)
    const dispatch = useAppDispatch()
    const subtypeReq = of({}).pipe(
        tap(() => {
            var groups = groupProfiles.filter(item => item.id === groupProfile?.id) 
            if (groups.length > 0 && groups[0] !== groupProfile) {
                dispatch(setGroupProfile(groups[0]))
            }
        }),
        exhaustMap(async() => {
            if(groupProfile) {
                await adapterPublic.getSubtype({group:groupProfile.id!},
                    (subtypesObj) => {
                        if (subtypesObj.length > 1) {
                            let data = ValidateAndSortArrayModel.validateArraySubtype(subtypes,subtypesObj,false)
                            if (!data.first) dispatch(setSubtypes(data.second))
                        } else if (subtypesObj.length > 0) {
                            let data = ValidateLastModels.validateSubtype(subtypes,subtypesObj[0])
                            if (!data) dispatch(setSubtypes(subtypesObj))
                        }
                    },
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                await adapterGroup.getAllMember({group:groupProfile.id!},
                    (membersObj) => {
                        if (membersObj.length > 1) {
                            let data = ValidateAndSortArrayModel.validateArrayMember(members,membersObj)
                            if (!data.first) dispatch(setGroupMemberProfiles(data.second))
                        } else if (membersObj.length > 0) {
                            let data = ValidateLastModels.validateMember(members,membersObj[0])
                            if (!data) dispatch(setGroupMemberProfiles(membersObj))
                        }
                    },
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }
            return of({})
        })
    )

    useEffect(() => {
        if (!profile || !groupProfile || (profile && !profile.id) || searchNote.name.length > 0) return;
        let sub = subtypeReq.subscribe()
        return () => sub.unsubscribe()
    },[profile,searchNote,groupProfile])

    const onSearch = (text?:string) => {
        iif(() => groupProfile !== undefined,of(text).pipe(
            tap(() => {setLoading(true)}),
            mergeMap((name) => iif(() => name !== undefined,of(name),of(searchNote.name))),
            tap((name) => {dispatch(setNoteCollabSearch({...searchNote,name:name!,page:0,endPage:false}))}),
            exhaustMap(async(name) => {
                await adapterNote.getSearchGroup({name:name!,group:groupProfile!.id!,page:0,size:searchNote.size},
                    (notesObj) => {
                        if (notesObj.length < searchNote.size)
                            dispatch(setNoteCollabSearch({...searchNote,name:name!,endPage:true}))
                        setNotesDataSearch((notesObj.length > 0)?notesObj:[{id:emptyNotesId,title:"",severity:{first:"",second:""},description:"",subtype:{name:"name"}}])
                    },
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setLoading(false)})
        ),EMPTY).subscribe()
    }
    const onFilter = useCallback(() => {
        iif(() => groupProfile !== undefined,of({}).pipe(
            tap(() => {setDisable(true);setLoading(true)}),
            exhaustMap(async() => {
                await adapterNote.getFilterGroup({subtypes:filterNote.subtypes?.map(item => item.id),severities:filterNote.severities,member:filterNote.member,group:groupProfile!.id!,page:0,size:searchNote.size},
                    (notesObj) => {
                        if (notesObj.length < searchNote.size)
                            dispatch(setNoteCollabSearch({...searchNote,endPage:true}))
                        setNotesDataSearch((notesObj.length > 0)?notesObj:[{id:emptyNotesId,title:"",severity:{first:"",second:""},description:"",subtype:{name:"name"}}])
                        dispatch(setNoteCollabFilter({subtypes:undefined,severities:undefined,member:undefined}))
                        setOpen(!open)
                    },
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false);setLoading(false)})
        ),EMPTY).subscribe()
    },[filterNote])
    const onScroll = (event: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
        if (!loading && event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight) {
            iif(() => !searchNote.endPage && groupProfile !== undefined,of({}).pipe(
                tap(() => {dispatch(setNoteCollabSearch({...searchNote,page:searchNote.page+1}));setLoading(true)}),
                mergeMap(() => 
                    iif(() => isSearch,of({}).pipe(
                        exhaustMap(async() => {
                            await adapterNote.getSearchGroup({name:searchNote.name,group:groupProfile!.id!,page:searchNote.page,size:searchNote.size},
                                (notesObj) => {
                                    if (notesObj.length > 0) {
                                        if (notesObj.length < searchNote.size)
                                            dispatch(setNoteCollabSearch({...searchNote,endPage:true}))
                                    } else dispatch(setNoteCollabSearch({...searchNote,page:searchNote.page-1,endPage:true}))
                                    setNotesDataSearch([...notesDataSearch,...notesObj])
                                },
                                (error) => {dispatch(setMessage({message:error,error:true}))},
                                (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                        })
                    ),of({}).pipe(
                        exhaustMap(async() => {
                            await adapterNote.getFilterGroup({subtypes:filterNote.subtypes?.map(item => item.id),severities:filterNote.severities,member:filterNote.member,group:groupProfile!.id!,page:searchNote.page,size:searchNote.size},
                                (notesObj) => {
                                    if (notesObj.length > 0) {
                                        if (notesObj.length < searchNote.size)
                                            dispatch(setNoteCollabSearch({...searchNote,endPage:true}))
                                    } else dispatch(setNoteCollabSearch({...searchNote,page:searchNote.page-1,endPage:true}))
                                    setNotesDataSearch([...notesDataSearch,...notesObj])
                                },
                                (error) => {dispatch(setMessage({message:error,error:true}))},
                                (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                        })
                    ))
                ),
                tap(() => {setLoading(false)})
            ),EMPTY).subscribe()
        }
    }
    const onSubtypeGuess = (name:string) => {
        of(name).pipe(
            tap(name => {dispatch(setSubtype({...subtypeAdd,name:name}))}),
            tap(() => {setLoadingGuess(true)}),
            exhaustMap(async(name) => {
                if (subtypeAdd) {
                    await adapterPublic.getSubtypeSearch({name:name,page:0,size:5},
                        (subtypes) => {setSubtypeGuess(subtypes.map(item => {return {name:item.name,id:item.id!}}))},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }
            }),
            tap(() => {setLoadingGuess(false)})
        ).subscribe()
    }
    const onMemberGuess = (name:string) => {
        of(name).pipe(
            tap(name => {dispatch(setNoteCollabFilter({...filterNote,member:name}))}),
            tap(() => {setLoadingGuess(true)}),
            exhaustMap(async(name) => {
                setMemberGuess(members.filter(item => item.username.match(new RegExp(`.*${name}`,'g'))).map(item => {return {name:item.username,id:item.id!}}))
            }),
            tap(() => {setLoadingGuess(false)})
        ).subscribe()
    }
    const onAddSubtype = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if (groupProfile && subtypeAdd) 
                    await adapterSubtype.save({index:subtypes.length+1,group:groupProfile.id!},subtypeAdd,
                        (subtypeObj) => {
                            if (subtypeObj) {
                                dispatch(setMessage({message:"Save Subtype Success",error:false}))
                                setOpenAdd(!openAdd)
                                dispatch(setSubtypes([...subtypes,subtypeObj]))}
                        },
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)}),
        ).subscribe()
    }
    const handleClose = () => {
        setOpen(!open)
    }
    const handleClearMemberGuess = useCallback(() => {
        setMemberGuess([])
    },[])
    return(
        <>
            {(groupProfile)?
                <Stack sx={{width:"100%",...sx}}>
                    <HeaderContainerNote
                        ids="search-field-note-collab"
                        key="search-field-note-collab"
                        search={searchNote.name}
                        onSearch={() => {setIsSearch(true);onSearch()}}
                        onChange={(text) => {setIsSearch(true);onSearch(text.currentTarget.value)}}
                        onClear={() => {dispatch(setNoteCollabSearch({...searchNote,name:""}));setNotesDataSearch([])}}
                        onClickFilter={() => {setIsSearch(false);setOpen(!open)}}
                        onClickInfo={() => {
                            dispatch(setGroupPreview({group:groupProfile!}))
                            dispatch(setGroup({...groupProfile!,avatar:undefined}))
                            dispatch(groupOpenProfile(true))
                        }}
                        onClickAddSubtype={() => {dispatch(setSubtype({name:"",color:"#FFFFFFFF"}));setOpenAdd(true)}}
                        onClickMembers={() => {setOpenMembers(true)}}
                    />
                    <BodyContainer
                        adapterNote={adapterNote}
                        adapterPublic={adapterPublic}
                        adapterSubtype={adapterSubtype}
                        dateConverter={dateConverter}
                        noteArrayCollabConverter={noteArrayCollabConverter}
                        noteArrayPrivateConverter={noteArrayPrivateConverter}
                        theme={themeProfile}
                        members={members}
                        openMember={openMembers}
                        onOpenMember={(data)=> {setOpenMembers(data)}}
                        group={groupProfile}
                        triggerOpenSearch={notesDataSearch.length > 0}
                        onScrollSearchAndFilter={onScroll}
                        onCloseSearchAndFilter={() => {dispatch(setNoteCollabSearch({...searchNote,name:""}));setNotesDataSearch([])}}
                        dataSearchAndFilter={notesDataSearch}
                        loadingSearchAndFilter={loading}
                    />
                    <ContainerFilterNoteCollab
                        adapterNote={adapterNote}
                        adapterPublic={adapterPublic}
                        disable={disable}
                        memberName={filterNote.member}
                        dataMemberGuess={memberGuess}
                        loadingGuess={loadingGuess}
                        open={open}
                        group={groupProfile}
                        theme={themeProfile}
                        onClose={handleClose}
                        onFilter={() => {dispatch(setNoteCollabSearch({...searchNote,page:0,endPage:false}));onFilter()}}
                        onMemberNameGuess={(item) => {onMemberGuess(item)}}
                        onClearMemberGuess={handleClearMemberGuess}
                    />
                    {(subtypeAdd)?
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                            open={openAdd}
                            onClick={() => {setOpenAdd(!openAdd)}}
                        >
                            <Paper onClick={(e) => {e.stopPropagation()}} sx={{overflowY:"auto",maxHeight:"100%",backgroundColor:themeProfile.background_color.substring(0,7)+"BC",color:themeProfile.foreground_color}}>
                                <CardContent sx={{maxWidth:"100%"}}>
                                    <Stack spacing={2}>
                                        <ThemeTextField
                                            value={subtypeAdd.name}
                                            ref={refSubtypeGuess}
                                            themeObj={themeProfile}
                                            label="add subtype"
                                            state={StateThemeUtils.DEFAULT}
                                            onChange={(event) => {onSubtypeGuess(event.currentTarget.value)}}
                                        />
                                        <Stack sx={{alignItems:"center"}}>
                                            <SketchPicker
                                                color={subtypeAdd.color}
                                                onChangeComplete={(color) => {dispatch(setSubtype({...subtypeAdd,color:color.hex.toUpperCase()+"FF"}))}}
                                            />
                                        </Stack>
                                    </Stack>
                                </CardContent>
                                <CardActions>
                                    <ThemeButton
                                        variant="contained"
                                        themeObj={themeProfile}
                                        state={StateThemeUtils.DEFAULT}
                                        onClick={onAddSubtype}
                                        sx={{marginLeft:"auto",marginRight:"10px",textTransform:"none"}}
                                    >
                                        Add Subtype
                                    </ThemeButton>
                                </CardActions>
                            </Paper>
                        </Backdrop>:null
                    }
                    <SearchSuggestContainer
                        open={subtypeGuess.length > 0}
                        data={subtypeGuess}
                        loading={loadingGuess}
                        refTarget={refSubtypeGuess.current}
                        sx={{zIndex: (theme) => theme.zIndex.drawer + 2}}
                        colorLoading={themeProfile.foreground_color}
                        sxPaper={{width:`${(refSubtypeGuess.current)?refSubtypeGuess.current.offsetWidth:0}px`,maxHeight:"50vh",overflowY:"auto",backgroundColor:themeProfile.background_color,color:themeProfile.foreground_color}}
                        onClick={(data) => {dispatch(setSubtype(data))}}
                        onClose={() => {setSubtypeGuess([]);dispatch(setSubtype({name:""}))}}
                    />
                </Stack>:null
            }
        </>
    )
}

interface PrivateViewInterface {
    adapterNote: NoteAdapter
    adapterPublic: PublicAdapter
    adapterSubtype: SubtypeAdapter
    dateConverter: DateConverter
    noteArrayPrivateConverter: NotePrivateArrayConverter
    sx?: SxProps<Theme>
}

export function PrivateNoteView({adapterNote,adapterPublic,adapterSubtype,dateConverter,noteArrayPrivateConverter,sx}:PrivateViewInterface) {
    const [notesDataSearch,setNotesDataSearch] = useState<NotePrivate[]>([])
    const [notePrivatesObj,setNotePrivatesObj] = useState<NotePrivate[]>([])
    const [loading,setLoading] = useState(false)
    const [disable,setDisable] = useState(false)
    const [isSearch,setIsSearch] = useState(false)
    const [open,setOpen] = useState(false)
    const filterNote = useAppSelector(state => state.searchAndFilterReducer.notePrivateFilter)
    const searchNote = useAppSelector(state => state.searchAndFilterReducer.notePrivateSearch)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (notesDataSearch.length > 0 || !profile || (profile && !profile.id)) return;
        of({}).pipe(
            exhaustMap(async() => {
                await adapterNote.getSearch({name:"",page:0,size:300},
                    (notesObj) => {
                        if (notesObj.length > 0) {
                            if (notesObj.length > 1) {
                                let data = ValidateAndSortArrayModel.validateArrayNotePrivate(notePrivatesObj,notesObj,true)
                                if (!data.first) {
                                    setNotePrivatesObj(data.second)
                                    dispatch(setNotePrivates(noteArrayPrivateConverter.to(data.second)))
                                }
                            } else if(notesObj.length > 0) {
                                let data = ValidateLastModels.validateNotePrivate(notePrivatesObj,notesObj[0])
                                if (!data) {
                                    setNotePrivatesObj(notesObj)
                                    dispatch(setNotePrivates(noteArrayPrivateConverter.to(notesObj)))
                                }
                            }
                        } else {
                            dispatch(setNotePrivates([]))
                        }
                    },
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    },[profile,notesDataSearch])
    
    const onSearch = (text?:string) => {
        of(text).pipe(
            tap(() => {setLoading(true)}),
            mergeMap((name) => iif(() => name !== undefined,of(name),of(searchNote.name))),
            tap((name) => {dispatch(setNotePrivateSearch({...searchNote,name:name!,page:0,endPage:false}))}),
            switchMap(async(name) => {
                await adapterNote.getSearch({name:name!,page:0,size:searchNote.size},
                    (notesObj) => {
                        if (notesObj.length < searchNote.size)
                            dispatch(setNotePrivateSearch({...searchNote,name:name!,endPage:true}))
                        setNotesDataSearch((notesObj.length > 0)?notesObj:[{id:emptyNotesId,title:"",severity:{first:"",second:""},description:""}])
                    },
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setLoading(false)})
        ).subscribe()
    }
    const onFilter = useCallback(() => {
        of({}).pipe(
            tap(() => {setDisable(true);setLoading(true)}),
            exhaustMap(async() => {
                await adapterNote.getFilter({severities:filterNote.severities,categories:filterNote.categories,page:0,size:searchNote.size},
                    (notesObj) => {
                        if (notesObj.length > 0) {
                            if (notesObj.length < searchNote.size)
                                dispatch(setNotePrivateSearch({...searchNote,endPage:true}))
                        } else dispatch(setNotePrivateSearch({...searchNote,endPage:true}))
                        setNotesDataSearch((notesObj.length > 0)?notesObj:[{id:emptyNotesId,title:"",severity:{first:"",second:""},description:""}])
                        dispatch(setNotePrivateFilter({...filterNote,severities:[],categories:[]}))
                        setOpen(!open)
                    },
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false);setLoading(false)})
        ).subscribe()
    },[filterNote])
    const onScroll = (event: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
        if (!loading && event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight) {
            iif(() => !searchNote.endPage,of({}).pipe(
                tap(() => {dispatch(setNotePrivateSearch({...searchNote,page:searchNote.page+1}));setLoading(true)}),
                mergeMap(() => 
                    iif(() => isSearch,of({}).pipe(
                        exhaustMap(async() => {
                            await adapterNote.getSearch({name:searchNote.name,page:searchNote.page,size:searchNote.size},
                                (notesObj) => {
                                    if (notesObj.length > 0) {
                                        if (notesObj.length < searchNote.size)
                                            dispatch(setNotePrivateSearch({...searchNote,endPage:true}))
                                    } else dispatch(setNotePrivateSearch({...searchNote,page:searchNote.page-1,endPage:true}))
                                    setNotesDataSearch([...notesDataSearch,...notesObj])
                                },
                                (error) => {dispatch(setMessage({message:error,error:true}))},
                                (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                        })
                    ),of({}).pipe(
                        exhaustMap(async() => {
                            await adapterNote.getFilter({...filterNote,page:searchNote.page,size:searchNote.size},
                                (notesObj) => {
                                    if (notesObj.length > 0) {
                                        if (notesObj.length < searchNote.size)
                                            dispatch(setNotePrivateSearch({...searchNote,endPage:true}))
                                    } else dispatch(setNotePrivateSearch({...searchNote,page:searchNote.page-1,endPage:true}))
                                    setNotesDataSearch([...notesDataSearch,...notesObj])
                                },
                                (error) => {dispatch(setMessage({message:error,error:true}))},
                                (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                        })
                    ))
                ),
                tap(() => {setLoading(false)})
            ),EMPTY).subscribe()
        }
    }
    const handleClose = () => {
        setOpen(!open)
    }
    return(
        <Stack id="private-note-container" sx={{width:"100%",...sx}}>
            <HeaderContainerNote
                ids="search-field-note-private"
                key="search-field-note-private"
                search={searchNote.name}
                onSearch={() => {setIsSearch(true);onSearch()}}
                onChange={(text) => {setIsSearch(true);onSearch(text.currentTarget.value)}}
                onClear={() => {dispatch(setNotePrivateSearch({...searchNote,name:""}));setNotesDataSearch([])}}
                onClickFilter={() => {setIsSearch(false);setOpen(!open)}}
            />
            <BodyContainer
                adapterNote={adapterNote}
                adapterPublic={adapterPublic}
                adapterSubtype={adapterSubtype}
                dateConverter={dateConverter}
                noteArrayPrivateConverter={noteArrayPrivateConverter}
                theme={themeProfile}
                triggerOpenSearch={notesDataSearch.length > 0}
                onScrollSearchAndFilter={onScroll}
                onCloseSearchAndFilter={() => {dispatch(setNotePrivateSearch({...searchNote,name:""}));setNotesDataSearch([])}}
                dataSearchAndFilter={notesDataSearch}
                loadingSearchAndFilter={loading}
            />
            <ContainerFilterNotePrivate
                adapterNote={adapterNote}
                disable={disable}
                onClose={handleClose}
                onFilter={() => {dispatch(setNotePrivateSearch({...searchNote,page:0,endPage:false}));onFilter()}}
                open={open}
                theme={themeProfile}
            />
        </Stack>
    )
}

interface HeaderContainerNoteInterface {
    ids?: string
    search: string
    onSearch: () => void
    onChange: (text: React.ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
    onClickFilter: () => void
    onClickInfo?:() => void 
    onClickMembers?: () => void
    onClickAddSubtype?: () => void
}
function HeaderContainerNote({ids,search,onSearch,onChange,onClickInfo,onClickFilter,onClickMembers,onClickAddSubtype,onClear}:HeaderContainerNoteInterface) {
    const themeProfile = useAppSelector(state => state.profileReducer.theme)
    const notifCount1 = useAppSelector(state => state.notificationReducer.requestListMember)
    const notifCount2 = useAppSelector(state => state.notificationReducer.requestRejectedMember)
    const group = useAppSelector(state => state.profileReducer.group)
    const breakWidth = useMediaQuery("(min-width:900px)")
    const dispatch = useAppDispatch()
    return(
        <Stack>
            <Stack direction="row" sx={{alignItems:"center"}}>
                {(onClickAddSubtype && onClickMembers)?
                    <Tooltip title="to private note">
                        <IconButton color="inherit" sx={{color:themeProfile.default_background}} onClick={() => {dispatch(setGroupProfile(undefined))}}>
                            <ArrowBackRounded color="inherit" sx={{fontSize:"1.5rem"}}/>
                        </IconButton>
                    </Tooltip>:null
                }
                <Stack direction="row" spacing={2} sx={{margin: "5px 10px 5px auto",alignItems:"center"}}>
                    <Divider orientation="vertical" flexItem/>
                    {(onClickAddSubtype && onClickMembers)?
                        <>
                            {
                                (group && (group.roleMember === "MANAGER" || group.roleMember === "ADMIN"))?
                                <Tooltip title="add subtype">
                                    {(breakWidth)?
                                        <ThemeButton
                                            variant="outlined"
                                            themeObj={themeProfile}
                                            state={StateThemeUtils.DEFAULT}
                                            onClick={onClickAddSubtype}
                                            sx={{textTransform:"none"}}
                                            startIcon={<Add color="inherit"/>}
                                        >Add Subtype</ThemeButton>:<Zoom in={group && (group.roleMember === "MANAGER" || group.roleMember === "ADMIN")}>
                                            <ThemeFab
                                                themeObj={themeProfile}
                                                state={StateThemeUtils.DEFAULT}
                                                onClick={onClickAddSubtype}
                                                sx={{position:"absolute",bottom:"2rem",right:"30px"}}
                                            >
                                                <Add color="inherit"/>
                                            </ThemeFab>
                                        </Zoom>
                                    }
                                </Tooltip>:null
                            }
                            <Tooltip title="member list">
                                {(breakWidth)?
                                    <ThemeButton
                                        variant="outlined"
                                        themeObj={themeProfile}
                                        state={StateThemeUtils.INFO}
                                        onClick={onClickMembers}
                                        sx={{textTransform:"none"}}
                                        startIcon={<People color="inherit"/>}
                                    >Members</ThemeButton>:<IconButton sx={{color:themeProfile.info_background}} onClick={onClickMembers}>
                                        <People color="inherit"/>
                                    </IconButton>
                                }
                            </Tooltip>
                            {
                                (group && (group.roleMember === "MANAGER" || group.roleMember === "ADMIN"))?
                                <Tooltip title="group notification">
                                    <IconButton
                                        onClick={() => {dispatch(setOpenNotificationGroup(true))}}
                                        sx={{color:themeProfile.default_background}}
                                    >
                                        <Badge badgeContent={notifCount1.length+notifCount2.length}>
                                            <Notifications/>
                                        </Badge>
                                    </IconButton>
                                </Tooltip>:null
                            }
                            <Tooltip title="group info">
                                <IconButton sx={{color:themeProfile.info_background}} onClick={onClickInfo}>
                                    <InfoRounded color="inherit"/>
                                </IconButton>
                            </Tooltip>
                        </>:null}
                </Stack>
            </Stack>
            <Stack direction={"row"}>
                <SearchField
                    ids={ids}
                    value={search}
                    theme={themeProfile}
                    onSearch={onSearch}
                    onChange={onChange}
                    placeholder={"Search note name"}
                    isDropDownButton={false}
                    onClear={onClear}
                    sx={{flexGrow:1,marginLeft:"10px"}}
                />
                <Tooltip title="filter" sx={{marginRight:"10px"}}>
                    <IconButton color="inherit" sx={{color:themeProfile.default_background}} onClick={onClickFilter}>
                        <FilterAlt color="inherit"/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Stack>
    )
}

interface BodyContainerInterface {
    adapterNote: NoteAdapter
    adapterPublic: PublicAdapter
    adapterSubtype: SubtypeAdapter
    dateConverter: DateConverter
    noteArrayCollabConverter?: NoteCollabArrayConverter
    noteArrayPrivateConverter: NotePrivateArrayConverter
    members?: Member[]
    group?: Group
    theme: ThemeObj
    triggerOpenSearch:boolean
    openMember?: boolean
    onOpenMember?: (data:boolean) => void
    onScrollSearchAndFilter: (event: UIEvent<HTMLDivElement, globalThis.UIEvent>) => void
    onCloseSearchAndFilter: () => void
    dataSearchAndFilter: NotePrivate[] | NoteCollab[]
    loadingSearchAndFilter: boolean
}
interface BodyNoteCollabContainerSubtypeInterface {
    subtypes:Subtype[]
    load:number
    adapterNote: NoteAdapter
    adapterSubtype: SubtypeAdapter
    adapterPublic: PublicAdapter
    group: Group
    theme: ThemeObj
    dateConverter: DateConverter
    noteAddCollabTrigger?: {data:NoteCollab|undefined,index:number,isSave:boolean}
    disable: boolean
    changeDirection: "landscape" | "potrait"
    onNoteAddCollabTrigger: (data:{data:NoteCollab|undefined,index:number}|undefined) => void
    onAddNote: (data:{data:NoteCollab | NotePrivate,index?:number}) => void
    onDeleteSubtype: (data:string) => void
}

const BodyNoteCollabContainerSubtype = React.memo<BodyNoteCollabContainerSubtypeInterface>(({adapterNote,adapterPublic,adapterSubtype,dateConverter,group,theme,noteAddCollabTrigger,disable,onNoteAddCollabTrigger,
    onAddNote,onDeleteSubtype,changeDirection,subtypes,load}) => {
        const breakPointsLarge = useMediaQuery('(min-width:1000px)')
        const [mousePosition,setMousePosition] = useState<{x:number,y:number}>()
        const [subtype,setSubtype] = useState<Subtype>()
        const [index,setIndex] = useState<number>()
        const [noteTransfer,setNoteTransfer] = useState<{data:NoteCollab,from:number,to:number}>()
        const [openNoteTransfer,setOpenNoteTransfer] = useState<{element:HTMLButtonElement|null,data:NoteCollab,from:number}>()
        const [openSubtypeTransfer,setOpenSubtypeTransfer] = useState<{element:HTMLButtonElement|null,data:Subtype,from:number}>()
        const error = useAppSelector(state => state.messageRespon.message.error)
        const dispatch = useAppDispatch()
        const swapSubtype = (subtypes: Subtype[], from:number, to:number) => {
            var arr1 = subtypes[to]
            subtypes[to] = subtypes[from]
            subtypes[from] = arr1
            return subtypes
        }
        type TransferObj = {
            data: NoteCollab
            subtype: Subtype
            index:number
        }
    
        const onTransferNoteObj = useCallback((data: TransferObj,subtype: Subtype,index:number) => {
            if (index !== data.index) {
                of({}).pipe(
                    map(() => {return {...data.data,subtype: subtype} as NoteCollab}),
                    exhaustMap(async(note) => {
                        await adapterNote.modifyNoteGroup({group: group.id!},note,
                            (notesObj) => {if (notesObj) setNoteTransfer({data:notesObj,from:data.index,to:index})},
                            (error) => {dispatch(setMessage({message:error,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                        return note
                    })
                ).subscribe()
            }
        },[])
    
        const onTransferSubtypeObj = useCallback((data:{subtype:Subtype,index:number},subtype: Subtype, index: number) => {
            if (index !== data.index) {
                of({}).pipe(
                    exhaustMap(async() => {
                        await adapterSubtype.updateIndex({indexFrom:data.index,indexTo:index,subtypeFrom:data.subtype.id!,subtypeTo:subtype.id!,group: group.id!},
                            (res) => {if(res) {if (!res.data) dispatch(setMessage({message:"Cannot Move Subtype",error:true}))}},
                            (error) => {dispatch(setMessage({message:error,error:true}))},
                            (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                    }),
                    tap(() => {if (!error) dispatch(setSubtypes(swapSubtype([...subtypes],data.index,index)))})
                ).subscribe()
            }
        },[subtypes])

        const handleOnClickTrigger = useCallback((subtype:Subtype,index:number,pointer?:{x:number,y:number}) => {
            if (pointer)
                setMousePosition(pointer)
            setSubtype(subtype)
            setIndex(index)
        },[])
        return(
            <>
                {subtypes.slice(0,5*load).map((subtype,i) => (
                    <Box key={"subtype-"+i} sx={{padding:"10px",maxWidth:"100vw",minWidth:(breakPointsLarge)?"50vw":"97vw"}}>
                        <BodyNoteCollabContainer
                            cardSx={{width:"100%"}}
                            adapterNote={adapterNote}
                            adapterSubtype={adapterSubtype}
                            adapterPublic={adapterPublic}
                            dateConverter={dateConverter}
                            subtype={subtype}
                            index={i}
                            group={group}
                            theme={theme}
                            changeDirection={changeDirection}
                            noteRemove={(noteAddCollabTrigger && noteAddCollabTrigger.index === i && !noteAddCollabTrigger.isSave)?noteAddCollabTrigger.data:undefined}
                            noteAdd={(noteAddCollabTrigger && noteAddCollabTrigger.index === i && noteAddCollabTrigger.isSave)?noteAddCollabTrigger.data:undefined}
                            noteTransfer={noteTransfer}
                            onDeleteSubtype={onDeleteSubtype}
                            onRemoveNoteTrigger={() => {onNoteAddCollabTrigger(undefined)}}
                            onClickTrigger={(item,pointer) => handleOnClickTrigger(item,i,pointer)}
                            onAddNote={(subtypeObj) => {onAddNote({data:{description:"",title:"",subtype:subtypeObj,severity:{first:"default",second:theme.foreground}},index:i})}}
                            onTransferNote={(e,data,from) => {setOpenNoteTransfer({element:e.currentTarget,data:data,from:from})}}
                            onTransferSubtype={(e,data,from) => {setOpenSubtypeTransfer({element:e.currentTarget,data:data,from:from})}}
                            onUpdateSubtypeCallback={(subtypeDt) => {
                                let subData = [...subtypes]
                                let subIndex = subtypes.findIndex(item => item.id! === subtypeDt.id!)
                                subData[subIndex] = subtypeDt
                                dispatch(setSubtypes(subData))
                            }}
                        />
                    </Box>
                ))}
                {(subtype)?
                    <Menu
                        open={mousePosition !== undefined}
                        anchorReference="anchorPosition"
                        anchorPosition={(mousePosition)?{top:mousePosition.y,left:mousePosition.x}:undefined}
                        onClose={() => {setMousePosition(undefined)}}
                        onClick={(event) => {event.stopPropagation()}}
                        sx={{zIndex: (theme) => theme.zIndex.drawer + 2,position:"absolute"}}
                        MenuListProps={{sx:{padding:0}}}
                    >
                        {(group.roleMember === "ADMIN" || group.roleMember === "MANAGER")?
                            <MenuItem onClick={() => {setMousePosition(undefined);dispatch(setMessage({message:"Are you sure to delete it ?",error:false,
                                        isOptional:{isDisable:disable,onClickOk: () => {onDeleteSubtype(subtype.id!)}}}))}}>Delete Subtype</MenuItem>:null
                        }
                        <MenuItem onClick={() => {setMousePosition(undefined);onAddNote({data:{description:"",title:"",subtype:subtype,severity:{first:"default",second:theme.foreground}},index:index})}}>Add Note</MenuItem>
                    </Menu>:null
                }
                <Menu
                    open={openNoteTransfer !== undefined}
                    anchorEl={openNoteTransfer?.element}
                    onClose={() => {setOpenNoteTransfer(undefined)}}
                    onClick={(event) => {event.stopPropagation()}}
                    sx={{zIndex: (theme) => theme.zIndex.drawer + 2,position:"absolute"}}
                    MenuListProps={{sx:{padding:0}}}
                >
                    {
                        subtypes.map((item,i) => (
                            <div key={"subtype-option"+i}>
                                {(openNoteTransfer?.from !== i)?
                                    <MenuItem onClick={() => {
                                        onTransferNoteObj({data:openNoteTransfer!.data,subtype:subtypes[openNoteTransfer!.from],index:openNoteTransfer!.from},item,i)
                                        setOpenNoteTransfer(undefined);
                                    }}>{`to ${item.name}`}</MenuItem>:null
                                }
                            </div>
                        ))   
                    }
                </Menu>
                <Menu
                    open={openSubtypeTransfer !== undefined}
                    anchorEl={openSubtypeTransfer?.element}
                    onClose={() => {setOpenSubtypeTransfer(undefined)}}
                    onClick={(event) => {event.stopPropagation()}}
                    sx={{zIndex: (theme) => theme.zIndex.drawer + 2,position:"absolute"}}
                    MenuListProps={{sx:{padding:0}}}
                >
                    {
                        subtypes.map((item,i) => (
                            <div key={"subtype-option"+i}>
                                {(openSubtypeTransfer?.from !== i)?
                                    <MenuItem onClick={() => {
                                        onTransferSubtypeObj({subtype:openSubtypeTransfer!.data,index:openSubtypeTransfer!.from},item,i)
                                        setOpenSubtypeTransfer(undefined);
                                    }}>{`switch to ${item.name}`}</MenuItem>:null
                                }
                            </div>
                        ))   
                    }
                </Menu>
            </>
        )
})

function BodyContainer({adapterNote,adapterSubtype,adapterPublic,dateConverter,noteArrayCollabConverter,noteArrayPrivateConverter,triggerOpenSearch,members,group,theme,openMember,dataSearchAndFilter,loadingSearchAndFilter,onOpenMember,onScrollSearchAndFilter,onCloseSearchAndFilter}:BodyContainerInterface) {
    const breakpoint = useMediaQuery('min-width:1000px')
    const [loading,setLoading] = useState(false)
    const [load, setLoad] = useState(1)
    const [disable,setDisable] = useState(false)
    const [refreshPrivateNote,setRefreshPrivateNote] = useState(false)
    const [isPrivate,setIsPrivate] = useState(false)
    const [noteAdd,setNoteAdd] = useState<{data:NoteCollab | NotePrivate,index?:number}>()
    const [noteAddCollabTrigger,setNoteAddCollabTrigger] = useState<{data:NoteCollab|undefined,index:number,isSave:boolean}>()
    // const [isScrollLeft,setIsScrollLeft] = useState(false)
    // const [isScrollRight,setIsScrollRight] = useState(false)
    // const [isScrollTop,setIsScrollTop] = useState(false)
    // const [isScrollBottom,setIsScrollBottom] = useState(false)
    const [appearance,setAppearance] = useState<"landscape" | "potrait">("potrait")
    const refScrollPos = useRef<Array<HTMLDivElement|null>>([])
    const notes = useAppSelector(state => state.noteReducer.notePrivates)
    const subtypes = useAppSelector(state => state.noteReducer.subtypes)
    const dispatch = useAppDispatch()

    // useEffect(() => {
    //     setLoad(1)
    // },[subtypes,notes])

    // useEffect(() => {
    //     let data = iif(() => isScrollRight,
    //         interval(50).pipe(
    //             every(() => refScrollPos.current[0] !== null && (refScrollPos.current[0].clientWidth + refScrollPos.current[0].scrollLeft < refScrollPos.current[0].scrollWidth)),
    //             tap(() => {if (refScrollPos.current[0] !== null) refScrollPos.current[0].scrollLeft += 1})                 
    //         ),of({})).subscribe()
    //     return () => data.unsubscribe()
    // },[isScrollRight])

    // useEffect(() => {
    //     let data = iif(() => isScrollLeft,
    //         interval(50).pipe(
    //             every(() => refScrollPos.current[0] !== null && refScrollPos.current[0].scrollLeft > 0),
    //             tap(() => {if (refScrollPos.current[0] !== null) refScrollPos.current[0].scrollLeft -= 1})                 
    //         ),of({})).subscribe()
    //     return () => data.unsubscribe()
    // },[isScrollLeft])

    // useEffect(() => {
    //     let data = iif(() => isScrollBottom,
    //         interval(50).pipe(
    //             every(() => refScrollPos.current[1] !== null && (refScrollPos.current[1].clientHeight + refScrollPos.current[1].scrollTop < refScrollPos.current[1].scrollHeight)),
    //             tap(() => {if (refScrollPos.current[1] !== null) refScrollPos.current[1].scrollTop += 1})                 
    //         ),of({})).subscribe()
    //     return () => data.unsubscribe()
    // },[isScrollBottom])

    // useEffect(() => {
    //     let data = iif(() => isScrollTop,
    //         interval(30).pipe(
    //             every(() => refScrollPos.current[1] !== null && refScrollPos.current[1].scrollTop > 0),
    //             tap(() => {if (refScrollPos.current[1] !== null) refScrollPos.current[1].scrollTop -= 1})                 
    //         ),of({})).subscribe()
    //     return () => data.unsubscribe()
    // },[isScrollTop])

    const onScrollPrivate = useCallback((event: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
        if (!loading && event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight) {
            if (notes.length > 0)
                if (load < 500)
                    setLoad(load+1)
        }
    },[])

    const onScrollCollab = useCallback((event: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
        if (members && group) {
            if (appearance === "potrait" && !loading && event.currentTarget.clientWidth + event.currentTarget.scrollLeft >= event.currentTarget.scrollWidth) {
                if (subtypes.length > 0)
                    if (load < 500)
                        setLoad(load+1)
            }
            if (appearance === "landscape" && !loading && event.currentTarget.clientHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight) {
                if (notes.length > 0)
                    if (load < 500)
                        setLoad(load+1)
            }
        }
    },[])

    const onSaveNote = (index?:number,note?: NotePrivate | NoteCollab) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if (note) {
                    if (isPrivate && instanceofModel<NotePrivate>(note,"category"))
                        if (ValidateSaveVariable.validateNotePrivate(note)) {
                            await adapterNote.saveNotePrivate(note,
                                (notesObj) => {if (notesObj) {
                                    dispatch(setNotePrivates(noteArrayPrivateConverter.to([...noteArrayPrivateConverter.from(notes),notesObj])))
                                    setNoteAdd(undefined)
                                    dispatch(setMessage({message:"Save Note Success",error:false}))
                                }},
                                (error) => {dispatch(setMessage({message:error,error:true}))},
                                (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                        } else {
                            dispatch(setMessage({message:"all important field must be added",error:true}))
                        }
                    if (!isPrivate && instanceofModel<NoteCollab>(note,"subtype"))
                        if (ValidateSaveVariable.validateNoteCollab(note)) {
                            await adapterNote.saveNoteGroup({group:group!.id!},note,
                                (notesObj) => {if (notesObj) {
                                    setNoteAddCollabTrigger({data:notesObj,index:index!,isSave:true})
                                    setNoteAdd(undefined)
                                    dispatch(setMessage({message:"Save Note Success",error:false}))
                                }},
                                (error) => {dispatch(setMessage({message:error,error:true}))},
                                (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                        } else {
                            dispatch(setMessage({message:"all important field must be added",error:true}))
                        }
                }
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onDeleteSubtype = useCallback((subtype:string) => {
        of({}).pipe(
            exhaustMap(async() => {
                if (group) 
                    await adapterSubtype.removeGroup({subtype:subtype,group:group.id!},
                        (res) => {if (res) {if (res.data) {
                            dispatch(setMessage({message:"Delete Subtype Success",error:false}))
                            dispatch(setSubtypes(subtypes.filter(item => item.id! !== subtype)))
                        } else dispatch(setMessage({message:"Delete Subtype Failed",error:true}))}},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    },[])

    const onDeleteCategory = (category: string) => {
        of({}).pipe(
            exhaustMap(async() => {
                await adapterNote.deleteNotePrivateCategory({category:category},
                    (res) => {if (res) {if (res.data) {
                        dispatch(setMessage({message:"Delete Category Success",error:false}))
                        setRefreshPrivateNote(!refreshPrivateNote)
                    } else dispatch(setMessage({message:"Delete Category Failed",error:true}))}},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    }

    const handleNoteAddCollabTrigger = useCallback((data:{data: NoteCollab | undefined,index: number} | undefined) => {
        setNoteAddCollabTrigger((data)?{...data,isSave:false}:undefined)
    },[])

    const handleOnAddNote = useCallback((data:{data: NoteCollab | NotePrivate,index?: number | undefined}) => {
        setIsPrivate(false)
        setNoteAdd(data)
    },[])

    return(
        <>
            <div style={{display:(!triggerOpenSearch)?"block":"none",height:(breakpoint)?"100%":"100vh",overflow:"unset",maxWidth:"100%",width:"100%"}}>
                {(members && group)?
                    <>
                        <Stack direction={"row"} sx={{color:theme.foreground_color,backgroundColor:theme.foreground_color.substring(0,7)+"07",padding:"10px 10px 5px 10px",
                                borderBottom:"3px solid "+theme.border_color}}>
                            <FormControlLabel control={<ThemeSwitch themeObj={theme} checked={appearance === "landscape"} onChange={(event) => {setAppearance((event.currentTarget.checked)?"landscape":"potrait")}}/>} label="landscape"/>
                            <Typography variant="h5" sx={{color:"inherit",flexGrow:1}} textAlign={"right"}>{(group)? group.username:""}</Typography>
                        </Stack>
                        <Box sx={{width:"100%",height:"100%",overflow:"unset",position:"relative"}}>
                            {/* {(appearance === "landscape")?
                                <Box onMouseEnter={() => {
                                    if (refScrollPos.current[1]?.clientHeight !== refScrollPos.current[1]?.scrollHeight)
                                        setIsScrollTop(true)
                                }} onMouseLeave={() => {
                                    if (refScrollPos.current[1]?.clientHeight !== refScrollPos.current[1]?.scrollHeight)
                                        setIsScrollTop(false)
                                }}
                                sx={{position:"absolute",top:0,height:"100px",width:"100%"}}/>:
                                <Box onMouseEnter={() => {
                                    if (refScrollPos.current[0]?.clientWidth !== refScrollPos.current[0]?.scrollWidth)
                                        setIsScrollLeft(true)
                                }} onMouseLeave={() => {
                                    if (refScrollPos.current[0]?.clientWidth !== refScrollPos.current[0]?.scrollWidth)
                                        setIsScrollLeft(false)
                                }}
                                sx={{position:"absolute",left:0,width:"100px",height:"100%"}}/>
                            }     */}
                            {(subtypes.length > 0)?
                                <Stack ref={(ref) => {refScrollPos.current[0] = ref}} sx={{maxWidth:"100%",height:"100%",width:"100%",
                                    overflowY:(appearance === "landscape")?"auto":"unset",overflowX:(appearance === "landscape")?"unset":"auto",position:"absolute",left:0,top:0}} onScroll={onScrollCollab}>
                                        <Stack direction={(appearance === "landscape")?"column":"row"} spacing={1}>
                                            <BodyNoteCollabContainerSubtype
                                                adapterNote={adapterNote}
                                                adapterSubtype={adapterSubtype}
                                                adapterPublic={adapterPublic}
                                                group={group}
                                                theme={theme}
                                                changeDirection={appearance}
                                                dateConverter={dateConverter}
                                                disable={disable}
                                                subtypes={subtypes}
                                                load={load}
                                                noteAddCollabTrigger={noteAddCollabTrigger}
                                                onNoteAddCollabTrigger={handleNoteAddCollabTrigger}
                                                onAddNote={handleOnAddNote}
                                                onDeleteSubtype={(data) => {dispatch(setMessage({message:"Are you sure to delete it ?",error:false,
                                                    isOptional:{isDisable:disable,onClickOk: () => {onDeleteSubtype(data)}}}))}}
                                            />
                                        </Stack>
                                </Stack>:<Stack sx={{width:"100%",height:"100%",color:theme.foreground_color,alignItems:"center",justifyContent:"center"}} spacing={1}>
                                    <Typography variant="h5">
                                        Note is Empty
                                    </Typography>
                                    <Typography variant="body2">
                                        {`add new subtype ('+') then add new note to this group`}
                                    </Typography>
                                </Stack>
                            }
                            {/* {(appearance === "landscape")?
                                <Box onMouseEnter={() => {
                                    if (refScrollPos.current[1]?.clientHeight !== refScrollPos.current[1]?.scrollHeight)
                                        setIsScrollBottom(true)
                                }} onMouseLeave={() => {
                                    if (refScrollPos.current[1]?.clientHeight !== refScrollPos.current[1]?.scrollHeight)
                                        setIsScrollBottom(false)
                                }}
                                sx={{position:"absolute",bottom:0,height:"100px",width:"100%"}}/>:
                                <Box onMouseEnter={() => {
                                    if (refScrollPos.current[0]?.clientWidth !== refScrollPos.current[0]?.scrollWidth)
                                        setIsScrollRight(true)
                                }} onMouseLeave={() => {
                                    if (refScrollPos.current[0]?.clientWidth !== refScrollPos.current[0]?.scrollWidth)
                                        setIsScrollRight(false)
                                }}
                                sx={{position:"absolute",right:0,width:"100px",height:"100%"}}/>
                            } */}
                        </Box>
                    </>:
                    <Stack ref={(ref) => {refScrollPos.current[1] = ref}} spacing={2} sx={{width:"100%",maxHeight:"100%",overflow:"unset",height:"80vh",position:"relative"}}>
                        {/* <Box onMouseEnter={() => {
                                if (refScrollPos.current[1]?.clientHeight !== refScrollPos.current[1]?.scrollHeight)
                                    setIsScrollTop(true)
                            }} onMouseLeave={() => {
                                if (refScrollPos.current[1]?.clientHeight !== refScrollPos.current[1]?.scrollHeight)
                                    setIsScrollTop(false)
                            }}
                            sx={{position:"absolute",top:0,height:"100px",width:"100%"}}/> */}
                        <Stack sx={{width:"100%",maxHeight:"100%",overflowY:"auto",height:"100vh",position:"absolute",top:0}}  onScroll={onScrollPrivate}>
                            <BodyNotePrivateContainer
                                adapterNote={adapterNote}
                                dateConverter={dateConverter}
                                noteArrayPrivateConverter={noteArrayPrivateConverter}
                                theme={theme}
                                open={group === undefined}
                                loading={loading}
                                onAddNote={() => {setIsPrivate(true);setNoteAdd({data:{description:"",title:"",category:"",severity:{first:"default",second:theme.foreground}}})}}
                                onDeleteCategory={(categoryDt) => {dispatch(setMessage({message:"Are you sure to delete it ?",error:false,
                                    isOptional:{isDisable:disable,onClickOk: () => {onDeleteCategory(categoryDt)}}}))}}
                                onLoading={(loading) => {setLoading(loading)}}
                            />
                        </Stack>
                        {/* <Box onMouseEnter={() => {
                                if (refScrollPos.current[1]?.clientHeight !== refScrollPos.current[1]?.scrollHeight)
                                    setIsScrollBottom(true)
                            }} onMouseLeave={() => {
                                if (refScrollPos.current[1]?.clientHeight !== refScrollPos.current[1]?.scrollHeight)
                                    setIsScrollBottom(false)
                            }}
                            sx={{position:"absolute",bottom:0,height:"100px",width:"100%"}}/> */}
                    </Stack>
                }
                <Tooltip title="Add New Note" sx={{position:"absolute",bottom:"2rem",right:"30px"}}>
                    <Zoom in={group === undefined}>
                        <ThemeFab
                            themeObj={theme}
                            state={StateThemeUtils.DEFAULT}
                            onClick={() => {setIsPrivate(true);setNoteAdd({data:{description:"",title:"",category:"",severity:{first:"default",second:theme.foreground}}})}}
                        >
                            <Add color="inherit"/>
                        </ThemeFab>
                    </Zoom>
                </Tooltip>
                {(members && openMember && onOpenMember)?
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, maxHeight:"100vh", overflowY:"auto"}}
                        open={openMember}
                        onClick={() => {onOpenMember(false)}}>
                            <ProfileGroupMemberView
                                members={members}
                                boxProps={{onClick:(event) => {event.stopPropagation()}}}
                                sx={{backgroundColor:theme.background_color.substring(0,7)+"BC",color:theme.foreground_color}}
                            />
                    </Backdrop>:null
                }
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, maxHeight:"100vh", overflowY:"auto"}}
                    open={noteAdd !== undefined}
                    onClick={() => {setNoteAdd(undefined)}}
                >
                    {(noteAdd)?
                        <NoteList
                            theme={theme}
                            isContainer={true}
                            noteInit={noteAdd.data}
                            dateConverter={dateConverter}
                            role={""}
                            onClickSave={(note) => {setNoteAdd({...noteAdd,data:note});dispatch(setMessage({message:"Are you sure to save it ?",error:false,
                                isOptional:{isDisable:disable,onClickOk: () => {onSaveNote(noteAdd.index,note)}}}))}}
                            cardProps={{sx:{maxWidth:"500px",width:"95vw"}}}
                        />:null
                    }
                </Backdrop>
            </div>
            <div style={{display:(!triggerOpenSearch)?"none":"block",width:"100%",height:"100%",maxHeight:"100%",overflowY:"auto"}} onScroll={onScrollSearchAndFilter}>
                {(dataSearchAndFilter.length > 0)?
                    <>
                        <BodySearchAndFilterNote
                            adapterNote={adapterNote}
                            dateConverter={dateConverter}
                            noteArrayCollabConverter={noteArrayCollabConverter}
                            noteArrayPrivateConverter={noteArrayPrivateConverter}
                            onClose={onCloseSearchAndFilter}
                            dataCollab={(instanceofModel<NoteCollab>(dataSearchAndFilter[0],"subtype"))?dataSearchAndFilter as NoteCollab[]:undefined}
                            dataPrivate={(instanceofModel<NotePrivate>(dataSearchAndFilter[0],"category"))?dataSearchAndFilter as NotePrivate[]:undefined}
                            group={group}
                            theme={theme}
                        />
                        {(loadingSearchAndFilter)?
                            <Box sx={{width:"100%",color:theme.default_background}}><CircularProgress color="inherit" sx={{margin:"auto"}}/></Box>:null
                        }
                    </>:null
                }
            </div>
        </>
    )
}

interface BodySearchAndFilterNoteInterface {
    adapterNote:NoteAdapter
    dateConverter: DateConverter
    noteArrayPrivateConverter: NotePrivateArrayConverter
    noteArrayCollabConverter?: NoteCollabArrayConverter
    dataPrivate?: NotePrivate[]
    dataCollab?: NoteCollab[]
    onClose: () => void
    group?:Group
    theme:ThemeObj
}
const BodySearchAndFilterNote = React.memo(({adapterNote,dateConverter,noteArrayCollabConverter,noteArrayPrivateConverter,dataPrivate,dataCollab,onClose,group,theme}:BodySearchAndFilterNoteInterface) => {
    const [dataNotePrivate,setDataNotePrivate] = useState<Array<{category: string,data: NotePrivate[]}>>([])
    const [dataNoteCollab,setDataNoteCollab] = useState<Array<{subtype: Subtype,data: NoteCollab[]}>>([])
    const [disable,setDisable] = useState(false)
    const noteUpdateCollab = useAppSelector(state => state.noteReducer.noteCollab)
    const noteUpdatePrivate = useAppSelector(state => state.noteReducer.notePrivate)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (dataPrivate && dataPrivate.length > 0) {
            setDataNotePrivate(noteArrayPrivateConverter.to(dataPrivate))
        }
        if (dataCollab && dataCollab.length > 0 && noteArrayCollabConverter) {
            setDataNoteCollab(noteArrayCollabConverter.to(dataCollab))
        }
    },[dataPrivate,dataCollab])
    const onUpdateNote = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(noteUpdatePrivate && noteUpdatePrivate.id)
                    await adapterNote.modifyNotePrivate(noteUpdatePrivate,
                        (notesObj) => {if (notesObj) {
                            setDataNotePrivate(noteArrayPrivateConverter.to([...noteArrayPrivateConverter.from(dataNotePrivate).filter(item => item.id !== notesObj.id),notesObj]))
                            dispatch(setMessage({message:"Update Note Success",error:false}))
                        }},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                if(noteUpdateCollab && noteUpdateCollab.id && group)
                    await adapterNote.modifyNoteGroup({group: group.id!},noteUpdateCollab,
                        (notesObj) => {if (notesObj && noteArrayCollabConverter) {
                            setDataNoteCollab(noteArrayCollabConverter.to([...noteArrayCollabConverter.from(dataNoteCollab).filter(item => item.id !== notesObj.id),notesObj]))
                            dispatch(setMessage({message:"Update Note Success",error:false}))
                        }},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }
    const onDeleteNote = (note: NoteCollab|NotePrivate) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(noteUpdatePrivate && noteUpdatePrivate.id)
                    await adapterNote.deleteNotePrivate({note:note.id!},
                        (res) => {
                            if (res)
                                if(res.data) {
                                    setDataNotePrivate(noteArrayPrivateConverter.to([...noteArrayPrivateConverter.from(dataNotePrivate).filter(item => item.id !== note.id)]))
                                    dispatch(setMessage({message:"Delete Note Success",error:false}))
                                } else dispatch(setMessage({message:"Delete Note Failed",error:true}))},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                if(noteUpdateCollab && noteUpdateCollab.id && group)
                    await adapterNote.deleteNoteGroup({group: group.id!,note:note.id!},
                        (res) => {
                            if (res) 
                                if(res.data && noteArrayCollabConverter) {
                                    setDataNoteCollab(noteArrayCollabConverter.to([...noteArrayCollabConverter.from(dataNoteCollab).filter(item => item.id !== note.id)]))
                                    dispatch(setMessage({message:"Delete Note Success",error:false}))
                                } else dispatch(setMessage({message:"Delete Note Failed",error:true}))},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }
    return(<Paper sx={{width:'100%',height:"100%",backgroundColor:theme.background_color!.substring(0,theme.background_color!.length-2)+'65'}}>
            <Stack sx={{padding:"15px",color:theme.foreground_color}}>
                <Stack direction={"row"} sx={{marginLeft:"10px",marginBottom:"10px"}}>
                    <Tooltip title="close search">
                        <IconButton sx={{color:theme.default_background}} onClick={onClose}>
                            <ArrowBackRounded sx={{fontSize:"2rem"}}/>
                        </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem sx={{backgroundColor:theme.default_background,width:"3px"}}/>
                </Stack>
                    {(group)?((dataNoteCollab.length > 0 && dataNoteCollab[0].data[0].id !== emptyNotesId)?
                        dataNoteCollab.map((collabNote,i) => (
                            <div key={"search-collab-"+i}>
                                <Typography variant="h5">{collabNote.subtype.name}</Typography>
                                <Divider sx={{backgroundColor:theme.foreground_color,marginBottom:"10px"}}/>
                                <Grid2 container spacing={2} sx={{padding:0}}>
                                    {
                                        collabNote.data.map((item,i) => (
                                            <Grid2 key={`note-list-`+item.title+i} xs={12} md={6} lg={4} xl={3}>
                                                <NoteList
                                                    id={`note-list-`+item.title+i}
                                                    theme={theme}
                                                    noteInit={item}
                                                    dateConverter={dateConverter}
                                                    role={group.roleMember!}
                                                    onClickSave={(note) => {dispatch(setNoteCollab(note as NoteCollab));dispatch(setMessage({message:"Are you sure to update it ?",error:false,
                                                        isOptional:{isDisable:disable,onClickOk: () => {onUpdateNote()}}}))}}
                                                    onDelete={() => {dispatch(setMessage({message:"Are you sure to delete it ?",error:false,
                                                        isOptional:{isDisable:disable,onClickOk: () => {onDeleteNote(item)}}}))}}
                                                />
                                            </Grid2>
                                        ))
                                    }
                                </Grid2>
                            </div>
                        )):<Typography variant="h5" textAlign={"center"}>Not Found</Typography>):(dataNotePrivate.length > 0 && dataNotePrivate[0].data[0].id !== emptyNotesId)?
                        dataNotePrivate.map((privateNote,i) => (
                            <div key={"search-private-"+i}>
                                <Typography variant="h5">{privateNote.category}</Typography>
                                <Divider sx={{backgroundColor:theme.foreground_color,marginBottom:"10px"}}/>
                                <Grid2 container spacing={2} sx={{padding:0}}>
                                    {
                                        privateNote.data.map((item,i) => (
                                            <Grid2 key={`note-list-`+item.title+i} xs={12} md={6} lg={4} xl={3}>
                                                <NoteList
                                                    id={`note-list-`+item.title+i}
                                                    theme={theme}
                                                    noteInit={item}
                                                    dateConverter={dateConverter}
                                                    role={"MANAGER"}
                                                    onClickSave={(note) => {dispatch(setNotePrivate(note));dispatch(setMessage({message:"Are you sure to update it ?",error:false,
                                                        isOptional:{isDisable:disable,onClickOk: () => {onUpdateNote()}}}))}}
                                                    onDelete={() => {dispatch(setMessage({message:"Are you sure to delete it ?",error:false,
                                                        isOptional:{isDisable:disable,onClickOk: () => {onDeleteNote(item)}}}))}}
                                                />
                                            </Grid2>
                                        ))
                                    }
                                </Grid2>
                            </div>
                        )):<Typography variant="h5" textAlign={"center"}>Not Found</Typography>
                    }
            </Stack>
    </Paper>)
})

interface ContainerFilterNotePrivateInterface {
    adapterNote: NoteAdapter
    open: boolean
    disable: boolean
    onClose: () => void
    onFilter: () => void
    theme: ThemeObj
}
const ContainerFilterNotePrivate = React.memo(({adapterNote,open,disable,onClose,onFilter,theme}:ContainerFilterNotePrivateInterface) => {
    const [categories,setCategories] = useState<Single<string>[]>([])
    const [severities,setSeverities] = useState<Single<string>[]>([])
    const [loading,setLoading] = useState(false)
    const notePrivateFilter = useAppSelector(state => state.searchAndFilterReducer.notePrivateFilter)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (open) {
            of({}).pipe(
                tap(() => {setLoading(true)}),
                exhaustMap(async() => {
                    await adapterNote.getCategoryMember(
                        (categoriesDt) => {
                            setCategories(categoriesDt)
                        },
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                exhaustMap(async() => {
                    await adapterNote.getSeveritiesMember(
                        (severitiesDt) => {
                            setSeverities(severitiesDt)
                        },
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                tap(() => {setLoading(false)})
            ).subscribe()
        }
    },[open])

    return(
        <Drawer
            anchor="right"
            open={open}
            onClick={onClose}
            PaperProps={{sx:{backgroundColor:theme.background_color,color:theme.foreground_color,maxWidth:"500px"},onClick:(event) => {event.stopPropagation()}}}
        >
            <Stack spacing={2} sx={{padding:"10px"}}>
                <Typography variant="h6">Filter By</Typography>
                <Stack direction={"row"} spacing={1} sx={{flexWrap:"wrap",justifyContent:"left",alignItems:"center"}}>
                    {notePrivateFilter.categories?.map((item,i) => (
                            <Chip
                                key={"category-check-"+i}
                                label={item}
                                sx={{backgroundColor:theme.default_background,color:theme.default_foreground,margin:"4px"}}
                                onClick={() => {
                                    if (notePrivateFilter.categories)
                                        dispatch(setNotePrivateFilter({...notePrivateFilter,categories:notePrivateFilter.categories.filter(dt => dt !== item)}))
                                }}
                            />
                        ))}
                    {notePrivateFilter.severities?.map((item,i) => (
                            <Chip
                                key={"severities-check-"+i}
                                label={item.split(delimiter)[0]}
                                icon={<Square sx={{color:`${item.split(delimiter)[1]}!important`}}/>}
                                sx={{backgroundColor:theme.default_background,color:theme.default_foreground,margin:"4px"}}
                                onClick={() => {
                                    if (notePrivateFilter.severities)
                                        dispatch(setNotePrivateFilter({...notePrivateFilter,severities:notePrivateFilter.severities.filter(dt => dt !== item)}))
                                }}
                            />
                        ))}
                </Stack>
                <Stack spacing={1} sx={{height:"100%",overflowY:"auto"}}>
                    <Typography variant="h6">Category</Typography>
                    <Stack direction="row" sx={{flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
                        {categories.map((item,i) => (
                            <Chip
                                key={"category-"+i}
                                label={item.data}
                                sx={{backgroundColor:theme.default_background,color:theme.default_foreground,margin:"4px"}}
                                onClick={() => {
                                    if (notePrivateFilter.categories) {
                                        if (!notePrivateFilter.categories.find((data) => data === item.data))
                                            dispatch(setNotePrivateFilter({...notePrivateFilter,categories:[...notePrivateFilter.categories,item.data]}))
                                    } else dispatch(setNotePrivateFilter({...notePrivateFilter,categories:[item.data]}))
                                }}
                            />
                        ))}
                        {(loading)?<CircularProgress color="inherit"/>:null}
                    </Stack>
                    <Typography variant="h6">Severities</Typography>
                    <Stack direction="row" sx={{flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
                        {severities.map((item,i) => (
                            <Chip
                                key={"severities-"+i}
                                label={item.data.split(delimiter)[0]}
                                icon={<Square sx={{color:`${item.data.split(delimiter)[1]}!important`}}/>}
                                sx={{backgroundColor:theme.default_background,color:theme.default_foreground,margin:"4px"}}
                                onClick={() => {
                                    if (notePrivateFilter.severities) {
                                        if (!notePrivateFilter.severities.find((data) => data === item.data))
                                            dispatch(setNotePrivateFilter({...notePrivateFilter,severities:[...notePrivateFilter.severities,item.data]}))
                                    } else dispatch(setNotePrivateFilter({...notePrivateFilter,severities:[item.data]}))
                                }}
                            />
                        ))}
                        {(loading)?<CircularProgress color="inherit"/>:null}
                    </Stack>
                    <Stack direction={"row"} sx={{justifyContent:"right"}}>
                        <ThemeButton
                            variant="outlined"
                            state={StateThemeUtils.DEFAULT}
                            themeObj={theme}
                            disabled={disable}
                            onClick={onFilter}
                        >Filter</ThemeButton>
                    </Stack>
                </Stack>
            </Stack>
        </Drawer>
    )
})

interface ContainerFilterNoteCollabInterface {
    adapterNote: NoteAdapter
    adapterPublic: PublicAdapter
    open: boolean
    disable: boolean
    loadingGuess: boolean
    memberName?: string
    dataMemberGuess: IdAndName<string>[]
    theme: ThemeObj
    group: Group
    onClose: () => void
    onFilter: () => void
    onMemberNameGuess: (data:string) => void
    onClearMemberGuess: () => void
}
const ContainerFilterNoteCollab = React.memo(({adapterNote,adapterPublic,open,disable,memberName,dataMemberGuess,loadingGuess,onMemberNameGuess,onClose,onFilter,onClearMemberGuess,theme,group}:ContainerFilterNoteCollabInterface) => {
    const [subtypes,setSubtypes] = useState<Subtype[]>([])
    const [severities,setSeverities] = useState<Single<string>[]>([])
    const [loading,setLoading] = useState(false)
    const refSearchField = useRef<HTMLDivElement | null>(null)
    const noteCollabFilter = useAppSelector(state => state.searchAndFilterReducer.noteCollabFilter)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (open) {
            of({}).pipe(
                tap(() => {setLoading(true)}),
                exhaustMap(async() => {
                    await adapterPublic.getSubtype({group:group.id!},
                        (subtypeDt) => {
                            setSubtypes(subtypeDt)
                        },
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                exhaustMap(async() => {
                    await adapterNote.getSeveritiesGroup({group:group.id!},
                        (severitiesDt) => {
                            setSeverities(severitiesDt)
                        },
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                tap(() => {setLoading(false)})
            ).subscribe()
        }
    },[open])

    return(
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{sx:{backgroundColor:theme.background_color,color:theme.foreground_color}}}
        >
            <Stack spacing={2} sx={{padding:"10px"}}>
                <Typography variant="h6">Filter By</Typography>
                <Stack direction={"row"} spacing={1} sx={{flexWrap:"wrap",justifyContent:"left",alignItems:"center"}}>
                    {noteCollabFilter.subtypes?.map((item,i) => (
                            <Chip
                                key={"subtypes-check-"+i}
                                label={item.name}
                                sx={{backgroundColor:theme.default_background,color:theme.default_foreground,margin:"4px"}}
                                onClick={() => {
                                    if (noteCollabFilter.subtypes)
                                        dispatch(setNoteCollabFilter({...noteCollabFilter,subtypes:noteCollabFilter.subtypes.filter(dt => dt !== item)}))
                                }}
                            />
                        ))}
                    {noteCollabFilter.severities?.map((item,i) => (
                            <Chip
                                key={"severities-check-"+i}
                                label={item.split(delimiter)[0]}
                                icon={<Square sx={{color:`${item.split(delimiter)[1]}!important`}}/>}
                                sx={{backgroundColor:theme.default_background,color:theme.default_foreground,margin:"4px"}}
                                onClick={() => {
                                    if (noteCollabFilter.severities)
                                        dispatch(setNotePrivateFilter({...noteCollabFilter,severities:noteCollabFilter.severities.filter(dt => dt !== item)}))
                                }}
                            />
                        ))}
                </Stack>
                <Stack spacing={1} sx={{height:"100%",overflowY:"auto"}}>
                    <Typography variant="h6">Subtypes</Typography>
                    <Stack direction="row" sx={{flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
                        {subtypes.map((item,i) => (
                            <Chip
                                key={"filter-collab-subtypes-"+i}
                                label={item.name}
                                sx={{backgroundColor:theme.default_background,color:theme.default_foreground,margin:"4px"}}
                                onClick={() => {
                                    if (noteCollabFilter.subtypes) {
                                        if (!noteCollabFilter.subtypes.find((data) => data.id === item.id))
                                            dispatch(setNoteCollabFilter({...noteCollabFilter,subtypes:[...noteCollabFilter.subtypes,{id:item.id!,name:item.name}]}))
                                        else
                                            dispatch(setNoteCollabFilter({...noteCollabFilter,subtypes:[...noteCollabFilter.subtypes.filter(data => data.id !== item.id!)]}))
                                    } else dispatch(setNoteCollabFilter({...noteCollabFilter,subtypes:[{id:item.id!,name:item.name}]}))
                                }}
                            />
                        ))}
                        {(loading)?<CircularProgress color="inherit"/>:null}
                    </Stack>
                    <Typography variant="h6">Severities</Typography>
                    <Stack direction="row" sx={{flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>
                        {severities.map((item,i) => (
                            <Chip
                                key={"filter-collab-severities-"+i}
                                label={item.data.split(delimiter)[0]}
                                icon={<Square sx={{color:`${item.data.split(delimiter)[1]}!important`}}/>}
                                sx={{backgroundColor:theme.default_background,color:theme.default_foreground,margin:"4px"}}
                                onClick={() => {
                                    if (noteCollabFilter.severities) {
                                        if (!noteCollabFilter.severities.find((data) => data === item.data))
                                            dispatch(setNoteCollabFilter({...noteCollabFilter,severities:[...noteCollabFilter.severities,item.data]}))
                                        else
                                            dispatch(setNoteCollabFilter({...noteCollabFilter,severities:[...noteCollabFilter.severities.filter(data => data !== item.data)]}))
                                    } else dispatch(setNoteCollabFilter({...noteCollabFilter,severities:[item.data]}))
                                }}
                            />
                        ))}
                        {(loading)?<CircularProgress color="inherit"/>:null}
                    </Stack>
                    <ThemeTextField
                        ref={refSearchField}
                        label="Member"
                        placeholder="Search Member"
                        themeObj={theme}
                        variant="standard"
                        state={StateThemeUtils.DEFAULT}
                        value={memberName}
                        onChange={(event) => {onMemberNameGuess(event.currentTarget.value)}}
                    />
                    <Box>
                        <ThemeButton
                            variant="outlined"
                            state={StateThemeUtils.DEFAULT}
                            themeObj={theme}
                            disabled={disable}
                            sx={{marginLeft:"auto",marginRight:"10px"}}
                            onClick={onFilter}
                        >Filter</ThemeButton>
                    </Box>
                </Stack>
            </Stack>
            <SearchSuggestContainer
                open={dataMemberGuess.length > 0}
                data={dataMemberGuess}
                loading={loadingGuess}
                refTarget={refSearchField.current}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}
                sxPaper={{width:`${(refSearchField.current)?refSearchField.current.offsetWidth:0}px`,maxHeight:"50vh",overflowY:"auto",backgroundColor:theme.background_color,color:theme.foreground_color}}
                colorLoading={theme.foreground_color}
                onClose={onClearMemberGuess}
                onClick={(data) => {onMemberNameGuess(data.name)}}
            />
        </Drawer>
    )
})

interface BodyNoteCollabContainerInterface {
    cardSx?: SxProps<Theme>
    adapterNote: NoteAdapter
    adapterSubtype: SubtypeAdapter
    adapterPublic: PublicAdapter
    group: Group
    subtype: Subtype
    index: number
    noteRemove?: NoteCollab
    noteAdd?: NoteCollab
    noteTransfer?: {data:NoteCollab,from:number,to:number}
    changeDirection: "landscape" | "potrait"
    onDeleteSubtype: (data:string) => void
    onRemoveNoteTrigger: () => void
    onAddNote:(subtype:Subtype) => void
    onClickTrigger: (subtype: Subtype,pointer?:{x:number,y:number}) => void
    onTransferNote: (event:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>,data: NoteCollab,from: number) => void
    onTransferSubtype: (event:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>,data: Subtype,from: number) => void
    onUpdateSubtypeCallback: (data: Subtype) => void
    theme: ThemeObj
    dateConverter: DateConverter
}
const BodyNoteCollabContainerObj = React.memo<{group:Group,notes:NoteCollab[],idI:string,theme:ThemeObj,dateConverter:DateConverter,onTransfer:(event:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>,data:NoteCollab) => void
    ,onClickSave:(data:NoteCollab|NotePrivate) => void,onDelete:(data:NoteCollab) => void}>(({
            group,notes,idI,theme,dateConverter,onTransfer,onClickSave,onDelete
        }) => (
    <>
        {notes.map((item,i) => (
            <Box key={idI+i}>
                <NoteList
                    id={idI+i}
                    theme={theme}
                    noteInit={item}
                    dateConverter={dateConverter}
                    role={group.roleMember!}
                    onTransfer={(e,data) => {onTransfer(e,data as NoteCollab)}}
                    onClickSave={onClickSave}
                    onDelete={() => {onDelete(item)}}
                />
            </Box>
        ))
        }
    </>
))
function BodyNoteCollabContainer({cardSx,adapterNote,adapterSubtype,adapterPublic,dateConverter,subtype,noteRemove,noteAdd,noteTransfer,index,group,changeDirection,onDeleteSubtype,onRemoveNoteTrigger,onClickTrigger,onAddNote,onTransferNote,onTransferSubtype,onUpdateSubtypeCallback,theme}:BodyNoteCollabContainerInterface) {
    const [notes,setNotes] = useState<NoteCollab[]>([])
    const [subtypeUpdate,setSubtypeUpdate] = useState<Subtype>()
    const [subtypeGuess,setSubtypeGuess] = useState<IdAndName<string>[]>([])
    const [loadingGuess,setLoadingGuess] = useState(false)
    const [disable,setDisable] = useState(false)
    const [swapIconSubtype,setSwapIconSubtype] = useState(false)
    const [openPallete,setOpenPallete] = useState<null | HTMLElement>(null)
    const refTextFieldSubtype = useRef<HTMLDivElement | null>(null)
    const profile = useAppSelector(state => state.profileReducer.profile)
    const dispatch = useAppDispatch()
    useEffect(() => {
        setSubtypeUpdate(subtype)
    },[subtype])
    useEffect(() => {
        if(noteTransfer) {
            if (noteTransfer.from === index) setNotes([...notes.filter(item => item.id !== noteTransfer.data.id)])
            if (noteTransfer.to === index) setNotes([...notes,noteTransfer.data])
        }
    },[noteTransfer])
    useEffect(() => {
        if (noteRemove) {
            setNotes([...notes.filter(item => item.id !== noteRemove.id)])
            onRemoveNoteTrigger()
        }
        if (noteAdd) {
            setNotes([...notes,noteAdd])
            onRemoveNoteTrigger()
        }
    },[noteRemove,noteAdd])
    useEffect(() => {
        if (!profile || profile && !profile.id) return;
        of({}).pipe(
            exhaustMap(async() => {
                await adapterNote.getSubtypeGroup({subtype: subtype.id!,group:group.id!},
                    (notesObj) => {
                        if (notesObj.length > 0) {
                            if(notesObj.length > 1) {
                                let data = ValidateAndSortArrayModel.validateArrayNoteCollab(notes,notesObj)
                                if (!data.first) setNotes(data.second)
                            } else if (notesObj.length > 0) {
                                let data = ValidateLastModels.validateNoteCollab(notes,notesObj[0])
                                if (!data) setNotes(notesObj)
                            }
                        } else setNotes([])},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    },[subtype,profile])
    const onUpdateNote = (data:NoteCollab) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(data && data.id)
                    await adapterNote.modifyNoteGroup({group: group.id!},data,
                        (notesObj) => {if (notesObj) {
                            setNotes([...notes.filter(item => item.id !== notesObj.id),notesObj])
                            dispatch(setMessage({message:"Update Note Success",error:false}))
                        }},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }
    const onDeleteNote = (note: NoteCollab) => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if(note && note.id)
                    await adapterNote.deleteNoteGroup({group: group.id!,note:note.id!},
                        (res) => {
                            if (res) 
                                if(res.data) {
                                    setNotes(notes.filter(item => item.id !== note.id))
                                    dispatch(setMessage({message:"Delete Note Success",error:false}))
                                } else dispatch(setMessage({message:"Delete Note Failed",error:true}))},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const onSearchGuessSubtype = (text: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        of(text).pipe(
            tap(() => {setLoadingGuess(true)}),
            map((event) => {setSubtypeUpdate({...subtypeUpdate!,name:event.currentTarget.value});return event.currentTarget.value}),
            exhaustMap(async(guess) => {
                await adapterPublic.getSubtypeSearch({name:guess,page:0,size:5},
                    (subtypesDt) => {setSubtypeGuess(subtypesDt.map(item => {return {id:item.id!,name:item.name} as IdAndName<string>}))},
                    (error) => {dispatch(setMessage({message:error,error:true}))},
                    (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setLoadingGuess(false)})
        ).subscribe()
    }

    const onModifySubtype = () => {
        of({}).pipe(
            tap(() => {setDisable(true)}),
            exhaustMap(async() => {
                if (subtypeUpdate && subtypeUpdate.id) 
                    await adapterSubtype.modify({index:index,oldSubtype:subtype.id!,group:group.id!},subtypeUpdate!,
                        (subtypeDt) => {if(subtypeDt) {
                            dispatch(setMessage({message:"Update Subtype Success",error:false}));
                            onUpdateSubtypeCallback(subtypeDt)} else dispatch(setMessage({message:"Cannot Update Subtype",error:true}))},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            }),
            tap(() => {setDisable(false)})
        ).subscribe()
    }

    const handleSave = useCallback((note:NoteCollab|NotePrivate) => {dispatch(setNoteCollab(note as NoteCollab));dispatch(setMessage({message:"Are you sure to update it ?",error:false,
    isOptional:{isDisable:disable,onClickOk: () => {onUpdateNote(note as NoteCollab)}}}))},[])

    const handleDelete = useCallback((note:NoteCollab) => {
        dispatch(setMessage({message:"Are you sure to delete it ?",error:false,
            isOptional:{isDisable:disable,onClickOk: () => {onDeleteNote(note)}}}))
    },[])
    return(
        <Card sx={{width: '100%',maxHeight:"100%",backgroundColor:(subtypeUpdate?.color)?subtypeUpdate.color!.substring(0,7)+'65':subtype.color!.substring(0,7)+'65',...cardSx}}
            onClick={(event) => {onClickTrigger(subtype,{x:event.clientX,y:event.clientY})}}>
            <Stack spacing={2} sx={{padding:"10px"}}>
                <Stack direction={"row"}>
                    {(group.roleMember === "ADMIN" || group.roleMember === "MANAGER")?
                        <>
                            <ThemeTextField
                                ref={refTextFieldSubtype}
                                variant="standard"
                                themeObj={theme}
                                value={(subtypeUpdate)?subtypeUpdate.name:""}
                                state={StateThemeUtils.INFO}
                                onFocus={() => {if (!swapIconSubtype) setSwapIconSubtype(true)}}
                                onBlur={() => {if (swapIconSubtype) setSwapIconSubtype(false)}}
                                onChange={onSearchGuessSubtype}
                                onClick={(event) => {event.stopPropagation()}}
                                sx={{width:"100%",flexGrow:1}}
                            />
                            <IconButton sx={{color:theme.info_background}} onMouseDown={(event) => {event.preventDefault()}} disabled={!swapIconSubtype} onClick={(event) => {setOpenPallete(event.currentTarget);event.stopPropagation()}}>
                                {(swapIconSubtype)?
                                    <Palette color="inherit"/>:<Edit color="inherit"/>
                                }
                            </IconButton>
                        </>:<Typography sx={{color:theme.info_foreground}}>{subtypeUpdate?.name}</Typography>
                    }
                </Stack>
                {(JSON.stringify(subtypeUpdate) !== JSON.stringify(subtype))?
                    <Stack direction="row" spacing={2}>
                        <ThemeButton
                            variant="contained"
                            themeObj={theme}
                            disabled={disable}
                            state={StateThemeUtils.DEFAULT}
                            onClick={(event) => {event.stopPropagation();onModifySubtype()}}
                            sx={{textTransform:"none"}}
                        >Save</ThemeButton>
                        <ThemeButton
                            variant="contained"
                            themeObj={theme}
                            disabled={disable}
                            state={StateThemeUtils.DEFAULT}
                            onClick={(event) => {event.stopPropagation();setSubtypeUpdate(subtype)}}
                            sx={{textTransform:"none"}}
                        >Cancel</ThemeButton>
                    </Stack>:null
                }
                <Stack direction={(changeDirection === "potrait")?"column":"row"} sx={{width:"100%",maxHeight:"100%",overflowY:(changeDirection === "potrait")?"auto":"unset",
                    overflowX:(changeDirection === "landscape")?"auto":"unset"}} spacing={2}>
                    {(notes.length > 0)?
                        <BodyNoteCollabContainerObj
                            group={group}
                            notes={notes}
                            idI={`note-list-`+subtype.name}
                            theme={theme}
                            dateConverter={dateConverter}
                            onClickSave={handleSave}
                            onDelete={handleDelete}
                            onTransfer={(e,data) => {onTransferNote(e,data,index)}}
                        />:<Box sx={{width:"100%",height:"100%",color:theme.foreground_color}}>
                                <Typography variant="h5">
                                    Note Empty
                                </Typography>
                                <Typography variant="body2">
                                    {`add new note to this subtype`}
                                </Typography>
                        </Box>
                    }
                    <Stack spacing={1}>
                        <Card sx={{backgroundColor: "#ffffff36",width:"100%",minWidth:"100px",height:"100%"}}>
                            <Tooltip title="Add Note">
                                <CardActionArea onClick={(event) => {event.stopPropagation();onAddNote(subtype)}} sx={{height:"100%"}}>
                                    <Stack sx={{color: theme.foreground,padding:"15px 0",alignItems:"center",width:"100%"}}>
                                        <AddCircle color="inherit" sx={{fontSize:"2rem"}}/>
                                    </Stack>
                                </CardActionArea>
                            </Tooltip>
                        </Card>
                    </Stack>
                </Stack>
                {(group.roleMember === "MANAGER" || group.roleMember === "ADMIN")?
                    <Stack direction={"row"}>
                        <IconButton
                            sx={{color:theme.danger_background}}
                            onClick={(event) => {event.stopPropagation();onDeleteSubtype(subtype.id!)}}>
                                <Delete color="inherit"/>
                        </IconButton>
                        <IconButton
                            sx={{color:theme.default_background}}
                            onClick={(event) => {event.stopPropagation();onTransferSubtype(event,subtype,index)}}>
                                <OpenInNewRounded color="inherit"/>
                        </IconButton>
                    </Stack>:null
                }
            </Stack>
            <Menu
                anchorEl={openPallete}
                open={Boolean(openPallete)}
                keepMounted
                onClick={(event) => {event.stopPropagation()}}
                onClose={() => {setOpenPallete(null)}}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 2}}
                MenuListProps={{sx:{padding:0}}}
            >
                <Box onClick={(event) => {event.stopPropagation()}}>
                    <SketchPicker color={(subtypeUpdate)? subtypeUpdate.color:undefined} onChangeComplete={(color) => {setSubtypeUpdate({...subtypeUpdate!,color:color.hex.toUpperCase()+"FF"})}}/>
                </Box>
            </Menu>
            <SearchSuggestContainer
                open={subtypeGuess.length > 0}
                data={subtypeGuess}
                loading={loadingGuess}
                refTarget={refTextFieldSubtype.current}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 2}}
                colorLoading={theme.foreground_color}
                sxPaper={{width:`${(refTextFieldSubtype.current)?refTextFieldSubtype.current.offsetWidth:0}px`,maxHeight:"50vh",overflowY:"auto",backgroundColor:theme.background_color,color:theme.foreground_color}}
                onClick={(data) => {setSubtypeUpdate({...subtypeUpdate,id:data.id,name:data.name})}}
                onClose={() => {setSubtypeGuess([])}}
            />
        </Card>
    )
}

interface BodyNotePrivateContainerInterface {
    boxSx?: SxProps<Theme>
    adapterNote: NoteAdapter
    noteArrayPrivateConverter: NotePrivateArrayConverter
    onAddNote: () => void
    onDeleteCategory: (category:string) => void
    onLoading: (loading:boolean) => void
    loading: boolean
    open: boolean
    theme: ThemeObj
    dateConverter: DateConverter
}
const BodyNotePrivateContainerObj = React.memo<{notes: {category: string,data: NotePrivate[]}[],theme:ThemeObj,dateConverter:DateConverter,onTransfer:(event:MouseEvent<HTMLButtonElement,globalThis.MouseEvent>,data:NotePrivate) => void,
        onClickPos:(event:MouseEvent<HTMLDivElement,globalThis.MouseEvent>,category:string) => void,onClickSave:(data:NoteCollab|NotePrivate) => void,
        onDelete:(data:NotePrivate) => void}>(({notes,theme,dateConverter,onTransfer,onClickPos,onClickSave,onDelete}) => {
            return(
                <>
                    {notes.map((item,ind) => (
                        <Stack key={"container-label-"+ind} onClick={(event) => {onClickPos(event,item.category)}} sx={{color:theme.foreground_color,width:"100%"}}>
                            <Typography variant="h5">{item.category}</Typography>
                            <Divider sx={{backgroundColor:theme.foreground_color,marginBottom:"10px"}}/>
                            <Grid2 container spacing={2} sx={{width:"100%"}}>
                                {item.data.map((note,i) => (
                                        <Grid2 key={`note-list-container`+item.category+note.id+i} xs={12} md={6} lg={4} xl={3}>
                                            <NoteList
                                                id={`note-list-`+item.category+note.id+i}
                                                key={`note-list-`+item.category+note.id+i}
                                                theme={theme}
                                                noteInit={note}
                                                onTransfer={onTransfer}
                                                dateConverter={dateConverter}
                                                onClickSave={onClickSave}
                                                role={"MANAGER"}
                                                onDelete={() => {onDelete(note)}}
                                            />
                                        </Grid2>
                                ))}
                            </Grid2>
                        </Stack>
                    ))}
                </>
            )
})
function BodyNotePrivateContainer({boxSx,adapterNote,noteArrayPrivateConverter,dateConverter,onAddNote,onDeleteCategory,onLoading,open,loading,theme}:BodyNotePrivateContainerInterface) {
    const [mousePosition,setMousePosition] = useState<{x:number,y:number}>()
    const [categoryMenuTrigger,setCategoryMenuTrigger] = useState("")
    const [categories,setCategories] = useState<string[]>([])
    const [noteTransfer,setNoteTransfer] = useState<{element:HTMLButtonElement,data:NotePrivate}>()
    const notes = useAppSelector(state => state.noteReducer.notePrivates)
    const error = useAppSelector(state => state.messageRespon.message.error)
    const dispatch = useAppDispatch()
    useEffect(() => {
        setCategories([...notes.map(item => item.category)])
    },[notes])
    const onUpdateNote = (data:NotePrivate) => {
        of({}).pipe(
            exhaustMap(async() => {
                if(data && data.id)
                    await adapterNote.modifyNotePrivate(data,
                        (notesObj) => {if (notesObj) {
                            dispatch(setNotePrivates(noteArrayPrivateConverter.to([...noteArrayPrivateConverter.from(notes).filter(item => item.id !== notesObj.id),notesObj])))
                            dispatch(setMessage({message:"Update Note Success",error:false}))
                        }},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    }
    
    const onDeleteNote = (note: NotePrivate) => {
        of({}).pipe(
            exhaustMap(async() => {
                if(note && note.id)
                    await adapterNote.deleteNotePrivate({note:note.id!},
                        (res) => {
                            if (res) 
                                if(res.data) {
                                    dispatch(setNotePrivates(noteArrayPrivateConverter.to([...noteArrayPrivateConverter.from(notes).filter(item => item.id !== note.id)])))
                                    dispatch(setMessage({message:"Delete Note Success",error:false}))
                                } else dispatch(setMessage({message:"Delete Note Failed",error:true}))},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
            })
        ).subscribe()
    }

    const onTransfer = (data:NotePrivate,category:string) => {
        if (data && category !== data.category!) {
            of({}).pipe(
                tap(() => {onLoading(true)}),
                map(() => {return {...data,category: category} as NotePrivate}),
                exhaustMap(async(note) => {
                    await adapterNote.modifyNotePrivate(note,
                        (notesObj) => {if (notesObj) {
                            let dataNew = [...notes.map(item => item.data).flat().filter(item => item.id !== notesObj.id)]
                            dispatch(setNotePrivates(noteArrayPrivateConverter.to([...dataNew,notesObj])))
                        }},
                        (error) => {dispatch(setMessage({message:error,error:true}))},
                        (route) => {dispatch(setRoute(route));dispatch(setMessage({message:"Session Expired",error:true}))})
                }),
                tap(() => {if (!error) onLoading(false)})
            ).subscribe()
        }
    }

    const handleClickPos = useCallback((event:MouseEvent<HTMLDivElement,globalThis.MouseEvent>,category:string) => {
        setMousePosition({x:event.clientX,y:event.clientY})
        setCategoryMenuTrigger(category)
    },[])

    const handleSave = useCallback((data:NoteCollab|NotePrivate) => {
        dispatch(setNotePrivate(data))
        dispatch(setMessage({message:"Are you sure to update it ?",error:false,
            isOptional:{onClickOk: () => {onUpdateNote(data)}}}))
    },[])

    const handleDelete = useCallback((data:NotePrivate) => {
        dispatch(setMessage({message:"Are you sure to delete it ?",error:false,
            isOptional:{onClickOk: () => {onDeleteNote(data)}}}))
    },[])

    const handleTransfer = useCallback(onTransfer,[])

    return(
        <Box sx={{width:'100%',padding:"10px 0",height:"100%",...boxSx}}>
            <Stack spacing={2} sx={{alignItems:"center",justifyContent:"center",padding:"10px"}}>
                {(notes.length > 0)?
                    <BodyNotePrivateContainerObj
                        notes={notes}
                        theme={theme}
                        dateConverter={dateConverter}
                        onClickPos={handleClickPos}
                        onClickSave={handleSave}
                        onDelete={handleDelete}
                        onTransfer={(event,item) => {setNoteTransfer({element:event.currentTarget,data:item})}}
                    />:<Box sx={{color:theme.foreground_color}}>
                            <Typography variant="h5">
                                Note is Empty
                            </Typography>
                    </Box>
                }
            </Stack>
            <Menu
                open={mousePosition !== undefined}
                anchorReference="anchorPosition"
                anchorPosition={(mousePosition)?{top:mousePosition.y,left:mousePosition.x}:undefined}
                onClose={() => {setMousePosition(undefined)}}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 2,position:"absolute"}}
                MenuListProps={{sx:{padding:0}}}
            >
                <MenuItem onClick={() => {onDeleteCategory(categoryMenuTrigger);setMousePosition(undefined)}}>Delete Category</MenuItem>
                <MenuItem onClick={() => {onAddNote();setMousePosition(undefined)}}>Add Note</MenuItem>
            </Menu>
            <Menu
                open={noteTransfer !== undefined}
                anchorEl={noteTransfer?.element}
                onClose={() => {setNoteTransfer(undefined)}}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 2,position:"absolute"}}
                MenuListProps={{sx:{padding:0}}}
            >
                {
                    categories.map((item,i) => (
                        <div key={"menu-category-"+i}>
                            {(item !== noteTransfer?.data.category)?
                                <MenuItem onClick={() => {handleTransfer(noteTransfer!.data,item);setNoteTransfer(undefined)}}>{`transfer to ${item}`}</MenuItem>:null
                            }
                        </div>
                    ))
                }
            </Menu>
        </Box>
    )
}