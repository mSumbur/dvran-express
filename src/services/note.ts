import NoteModel from "../db/model/note";
import { IPageQuery } from "../middleware/validaters";

namespace NoteService {

    // 创建
    type CreateNodeType = {
        text: string
        userId: number
        openid: string
    }

    // 更新
    type UpdateNodeType = Omit<CreateNodeType, 'openid'> & { 
        id: number 
    }

    /**
     * 创建笔记
     * @param value 笔记内容
     * @returns 笔记
     */
    export async function createNote(value: CreateNodeType) {
        const { text, userId, openid } = value
        const note = await NoteModel.create({
            text, userId, openid
        })
        return note
    }

    /**
     * 更新笔记
     * @param value 
     * @returns 
     */
    export async function updateNote(value: UpdateNodeType) {
        const { id, text } = value
        const note = await NoteModel.update(
            { text },
            {
                where: { id }
            }
        )
        return note
    }

    /**
     * 查询用户笔记
     * @param option 查询选项，包含页码、页数和目标用户id
     * @returns 笔记列表
     */
    export async function findNotesByUserId(option: IPageQuery & { userId: number }) {
        const { page, count, userId } = option
        const offset = (page - 1) * count
        const result = await NoteModel.findAndCountAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset
        })
        return result
    }

    /**
     * 查询笔记
     * @param id 
     * @returns 
     */
    export async function findNoteById(id: number) {
        const result = await NoteModel.findByPk(id)
        return result
    }

    /**
     * 删除笔记
     * @param id 
     * @returns 
     */
    export async function removeNote(id: number) {
        const result = await NoteModel.findByPk(id)
        return result?.destroy()
    }

}

export default NoteService