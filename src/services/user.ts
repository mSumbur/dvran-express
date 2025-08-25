import { UserModel } from "../db/model"
import { nanoid } from "nanoid"
import { IPageQuery } from "../middleware/validaters";
import { findAndCountAll } from "../utils/findAndCountAll";

namespace UserService {
    /**
     * 创建用户
     * @param {*} username 
     * @returns 
     */
    export async function createUser(options: {
        nickname?: string
        avatar?: string
        gender?: number
    }) {
        const randomIndex = Math.floor(Math.random() * (6 - 1 - 0 + 1)) + 0;
        const avatarUrl = (options.gender == 1 ? 'female-' : 'male-') + randomIndex + '.png'
        const user = await UserModel.create({
            username: nanoid(),
            avatar: process.env?.MEDIA_DOMAIN + avatarUrl,
            ...options
        })
        return user
    }

    /**
     * 使用openid创建用户
     * @param {*} openid 
     */
    export async function createUserByOpenid(openid: string): Promise<any> {
        const randomIndex = Math.floor(Math.random() * 6) + 1
        const avatar = '/male-' + randomIndex + '.png'
        const userCount = await UserModel.countDocuments()
        const user = await UserModel.create({
            openid,
            username: nanoid(),
            nickname: 'ᠬᠡᠷᠡᠭᠯᠡᠭᠴᠢ ' + userCount,
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
        const result = await UserModel.findOne({ openid })
        return result
    }

    /**
     * 通过用户名模糊搜索用户
     * @param options 
     * @returns 
     */
    export async function findUsersByNickname(options: {
        name: string
    } & IPageQuery) {
        const { name } = options
        const query = {
            $or: [
                { nickname: { $regex: name, $options: 'i' } },
                { nickname: { $regex: name.split('').join('.*'), $options: 'i' } }
            ]
        }
        const result = await findAndCountAll(UserModel, query)
        return result
    }

    /**
     * 使用id查询用户
     * @param {number} id 
     * @returns
     */
    export async function findUserById(id: number) {
        // const result = await UserModel.findByPk(id, {
        //     attributes: [
        //         ...Object.keys(UserModel.getAttributes()),
        //         [sequelize.literal('(SELECT COUNT(*) FROM user_follows WHERE user_follows.followingId = user.id)'), 'followerCount'],
        //         [sequelize.literal('(SELECT COUNT(*) FROM user_follows WHERE user_follows.followerId = user.id)'), 'followingCount']
        //     ]
        // })
        const result = await UserModel.findById(id)
        return result
    }

    /**
     * 通过id更新用户
     * @param {*} id 
     * @param {*} value 
     */
    export async function updateUserById(id: number, value: Record<string, any>) {
        const user = await UserModel.findByIdAndUpdate(
            id, value, { new: true }
        )
        return user
    }

    /**
     * 获取用户列表
     * @param options 查询选项
     * @returns 用户列表
     */
    export async function findUsers(options: IPageQuery) {
        const { page, count } = options
        const result = findAndCountAll(UserModel, {}, {
            page: page,
            count: count
        })
        return result
    }

    /**
     * 获取用户关注情况 
     * @param options 选项
     * @returns 收否关注
     */
    export async function findUserFollowStatus(options: {
        followerId: number
        followingId: number
    }): Promise<boolean> {
        // const result = await UserFollowModel.findOne({ where: options })
        // return result ? true : false
        return true
    }
}

export default UserService