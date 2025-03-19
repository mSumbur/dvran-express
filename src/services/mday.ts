import { MdayModel } from "../db/model"
import { IPageQuery } from "../middleware/validaters"

namespace MdayService {

    export type CreateMdayType = {
        text: string
        day: any
        userId: number
        openid: string
        fontSize: number
        fontFamily: string
        color: string
        bgImg: string
        bgColor: string        
        width: number
    }

    export type UpdateMdayType = CreateMdayType & { id: number }

    /**
     * 创建mday
     * @param value 
     * @returns 
     */
    export async function createMday(value: CreateMdayType) {        
        const mday = await MdayModel.create(value)
        return mday
    }

    /**
     * 更新
     * @param value 
     * @returns 
     */
    export async function updateMday(value: UpdateMdayType) {
        const id = value.id
        delete (value as any).id   
        const mday = await MdayModel.update(value, {
            where: {
                id
            }
        })
        return mday
    }

    /**
     * 查询用户的时间记录
     * @param option 查询选项，包含页码、页数和目标用户id
     * @returns 列表
     */
    export async function findMdaysByUserId(option: IPageQuery & { userId: number }) {
        const { page, count, userId } = option
        const offset = (page - 1) * count
        const result = await MdayModel.findAndCountAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset
        })
        return result
    }

    /**
     * 查询mday
     * @param id 
     * @returns 
     */
    export async function findMdayById(id: number) {
        const result = await MdayModel.findByPk(id)
        return result
    }

    /**
     * 删除mday
     * @param id 
     * @returns 
     */
    export async function removeMday(id: number) {
        const result = await MdayModel.findByPk(id)
        return result?.destroy()
    }
}

export default MdayService