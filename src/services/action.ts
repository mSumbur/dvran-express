import { ArticleCollect, ArticleLike } from "../db/model"

type ActionType = 'like' | 'collect'

/**
 * 点赞收藏文章
 * @param {*} articleId 
 * @param {*} type 
 */
export async function createArticleAction(articleId: number, userId: number, type: ActionType) {
    const Model = type == 'like' ? ArticleLike : ArticleCollect
    const action = await Model.create({ userId, articleId })
    return action
}

/**
 * 取消点赞收藏
 * @param {*} articleId 
 * @param {*} userId 
 * @param {*} type 
 * @returns 
 */
export async function deleteArticleAction(articleId: number, userId: number, type: ActionType) {
    const Model = type == 'like' ? ArticleLike : ArticleCollect
    const action = await Model.findOne({
        where: { userId, articleId }
    })
    return await action?.destroy()
}
