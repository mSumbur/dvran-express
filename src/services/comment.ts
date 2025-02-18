import { User } from "../db/model"
import Comment, { CommentCreationAttributes } from "../db/model/comment"
import { IPageQuery } from "../middleware/validaters"

/**
 * 创建评论
 * @param value CommentCreationAttributes
 * @returns 
 */
export async function createComment(value: CommentCreationAttributes) {
    const comment = await Comment.create(value)
    return comment
}

/**
 * 获取评论列表
 * @param options 
 * @returns 
 */
export async function findComments(options: IPageQuery & { articleId: number }) {
    const result = await Comment.findAndCountAll({
        where: {
            articleId: options.articleId,
            parentId: null
        },
        offset: (options.page - 1) * options.count,
        limit: options.count,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'user' }]
    })
    return result
}