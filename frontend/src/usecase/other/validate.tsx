import { Group, Member, NoteCollab, NotePrivate, Subtype, Theme } from "../../model/model"
import { Pair, Role } from "../../model/model-side"

export function validateName(name:string): boolean {
    return new RegExp(`^[a-zA-Z0-9\-\\s]*$`,'g').test(name)
}

function compare(a:any,b:any): boolean {
    if (((a !== null && a !== undefined) && (b !== null && b !== undefined)) && (typeof a === 'object' && Object.keys(a).length > 0)) {
        return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(l => compare(a[l],b[l]))
    }
    else {
        return a === b
    }
}

function validate(a:any): boolean {
    return (a !== null && a !== undefined)?
        ((typeof a === 'object' )? Object.keys(a).every(l => validate(a[l])):
            (typeof a === 'string' && a.length > 0)? true:
            (typeof a === 'string' && a.length <= 0)? false:true):false
}

export function compareTheme(theme1: Theme, theme2: Theme) {
    return compare({...theme1,createdDate:"",createdBy:"",background_images:(theme1.background_images)?theme1.background_images:""},
        {...theme2,createdDate:"",createdBy:"",background_images:(theme2.background_images)?theme2.background_images:""})
}

export class ValidateSaveVariable {
    static validateTheme(theme:Theme) {
        return validate({...theme,isMyTheme: true,createdBy: "created",createdDate: "date"})
    }
    static validateMember(member:Member) {
        return validate({...member,avatar:"avatar",theme:"theme",role:"role"})
    }
    static validateGroup(group:Group) {
        return validate({...group,avatar:"avatar",isMember:false,roleMember:"role",role:"role"})
    }
    static validateNotePrivate(note:NotePrivate) {
        return validate({...note,keynotes: "key",createdBy: "created",createdDate: "date",lastModifiedBy: "modif",lastModifiedDate: "date"})
    }
    static validateNoteCollab(note:NoteCollab) {
        return validate({...note,keynotes: "key",createdBy: "created",createdDate: "date",lastModifiedBy: "modif",lastModifiedDate: "date",member: "member"})
    }
}

export class ValidateLastModels {
    static validateSubtype(subtypes: Subtype[],subtype: Subtype): boolean{
        if (subtypes.length > 0) {
            return compare(subtypes[subtypes.length-1],subtype)
        } else return false
    }
    static validateTheme(themes: Theme[],theme: Theme): boolean{
        if (themes.length > 0) {
            return compare(themes[themes.length-1],theme)
        } else return false
    }
    static validateMember(members: Member[],member: Member): boolean{
        if (members.length > 0) {
            return compare(members[members.length-1],member)
        } else return false
    }
    static validateGroup(groups: Group[],group: Group): boolean{
        if (groups.length > 0) {
            return compare(groups[groups.length-1],group)
        } else return false
    }
    static validateNotePrivate(notes: NotePrivate[],note: NotePrivate): boolean{
        if (notes.length > 0) {
            return compare(
                {title:notes[notes.length-1].title,category:notes[notes.length-1].category,severity:notes[notes.length-1].severity,description:notes[notes.length-1].description,lastModifiedDate:notes[notes.length-1].lastModifiedDate,keynotes:(notes[notes.length-1].keynotes && notes[notes.length-1].keynotes!.length > 0)?notes[notes.length-1].keynotes:null}
                ,{title:note.title,category:note.category,severity:note.severity,description:note.description,lastModifiedDate:note.lastModifiedDate,keynotes:(note.keynotes && note.keynotes!.length > 0)?note.keynotes:null})
        } else return false
    }
    static validateNoteCollab(notes: NoteCollab[],note: NoteCollab): boolean{
        if (notes.length > 0) {
            return compare({title:notes[notes.length-1].title,subtype:notes[notes.length-1].subtype,severity:notes[notes.length-1].severity,description:notes[notes.length-1].description,lastModifiedDate:notes[notes.length-1].lastModifiedDate,keynotes:(notes[notes.length-1].keynotes && notes[notes.length-1].keynotes!.length > 0)?notes[notes.length-1].keynotes:null}
            ,{title:note.title,subtype:note.subtype,severity:note.severity,description:note.description,lastModifiedDate:note.lastModifiedDate,keynotes:(note.keynotes && note.keynotes!.length > 0)?note.keynotes:null})
        } else return false
    }
}

export class ValidateAndSortArrayModel {
    static validateArraySubtype(oldSubtypes: Subtype[],newSubtypes: Subtype[],sorting?:boolean): Pair<boolean,Subtype[]>{
        let data = (sorting)?newSubtypes.sort((a,b) => a.name.localeCompare(b.name)):newSubtypes
        return {first: oldSubtypes.length === newSubtypes.length && oldSubtypes.every((a,i) => compare(a,data[i])),second:data}
    }
    static validateArrayTheme(oldThemes: Theme[],newThemes: Theme[]): Pair<boolean,Theme[]>{
        let data = newThemes.sort((a,b) => a.name.localeCompare(b.name))
        return {first: oldThemes.length === newThemes.length && oldThemes.every((a,i) => compare(a,data[i])),second:data}
    }
    static validateArrayMember(oldMembers: Member[],newMembers: Member[]): Pair<boolean,Member[]>{
        let data = newMembers.sort((a,b) => a.username.localeCompare(b.username))
        return {first: oldMembers.length === newMembers.length && oldMembers.every((a,i) => compare(a,data[i])),second:data}
    }
    static validateArrayGroup(oldGroups: Group[],newGroups: Group[]): Pair<boolean,Group[]>{
        let data = newGroups.sort((a,b) => a.username.localeCompare(b.username))
        return {first: oldGroups.length === data.length && oldGroups.every((a,i) => compare(a,data[i])),second:data}
    }
    static validateArrayNotePrivate(oldNotes: NotePrivate[],newNotes: NotePrivate[],sortedComp?:boolean): Pair<boolean,NotePrivate[]>{
        let data = newNotes.sort((a,b) => a.category!.localeCompare(b.category!) || Date.parse(b.lastModifiedDate!) - Date.parse(a.lastModifiedDate!))
        let oldData = oldNotes
        if (sortedComp) {
            oldData = oldNotes.sort((a,b) => a.category!.localeCompare(b.category!) || Date.parse(b.lastModifiedDate!) - Date.parse(a.lastModifiedDate!))
        }
        return {first: oldData.length === data.length && oldData.every((a,i) => compare(
                {title:a.title,category:a.category,severity:a.severity,description:a.description,lastModifiedDate:a.lastModifiedDate,keynotes:(a.keynotes && a.keynotes.length > 0)?a.keynotes:null},
                {title:data[i].title,category:data[i].category,severity:data[i].severity,description:data[i].description,lastModifiedDate:data[i].lastModifiedDate,
                    keynotes:(data[i].keynotes && data[i].keynotes!.length > 0)?data[i].keynotes:null}
            )),second:data}
    }
    static validateArrayNoteCollab(oldNotes: NoteCollab[],newNotes: NoteCollab[],sortedComp?:boolean): Pair<boolean,NoteCollab[]>{
        let data = newNotes.sort((a,b) => a.subtype.name.localeCompare(b.subtype.name) || Date.parse(b.lastModifiedDate!) - Date.parse(a.lastModifiedDate!))
        let oldData = oldNotes
        if (sortedComp) {
            oldData = oldNotes.sort((a,b) => a.subtype.name.localeCompare(b.subtype.name) || Date.parse(b.lastModifiedDate!) - Date.parse(a.lastModifiedDate!))
        }
        return {first: oldData.length === data.length && oldData.every((a,i) => compare(
                {title:a.title,subtype:a.subtype,severity:a.severity,description:a.description,lastModifiedDate:a.lastModifiedDate,keynotes:(a.keynotes && a.keynotes.length > 0)?a.keynotes:null},
                {title:data[i].title,subtype:data[i].subtype,severity:data[i].severity,description:data[i].description,lastModifiedDate:data[i].lastModifiedDate,
                    keynotes:(data[i].keynotes && data[i].keynotes!.length > 0)?data[i].keynotes:null}
            )),second:data}
    }
}
