import { Message } from "../db/model"
import { MessageCreationAttributes } from "../db/model/message"

/**
 * 创建消息
 */
export async function createMessage(value: MessageCreationAttributes) {
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
export async function createArticleLikeMessage(senderId: number, receiverId: number, relationId: number) {
    const msg = await Message.create({
        senderId,
        receiverId,
        relationId,
        messageType: 'article-like'
    })
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
