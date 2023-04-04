import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import * as crypto from 'crypto-js';
import { key_token } from '../../data/resource/resource';

interface AttributeConverter<I,O> {
    to(data: I): O
    from(data: O): I
}

export class DateConverter implements AttributeConverter<Date,string>{
    to(data: Date): string {
        return format(data,'yyyy/MM/dd hh:mm a',{locale: idLocale});
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
        let ivI = crypto.enc.Utf8.parse(localStorage.getItem("GHT_NT")!)
        return crypto.AES.encrypt(token,this.key,{iv: ivI}).toString()
    }
    from(encrypted_token: string): string {
        let ivI = crypto.enc.Utf8.parse(localStorage.getItem("GHT_NT")!)
        return crypto.AES.decrypt(encrypted_token,this.key,{iv: ivI}).toString()
    }
}