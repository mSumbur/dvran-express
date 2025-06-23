import { model } from "mongoose";
import { createSchema, IBaseModel } from "./types";
import { nanoid } from "nanoid";

export interface IUser extends IBaseModel {
    nickname: string
    username: string
    password?: string
    avatar: string
    bio?: string
    gender: number      // 0男 1女
    birthday: Date
    openid?: string
    unionid: string
    phone: string
    ipaddress: string
    isAdmin: boolean
}

const userSchema = createSchema<IUser>({
    nickname: String,
    username: { type: String, unique: true },
    password: String,
    avatar: String,
    bio: String,
    gender: { type: Number, default: 0 },
    birthday: Date,
    openid: String,
    unionid: String,
    phone: Number,
    ipaddress: String,
    isAdmin: Boolean
})

userSchema.pre('save', async function (next) {
    // 定义默认昵称
    if (!this.nickname) {
        const count = await model<IUser>('users').countDocuments()
        this.nickname = `ᠬᠡᠷᠡᠭ᠍ᠯᠡᠭ᠍ᠴᠢ ${count + 1}`
    }
    // 定义用户名
    if (!this.username) {
        let username = ''
        let exists = true
        while (exists) {
            const id = nanoid(6)
            username = `user_${id}`
            exists = (await model<IUser>('users').exists({ username })) ? true : false
        }
        this.username = username
    }
    // 定义默认头像
    if (!this.avatar) {
        const randomIndex = Math.floor(Math.random() * (6 - 1 - 0 + 1)) + 0
        const avatarUrl = (this.gender == 1 ? 'female-' : 'male-') + randomIndex + '.png'
        this.avatar = process.env?.MEDIA_DOMAIN + avatarUrl
    }
    next()
})

export const UserModel = model<IUser>('users', userSchema)