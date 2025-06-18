import { ArticleModel, UserFollowModel, UserModel } from "../db/model"
import { nanoid } from "nanoid"
import sequelize from "../db/seq";
import { IPageQuery } from "../middleware/validaters";
import { Op } from "sequelize";

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
        const randomIndex = Math.floor(Math.random() * (6 - 1 - 0 + 1)) + 0;
        const avatar = 'male-' + randomIndex + '.png'
        const userCount = await UserModel.count()
        const user = await UserModel.create({
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
        const result = await UserModel.findOne({
            where: {
                openid
            }
        })
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
        const result = await UserModel.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        nickname: {
                            [Op.like]: `%${name}%`
                        }
                    }, {
                        nickname: {
                            [Op.like]: `%${name.split('').join('%')}%`
                        }
                    }
                ]
            }
        })
        return result
    }

    /**
     * 使用id查询用户
     * @param {number} id 
     * @returns 
     */
    export async function findUserById(id: number) {
        const result = await UserModel.findByPk(id, {
            attributes: [
                ...Object.keys(UserModel.getAttributes()),
                [sequelize.literal('(SELECT COUNT(*) FROM user_follows WHERE user_follows.followingId = user.id)'), 'followerCount'],
                [sequelize.literal('(SELECT COUNT(*) FROM user_follows WHERE user_follows.followerId = user.id)'), 'followingCount']
            ]
        })
        return result
    }

    /**
     * 通过id更新用户
     * @param {*} id 
     * @param {*} value 
     */
    export async function updateUserById(id: number, value: Record<string, any>) {
        const [updatedCount, updatedUsers] = await UserModel.update(value, {
            where: { id },
            returning: true, // 返回更新后的记录
        })    
        return { updatedCount, updatedUsers }    
    }

    /**
     * 获取用户列表
     * @param options 查询选项
     * @returns 用户列表
     */
    export async function findUsers(options: IPageQuery) {
        const { page, count } = options
        const result = await UserModel.findAndCountAll({
            where: {},
            offset: (page - 1) * count,        
            limit: count       
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
        const result = await UserFollowModel.findOne({ where: options })
        return result ? true : false
    }
}

export default UserService