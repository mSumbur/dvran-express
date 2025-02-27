import { col, literal } from "sequelize"
import { Article, Media, Message, User } from "../db/model"
import { IPageQuery } from "../middleware/validaters"
// import { MessageCreationAttributes } from "../db/model/message"

/**
 * 创建消息
 */
export async function createMessage(value: Message) {
    const msg = await Message.create({ ...value, status: 0 })
    return msg
}

/**
 * 创建点赞文章消息
 * @param senderId
 * @param receiverId
 * @param relationId 
 * @returns 
 */
export async function createArticleLikeMessage(data: {
    senderId: number
    receiverId: number
    relationId: number
}) {
    const msg = await Message.create({ ...data, type: 1 })
    return msg
}

/**
 * 创建收藏消息
 * @param senderId 
 * @param receiverId 
 * @param relationId 
 * @returns 
 */
export async function createArticleCollectMessage(senderId: number, receiverId: number, relationId: number) {
    const msg = await Message.create({
        senderId,
        receiverId,
        relationId,
        messageType: 'article-collect'
    })
    return msg
}

/**
 * 获取消息记录
 * @param userId 
 * @param relationId 
 * @returns 
 */
export async function findMessage(userId: number, relationId: number) {
    const msg = await Message.findOne({
        where: { 
            senderId: userId, 
            relationId 
        },
        paranoid: true
    })
    return msg
}

/**
 * 获取所有消息
 * @param userId 
 * @param pageQuery 
 * @returns 
 */
export async function findMessagesByUserId(userId: number, pageQuery: IPageQuery) {
    const { page, count } = pageQuery
    const offset = (page - 1) * count
    const result = await Message.findAndCountAll({
        where: { receiverId: userId },
        include: [{
            model: User,
            as: 'sender',
            required: false,
            attributes: ['id', 'nickname', 'avatar']            
        }],
        limit: count,
        offset: offset
    })
    
    const relationIds = result.rows.map((msg) => msg.relationId)

    // 批量查询所有关联数据
    const relatedData = await Article.findAll({
        where: { id: relationIds },
        include: { model: Media, as: 'images', attributes: ['url'] }
    })

    // 将关联数据映射到消息中
    const relatedDataMap = relatedData.reduce((acc: any, item) => {
        acc[item.id] = item.toJSON()
        return acc
    }, {})

    const messagesWithRelation = result.rows.map((msg) => ({
        ...msg.toJSON(),
        relatedData: relatedDataMap[msg.relationId] || null
    }))

    return {
        rows: messagesWithRelation,
        count: result.count
    }
}