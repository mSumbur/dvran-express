import { Tag } from "../db/model"
import { IPageQuery } from "../middleware/validaters"

/**
 * 创建标签
 * @param {*} params 
 */
export async function createTag(params: any) {
    return await Tag.create(params)
}

/**
 * 获取推荐标签
 * @param {*} req 
 * @returns 
 */
export async function findTagsByRecommend(pageQuery: IPageQuery) {
    const { page, count } = pageQuery
    const offset = (page - 1) * count
    const result = await Tag.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: count,
        offset: offset
    })
    return result
}