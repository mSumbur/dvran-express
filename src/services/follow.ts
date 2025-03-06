import createHttpError from "http-errors"
import { UserFollowModel, UserModel } from "../db/model"
import { IPageQuery } from "../middleware/validaters"

namespace FollowService {
    /**
     * 关注用户
     * @param data 关注数据
     * @returns 创建的 UserFollowModel 实例 
     */
    export async function followUser(data: {
        followerId: number
        followingId: number
    }): Promise<UserFollowModel> {
        try {
            const result = await UserFollowModel.create(data)
            return result
        } catch (err) {
            throw createHttpError(500)
        }
    }

    /**
     * 移除关注
     * @param data 
     * @returns true
     */
    export async function unFollowUser(data: {
        followerId: number
        followingId: number
    }) {
        const result = await UserFollowModel.findOne({
            where: data
        })
        if (result) {
            await result.destroy()
        }
        return true
    }

    /**
     * 获取指定用户的粉丝列表
     * @param options 查询参数
     * @returns 查询到的列表和总数
     */
    export async function getFollowersByUserId(options: {
        userId: number
    } & IPageQuery) {
        const { page, count, userId } = options
        const result = await UserModel.findAndCountAll({
            where: { id: userId },
            include: [{
                model: UserModel,
                as: 'followers',
                through: { attributes: [] }                
            }],            
            offset: (page - 1) * count,
            limit: count
        })        
        return {
            rows: result.rows[0]?.followers || [], 
            count : result.count
        }
    }

    /**
     * 获取指定用户的关注列表
     * @param options 查询参数
     * @returns 查询到的列表和总数
     */
    export async function getFollowingByUserId(options: {
        userId: number
    } & IPageQuery) {
        const { page, count, userId } = options        
        const result = await UserModel.findAndCountAll({
            where: { id: userId },
            include: [{
                model: UserModel,
                as: 'following',
                through: { attributes: [] }                
            }],            
            offset: (page - 1) * count,
            limit: count
        })
        return {
            rows: result.rows[0]?.following || [],
            count : result.count
        }
    }
}

export default FollowService