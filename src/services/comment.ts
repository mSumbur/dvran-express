import { UserModel } from "../db/model"
import { IPageQuery } from "../middleware/validaters"
import CommentModel from "../db/model/comment"

namespace CommentService {
    /**
     * 创建评论
     * @param value
     * @returns CommentModel
     */
    export async function createComment(value: Partial<CommentModel> & { [K in keyof CommentModel]: CommentModel[K] }): Promise<CommentModel> {
        const comment = await CommentModel.create(value)
        return comment
    }

    /**
     * 获取评论列表
     * @param options 
     * @returns
     */
    export async function findComments(options: IPageQuery & { articleId: number }) {
        const result = await CommentModel.findAndCountAll({
            where: {
                articleId: options.articleId,
                parentId: null
            },
            offset: (options.page - 1) * options.count,
            limit: options.count,
            order: [['createdAt', 'DESC']],
            include: [{ model: UserModel, as: 'user' }]
        })
        return result
    }
}

export default CommentService