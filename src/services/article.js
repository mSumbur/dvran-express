const createHttpError = require('http-errors');
const { Article, Tag, Media, ArticleTag, User, ArticleMedia, ArticleLike } = require('../db/model');
const { createTag } = require('./tag');
const { createMedia } = require('./media');
const { sequelize } = require('../db/seq');

/**
 * 创建文章
 * @param {*} param0 
 * @returns 
 */
async function createArticle({
    id,
    text, 
    openid, 
    userId,    
    media = [],
    tagIds = [], 
    tagNames = []
}) {
    const article = await Article.create({
        title: text.substring(0, 100),
        text,
        openid,
        userId: id || userId
    })

    // 处理话题(话题名)
    const tagInstances = []
    for (let tagName of tagNames) {
        let tag = await Tag.findOne({
            where: {
                name: tagName
            }
        })
        if (!tag) {
            tag = await createTag({ name: tagName })
        }
        tagInstances.push(tag)
    }
    // 处理话题(话题id)
    for (let tagId of tagIds) {
        let tag = await Tag.findByPk(tagId)
        if (tag) {
            tagInstances.push(tag)
        }
    }
    await article.setTags(tagInstances)

    // 处理媒体
    const mediaInstances = []
    for (let item of media) {
      if (!item.id) {
        item = await createMedia(item)
      }
      mediaInstances.push(item)
    }
    await article.setMedia(mediaInstances)

    return article.dataValues
}

async function updateArticle({
    text, id, medias = [], tagIds = [], tagNames = []
}) {

}

async function deleteArticle(id) {
    const article = await Article.findByPk(id)
    if (article) {
        return await article.destroy()
    } else {
        throw createHttpError(404)    
    }
}

async function findArticlesByRecommend(pageQuery) {
    const { page, count } = pageQuery
    const offset = (page - 1) * count
    // 分页查询，并加载关联的 Tag
    const result = await Article.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: count,
        offset: offset,
        include: [Tag, Media, User]
    })
    return result
}

async function findArticlesByTagId(tagId, pageQuery) {
    const { page, count } = pageQuery
    const offset = (page - 1) * count
    const result = await Article.findAndCountAll({        
        order: [['createdAt', 'DESC']],
        limit: count,
        offset: offset,
        include: [Media, Tag, User] 
    })
    return result
}

async function findArticleById(id) {
    return await Article.findByPk(id, {                
        attributes: [      
            // 获取所有字段
            ...Object.keys(Article.getAttributes()),
            [sequelize.literal('(SELECT COUNT(*) FROM article_likes WHERE article_likes.articleId = article.id)'), 'likeCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM article_collects WHERE article_collects.articleId = article.id)'), 'collectCount']
        ],        
        include: [Media, Tag, User]
    })    
}

module.exports = {
    createArticle,
    updateArticle,
    deleteArticle,
    findArticlesByRecommend,
    findArticlesByTagId,
    findArticleById
}