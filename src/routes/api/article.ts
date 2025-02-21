import express from "express"
import createHttpError from "http-errors"
import validate from "../../middleware/validate"
import { body, param } from "express-validator"
import { pageQuery } from "../../middleware/validaters"
import { jwtAuth, jwtAuthOption } from "../../middleware/jwtAuth"
import { ArticleLike, ArticleCollect } from "../../db/model"
import { getTextLines } from "../../utils/getTextLines"
import { createArticle, findArticlesByRecommend, findArticlesByTagId, updateArticle, findArticleById, deleteArticle, findArticlesByUserLike, findArticlesByUserCollect, findArticles } from "../../services/article"
import { IPageQuery } from "../../middleware/validaters"

const router = express.Router()

/**
 * @openapi
 * /article:
 *  post:
 *      summary: 创建文章
 *      tags: [文章]
 *      response:
 *          200: 
 *              code: 状态码
 *              data: 创建的文章            
 */
router.post('/article', jwtAuth, validate([
    body('id').optional().isString().trim().withMessage('id must be a string'),
    body('text').isString().trim().withMessage('text must be a string'),
    body('images').optional().isArray(),
    // body('delta').optional(),
    body('tagNames').optional().isArray(),
    body('tagNames.*').optional().isString().withMessage('Each tagName must be a string'),
    body('tagIds').optional().isArray()
]), async (req, res, next) => {
    const { userId, openid } = req.auth
    const article = await createArticle({ ...req.body, openid, userId })
    res.json({
        code: 200,
        data: article
    })
})

/**
 * @openapi
 * /article/:id:
 *  post:
 *      summary: 更新文章
 *      tags: [文章]
 *      response:
 *          200: 
 *              code: 状态码
 *              data: 创建的文章            
 */
router.patch('/article/:id', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id must be an integer'),
    body('text').optional().isString().trim().withMessage('text must be a string'),
    body('tagNames').optional().isArray(),
    body('tagNames.*').optional().isString().withMessage('Each tagName must be a string')
]), async (req, res) => {
    const article = await updateArticle({ ...req.body, id: req.params.id })
    res.json({
        code: 200,
        data: article
    })
})

/**
 * @openapi
 * /article/:id:
 *  delete:
 *      summary: 删除文章
 *      tags: [文章]
 *      response:
 *          200: 
 *              code: 状态码
 *              data: 创建的文章            
 */
router.delete('/article/:id', jwtAuth, async (req, res) => {
    const result = await deleteArticle(parseInt(req.params.id))
    res.json({
        code: 200,
        data: result
    })
})

/**
 * @openapi
 * /articles/recommend:
 *  get:
 *      summary: 获取推荐文章
 *      tags: [文章]
 *      response:
 *          200: 
 *              code: 状态码
 *              data: 创建的文章            
 */
router.get('/articles/recommend', pageQuery, async (req, res, next) => {
    const query: IPageQuery = req.query as unknown as IPageQuery
    const result = await findArticlesByRecommend(query)

    const deviceWidth = parseInt(req.get('DeviceWidth') + '')
    const renderWidth = deviceWidth / 2
    const maxHeight = renderWidth * 1.6
    const minHeight = renderWidth

    const data = []
    for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows[i].dataValues
        const calcHeight = item.images?.length
            ? renderWidth * item.images?.[0].height / item.images?.[0].width
            : renderWidth * 1.2
        const renderHeight = calcHeight > maxHeight ? maxHeight : calcHeight < minHeight ? minHeight : calcHeight
        const lines = await getTextLines({
            text: item.text,
            textSize: 16,
            wrapHeight: renderHeight
        })
        data.push({
            ...item,
            lines: lines.slice(0, 2),
            moreLines: lines.length > 2
        })
    }

    res.json({
        code: 200,
        data: data,
        page: query.page,
        count: query.count,        
        total: result.count
    })
})

/**
 * @openapi
 * /article/tag/:id:
 *  get:
 *      summary: 获取指定标签的文章列表
 *      tags: [文章]
 *      response:
 *          200: 
 *              code: 状态码
 *              data: 创建的文章            
 */
router.get('/articles/by/tag/:id', pageQuery, async (req, res) => {
    const query: IPageQuery = req.query as unknown as IPageQuery
    const result = await findArticlesByTagId(parseInt(req.params.id), query)
    res.json({
        code: 200,
        page: query.page,
        count: query.count,
        data: result.rows,
        total: result.count
    })
})

/**
 * @openapi
 * /articles/like:
 *  get:
 *      summary: 获取点赞文章列表
 *      tags: [文章]
 */
router.get('/articles/like', jwtAuth, pageQuery, async (req, res) => {
    const query: IPageQuery = req.query as unknown as IPageQuery
    const userId = req.auth.userId
    const result = await findArticlesByUserLike(userId, query)

    const deviceWidth = parseInt(req.get('DeviceWidth') + '')
    const renderWidth = deviceWidth / 2
    const maxHeight = renderWidth * 1.6
    const minHeight = renderWidth

    const data = []
    for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows[i].dataValues
        const calcHeight = item.images?.length
            ? renderWidth * item.images?.[0].height / item.images?.[0].width
            : renderWidth * 1.2
        const renderHeight = calcHeight > maxHeight ? maxHeight : calcHeight < minHeight ? minHeight : calcHeight
        data.push({
            ...item,
            lines: (await getTextLines({
                text: item.text,
                textSize: 16,
                wrapHeight: renderHeight
            })).slice(0, 2)
        })
    }

    res.json({
        code: 200,
        data: data,
        page: query.page,
        count: query.count,        
        total: result.count
    })
})

/**
 * @openapi
 * /articles/collect:
 *  get:
 *      summary: 获取收藏文章列表
 *      tags: [文章]
 */
router.get('/articles/collect', jwtAuth, pageQuery, async (req, res) => {
    const query: IPageQuery = req.query as unknown as IPageQuery
    const userId = req.auth.userId
    const result = await findArticlesByUserCollect(userId, query)
    res.json({
        code: 200,
        page: query.page,
        count: query.count,
        data: result.rows,
        total: result.count
    })
})

/**
 * @openapi
 * /article/:id:
 *  get:
 *      summary: 获取文章详情
 *      tags: [文章]
 *      response:
 *          200: 
 *              code: 状态码
 *              data: 创建的文章            
 */
router.get('/article/:id', jwtAuthOption, validate([
    param('id').toInt().isInt().withMessage('id must be an integer')
]), async (req, res, next) => {
    const articleId = parseInt(req.params.id)
    let data = (await findArticleById(articleId))?.dataValues
    if (!data) {
        throw createHttpError(404)
    }
    // 点赞收藏状态
    if (req.auth) {
        const where = { articleId, userId: req.auth.userId }
        const articleLike = await ArticleLike.findOne({ where })
        const articleCollect = await ArticleCollect.findOne({ where })
        Object.assign(data, { isLike: !!articleLike, isCollect: !!articleCollect })
    }
    const deviceWidth = req.get('DeviceWidth')
    const textLines = deviceWidth ? await getTextLines({
        text: data.text,
        textSize: 16,
        wrapHeight: parseInt(deviceWidth + '')
    }) : []
    res.json({
        code: 200,
        data: {
            ...data,
            textLines
        }
    })
})

export default router