// const createHttpError = require('http-errors');
import createHttpError from "http-errors"
import sequelize from "../db/seq"
import { ArticleModel, TagModel, MediaModel, UserModel, ArticleLikeModel, ArticleCollectModel } from "../db/model"
import TagService from "./tag"
import MediaService from "./media"
import { IPageQuery } from "../middleware/validaters"
import { Op } from "sequelize"

namespace ArticleService {    
    /**
     * 创建文章
     * @param {*} param
     * @returns 
     */
    export async function createArticle(value: ArticleModel & { tagIds?: number[], tagNames?: string[] }) {
        const { id, text, openid, userId, images = [], tagIds = [], tagNames = [] } = value
        const article = await ArticleModel.create({
            title: text.substring(0, 100),
            text,
            openid,
            userId: id || userId,
            isRecommend: false,
            isApproved: true
        })

        // 处理话题(话题名)
        const tagInstances = []
        for (let tagName of tagNames) {
            let tag = await TagModel.findOne({
                where: {
                    name: tagName
                }
            })
            if (!tag) {
                tag = await TagService.createTag({ name: tagName })
            }
            tagInstances.push(tag)
        }
        // 处理话题(话题id)
        for (let tagId of tagIds) {
            let tag = await TagModel.findByPk(tagId)
            if (tag) {
                tagInstances.push(tag)
            }
        }
        // @ts-ignore
        await article.setTags(tagInstances)

        // 处理媒体
        const mediaInstances = []
        for (let item of images) {
            if (!item.id) {
                item = await MediaService.createMedia(item)
            }
            mediaInstances.push(item)
        }
        console.log(images, mediaInstances.length)
        // @ts-ignore
        await article.setMedia(mediaInstances)

        return article.dataValues
    }

    export async function updateArticle(value: ArticleModel & { tagIds: number[], tagNames: string[] }) {

    }

    export async function deleteArticle(id: number) {
        const article = await ArticleModel.findByPk(id)
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
        const result = await ArticleModel.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset,
            include: [TagModel, MediaModel, UserModel]
        })
        return result
    }

    export async function findArticles() {
        const result = await ArticleModel.findAndCountAll({

        })
        return result
    }

    export async function findArticlesByTagId(tagId: number, pageQuery: IPageQuery) {
        const { page, count } = pageQuery
        const offset = (page - 1) * count
        const result = await ArticleModel.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset,
            include: [{
                model: TagModel,
                as: 'tags',
                required: true
            }]
        })
        return result
    }

    /**
     * 获取用户点赞文章列表
     * @param userId 
     * @param pageQuery 
     * @returns 
     */
    export async function findArticlesByUserLike(userId: number, pageQuery: IPageQuery) {
        const { page, count } = pageQuery
        const offset = (page - 1) * count
        const result = await ArticleModel.findAndCountAll({
            include: [            
                {
                    model: ArticleLikeModel,
                    as: 'likes',
                    required: true
                },
                MediaModel,
                UserModel
            ],
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset
        })
        return result
    }

    /**
     * 获取用户收藏文章列表
     * @param userId 
     * @param pageQuery 
     * @returns 
     */
    export async function findArticlesByUserCollect(userId: number, pageQuery: IPageQuery) {
        const { page, count } = pageQuery
        const offset = (page - 1) * count
        const result = await ArticleModel.findAndCountAll({
            include: [
                {
                    model: ArticleCollectModel,
                    as: 'collects',
                    required: true
                },
                UserModel,
                MediaModel
            ],
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset
        })
        return result
    }

    /**
     * 通过文章内容模糊搜索文章
     * @async
     * @param {string} text - 内容
     * @param {IPageQuery} pageQuery - 
     * @returns any
     */
    export async function findArticlesByText(text: string, pageQuery: IPageQuery) {
        const { page, count } = pageQuery
        const offset = (page - 1) * count
        const result = await ArticleModel.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        text: {
                            [Op.like]: `%${text}%`
                        }
                    }, {
                        text: {
                            [Op.like]: `%${text.split('').join('%')}%`
                        }
                    }
                ]
            },
            include: [MediaModel, UserModel],
            order: [['createdAt', 'DESC']],
            limit: count,
            offset: offset
        })
        return result
    }

    /**
     * 通过 id 获取文章详情
     * @param id 文章 id
     * @returns 文章详情(包括点赞收藏评论数)
     */
    export async function findArticleById(id: number) {
        return await ArticleModel.findByPk(id, {
            attributes: [
                // 获取所有字段
                ...Object.keys(ArticleModel.getAttributes()),
                [sequelize.literal('(SELECT COUNT(*) FROM article_likes WHERE article_likes.articleId = articles.id)'), 'likeCount'],
                [sequelize.literal('(SELECT COUNT(*) FROM article_collects WHERE article_collects.articleId = articles.id)'), 'collectCount'],
                [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE comments.articleId = articles.id)'), 'commentCount']
            ],
            include: [MediaModel, UserModel]
        })
    }
}

export default ArticleService