// const createHttpError = require('http-errors');
import createHttpError from "http-errors"
import sequelize from "../db/seq"
import { Article, Tag, Media, ArticleTag, User, ArticleMedia, ArticleLike } from "../db/model"
import { createTag } from "./tag"
import { createMedia } from "./media"
import { IPageQuery } from "../middleware/validaters"
import { IArticle } from "../types/models/article"

/**
 * 创建文章
 * @param {*} param
 * @returns 
 */
export async function createArticle(value: IArticle & { tagIds?: number[], tagNames?: string[] }) {
    const { id, text, openid, userId, media = [], tagIds = [], tagNames = [] } = value
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
    // @ts-ignore
    await article.setTags(tagInstances)

    // 处理媒体
    const mediaInstances = []
    for (let item of media) {
      if (!item.id) {
        item = await createMedia(item)
      }
      mediaInstances.push(item)
    }
    // @ts-ignore
    await article.setMedia(mediaInstances)

    return article.dataValues
}

export async function updateArticle(value: IArticle & { tagIds: number[], tagNames: string[] }) {

}

export async function deleteArticle(id: number) {
    const article = await Article.findByPk(id)
    if (article) {
        return await article.destroy()
    } else {
        throw createHttpError(404)    
    }
}

export async function findArticlesByRecommend(pageQuery: IPageQuery) {
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

export async function findArticlesByTagId(tagId: number, pageQuery: IPageQuery) {
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

export async function findArticleById(id: number) {
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