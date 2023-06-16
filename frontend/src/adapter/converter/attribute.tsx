import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import * as crypto from 'crypto-js';
import { key_token,iv_token } from '../../model/data/resource/resource';
import { NoteCollab, NotePrivate, Subtype } from '../../model/model';

interface AttributeConverter<I,O> {
    to(data: I,callback?:(data:any) => void): O
    from(data: O,callback?:(data:any) => void): I
}

export class DateConverter implements AttributeConverter<Date,string>{
    to(data: Date): string {
        return format(data,'yyyy/MM/dd',{locale: idLocale});
    }
    from(data: string): Date {
        return new Date(data);
    }
}

export class TokenConverter implements AttributeConverter<string,string>{
    private key: string = key_token

    // after user login
    static createIvParam() {
        localStorage.setItem("GHT_NT",CryptoJS.lib.WordArray.random(16).toString())
    }

    to(token: string): string {
        let ivI = crypto.enc.Utf8.parse(iv_token)
        return crypto.AES.encrypt(token,this.key,{iv: ivI}).toString()
    }
    from(encrypted_token: string): string {
        let ivI = crypto.enc.Utf8.parse(iv_token)
        return crypto.AES.decrypt(encrypted_token,this.key,{iv: ivI}).toString()
    }
}

export class FileConverter implements AttributeConverter<Blob,string>{
    to(data: Blob,callback:(res:string) => void): string {
        let reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onloadend = () => { callback(reader.result?reader.result.toString():"") }
        return ""
    }
    from(data: string): Blob {
        const byteCharacters = window.atob(data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type: "image/jpeg"});
    }
}

export class NotePrivateArrayConverter implements AttributeConverter<NotePrivate[],{category: string,data: NotePrivate[]}[]> {
    to(data: NotePrivate[]): { category: string; data: NotePrivate[]; }[] {
        let categoryData: {category: string,data: NotePrivate[]}[] = []
        let categoryIndex: string = ""
        data.sort((a,b) => {
            let data = a.category!.localeCompare(b.category!)
            if (data !== 0)
                return data
            return Date.parse(b.lastModifiedDate!) - Date.parse(a.lastModifiedDate!)
        }).forEach(item => {
            if(item.category !== categoryIndex) {
                categoryData.push({category:item.category!,data:[]})
                categoryIndex = item.category!
            }
            let dtInit = categoryData[categoryData.length-1]
            categoryData[categoryData.length-1] = {...dtInit,data: [...dtInit.data,item]}
        })
        return categoryData
    }
    from(data: { category: string; data: NotePrivate[]; }[]): NotePrivate[] {
        return data.map(item => item.data).flat()
    }
}

export class NoteCollabArrayConverter implements AttributeConverter<NoteCollab[],{subtype: Subtype,data: NoteCollab[]}[]> {
    to(data: NoteCollab[]): { subtype: Subtype; data: NoteCollab[]; }[] {
        let subtypeData: {subtype: Subtype,data: NoteCollab[]}[] = []
        let subtypeIndex: string = ""
        data.sort((a,b) => {
            let data = a.subtype.name.localeCompare(b.subtype.name)
            if (data !== 0)
                return data
            return a.title.localeCompare(b.title)
        }).forEach(item => {
            if(item.subtype.name !== subtypeIndex) {
                subtypeData.push({subtype:item.subtype,data:[]})
                subtypeIndex = item.subtype.name
            }
            let dtInit = subtypeData[subtypeData.length-1]
            subtypeData[subtypeData.length-1] = {...dtInit,data: [...dtInit.data,item]}
        })
        return subtypeData
    }
    from(data: { subtype: Subtype; data: NoteCollab[]; }[]): NoteCollab[] {
        return data.map(item => item.data).flat()
    }
}

export class RoleSortConverter implements AttributeConverter<string,number> {
    to(data: string, callback?: ((data: any) => void) | undefined): number {
        if (data === "MANAGER")
            return 3
        else if (data === "ADMIN")
            return 2
        else return 1
    }

    from(data: number, callback?: ((data: any) => void) | undefined): string {
        if (data === 3)
            return "MANAGER"
        else if (data === 2)
            return "ADMIN"
        else return "MEMBER"
    }
}