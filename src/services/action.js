const ArticleCollect = require("../db/model/articleCollect");
const ArticleLike = require("../db/model/articleLike");

/**
 * 点赞收藏文章
 * @param {*} articleId 
 * @param {*} type 
 */
async function createArticleAction(articleId, userId, type) {
    const Model = type == 'like' ? ArticleLike : ArticleCollect
    const action = await Model.create({ userId, articleId })
    return action.dataValues
}

/**
 * 取消点赞收藏
 * @param {*} articleId 
 * @param {*} userId 
 * @param {*} type 
 * @returns 
 */
async function deleteArticleAction(articleId, userId, type) {
    const Model = type == 'like' ? ArticleLike : ArticleCollect
    const action = await Model.findOne({
        where: { userId, articleId }
    })
    return await action.destroy()
}

module.exports = {
    createArticleAction,
    deleteArticleAction        
}