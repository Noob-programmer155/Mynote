import { Pair } from './model-side';

export interface Model {
    id?: string;
}

export interface Subtype extends Model {
    name: string;
    color: string
}

export interface Theme extends Model {
    name: string;
    background_color: string;
    foreground_color: string;
    background_images?: string;
    border_color: string;
    danger_background: string;
    danger_foreground: string;
    info_background: string;
    info_foreground: string;
    default_background: string;
    default_foreground: string;
    background: string;
    foreground: string;
    createdBy?: Pair<string,string>;
    createdDate?: string;
}

export interface Group extends Model {
    username:string;
    password?:string;
    avatar?:string;
    isMember?:boolean;
}

export interface Member extends Model {
    username:string;
    password?:string;
    avatar?:string;
    theme?:Theme;
}

export interface NotePrivate extends Model {
    title:string;
    category?: string;
    severity: Pair<string,string>;
    description: string;
    keynotes?: string[];
    createdBy?: Pair<string,string>;
    createdDate?: string;
    lastModifiedBy?: Pair<string,string>;
    lastModifiedDate?: string;
    member?: Member;
}

export interface NoteCollab extends Model {
    title:string;
    subtype: Subtype;
    severity: Pair<string,string>;
    description: string;
    keynotes?: string[];
    createdBy?: Pair<string,string>;
    createdDate?: string;
    lastModifiedBy?: Pair<string,string>;
    lastModifiedDate?: string;
    member?: Member;
}