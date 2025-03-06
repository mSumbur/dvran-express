import { Op } from "sequelize"
import { TagModel } from "../db/model"
import { IPageQuery } from "../middleware/validaters"

namespace TagService {
    /**
     * 创建标签
     * @param {*} params 
     */
    export async function createTag(params: any) {
        return await TagModel.create(params)
    }

    /**
     * 更新标签
     * @param id 
     * @param value 
     * @returns 
     */
    export async function updateTag(id: number, value: any) {
        return await TagModel.update(value, { where: { id } })
    }

    /**
     * 获取推荐标签
     * @param {*} req 
     * @returns 
     */
    export async function findTagsByRecommend(pageQuery: IPageQuery) {
        const { page, count } = pageQuery
        const offset = (page - 1) * count
        const result = await TagModel.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset
        })
        return result
    }

    /**
     * 获取全部标签
     * @param pageQuery 
     * @returns 
     */
    export async function findTags(pageQuery: IPageQuery) {
        const { page, count } = pageQuery
        const offset = (page - 1) * count
        const result = await TagModel.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset
        })
        return result
    }

    /**
     * 搜索标签
     * @param text 
     * @param pageQuery 
     * @returns 
     */
    export async function findTagsByText(text: string, pageQuery: IPageQuery) {
        const { page, count } = pageQuery
        const offset = (page - 1) * count
        const result = await TagModel.findAndCountAll({
            where: {            
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${text}%`
                        }
                    }, {
                        name: {
                            [Op.like]: `%${text.split('').join('%')}%`
                        }
                    }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset
        })
        return result
    }

    export async function findTagById(id: number) {
        return await TagModel.findByPk(id)
    }

    export async function findTagByName(name: string) {
        return await TagModel.findOne({
            where: {
                name
            }
        })
    }
}

export default TagService