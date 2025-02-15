import { User } from "../db/model"
import { nanoid } from "nanoid"

/**
 * 创建用户
 * @param {*} username 
 * @returns 
 */
export async function createUser(username: string) {
    const avatarList = [
        '/dvran-avatar/changjinglu.png',
        '/dvran-avatar/hudie.png',
        '/dvran-avatar/laohu.png',
        '/dvran-avatar/luotuo.png',
        '/dvran-avatar/mao.png',
        '/dvran-avatar/mianyang.png',
        '/dvran-avatar/milu.png',
        '/dvran-avatar/nainiu.png',
        '/dvran-avatar/songshu.png',
        '/dvran-avatar/xiniu.png',
        '/dvran-avatar/xiongmao.png',
        '/dvran-avatar/yangtu.png'
    ]
    const randomIndex = Math.floor(Math.random() * (avatarList.length - 1 - 0 + 1)) + 0;
    const avatar = avatarList[randomIndex]
    const user = await User.create({
        username,
        nickname: username,
        avatar: process.env?.MEDIA_DOMAIN + avatar,
    })
    return user
}

/**
 * 使用openid创建用户
 * @param {*} openid 
 */
export async function createUserByOpenid(openid: string): Promise<any> {
    const avatarList = [
        '/dvran-avatar/changjinglu.png',
        '/dvran-avatar/hudie.png',
        '/dvran-avatar/laohu.png',
        '/dvran-avatar/luotuo.png',
        '/dvran-avatar/mao.png',
        '/dvran-avatar/mianyang.png',
        '/dvran-avatar/milu.png',
        '/dvran-avatar/nainiu.png',
        '/dvran-avatar/songshu.png',
        '/dvran-avatar/xiniu.png',
        '/dvran-avatar/xiongmao.png',
        '/dvran-avatar/yangtu.png'
    ]
    const randomIndex = Math.floor(Math.random() * (avatarList.length - 1 - 0 + 1)) + 0;
    const avatar = avatarList[randomIndex]
    const userCount = await User.count()
    const user = await User.create({
        openid,
        username: nanoid(),
        nickname: 'ᠬᠡᠷᠡᠭ᠍ᠯᠡᠭ᠍ᠴᠢ ' + userCount,
        avatar: process.env?.MEDIA_DOMAIN + avatar
    })
    return user
}

/**
 * 使用openid查询用户
 * @param {*} openid 
 * @returns 
 */
export async function findUserByOpenid(openid: string) {
    const result = await User.findOne({
        where: {
            openid
        }
    })
    return result
}

/**
 * 使用id查询用户
 * @param {*} id 
 * @returns 
 */
export async function findUserById(id: number) {
    const result = await User.findByPk(id)
    return result
}

/**
 * 通过id更新用户
 * @param {*} id 
 * @param {*} value 
 */
export async function updateUserById(id: number, value: Record<string, any>) {
    const [updatedCount, updatedUsers] = await User.update(value, {
        where: { id },
        returning: true, // 返回更新后的记录
    })    
    return { updatedCount, updatedUsers }    
}