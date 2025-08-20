import { ArticleModel, MediaModel, MessageModel, UserModel } from "../db/model"
import { IPageQuery } from "../middleware/validaters"

namespace MessageService {
    /**
     * 创建消息
     * @param {MessageModel} value 消息体
     * @returns 消息
     */
    export async function createMessage(value: MessageModel) {
        const msg = await MessageModel.create({ ...value, status: 0 })
        return msg
    }

    /**
     * 创建文章点赞收藏消息
     * @param senderId 发送人id
     * @param receiverId 接收值id
     * @param relationId 关联关系id(比如文章id)
     * @param type 1点赞 2收藏
     * @returns 消息
     */
    export async function createArticleMessage(data: {
        senderId: number
        receiverId: number
        relationId: number
        type: number
    }) {
        const msg = await MessageModel.create(data)
        return msg
    }

    /**
     * 创建收藏消息
     * @param senderId 发送人id
     * @param receiverId 接收值id
     * @param relationId 关联关系id(比如文章id)
     * @returns 消息
     */
    // export async function createArticleCollectMessage(data: {
    //     senderId: number
    //     receiverId: number
    //     relationId: number
    // }) {
    //     const msg = await MessageModel.create({ ...data, type: 2 })
    //     return msg
    // }

    /**
     * 获取消息记录(通过用户id和关系id)
     * @param userId 用户id
     * @param relationId 关系id
     * @returns 消息
     */
    export async function findMessage(options: { senderId: number, relationId: number, type: number }) {
        const { senderId, relationId, type } = options
        const msg = await MessageModel.findOne({
            where: { senderId, relationId, type },
            paranoid: true
        })
        return msg
    }

    /**
     * 获取所有消息（通过用户id）
     * @param userId 用户id
     * @param pageQuery 分页
     * @returns 消息列表
     */
    export async function findMessagesByUserId(options: { userId: number } & IPageQuery) {
        const { userId, page, count } = options
        const offset = (page - 1) * count
        const result = await MessageModel.findAndCountAll({
            where: { receiverId: userId },
            // include: [{
            //     model: UserModel,
            //     as: 'sender',
            //     required: false,
            //     attributes: ['id', 'nickname', 'avatar']
            // }],
            limit: count,
            offset: offset
        })

        const relationIds = result.rows.map((msg) => msg.relationId)

        // 批量查询所有关联数据
        // const relatedData = await ArticleModel.findAll({
        //     where: { id: relationIds },
        //     include: { model: MediaModel, attributes: ['url'] },
        //     attributes: ['id', 'text']
        // })

        // 将关联数据映射到消息中
        // const relatedDataMap = relatedData.reduce((acc: any, item) => {
        //     acc[item.id] = item.toJSON()
        //     return acc
        // }, {})

        // const messagesWithRelation = result.rows.map((msg) => ({
        //     ...msg.toJSON(),
        //     relatedData: relatedDataMap[msg.relationId || ''] || null
        // }))

        return {
            // rows: messagesWithRelation,
            count: result.count
        }
    }
}

export default MessageService