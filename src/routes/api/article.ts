import express from "express"
import createHttpError from "http-errors"
import validate from "../../middleware/validate"
import { body, param } from "express-validator"
import { pageQuery } from "../../middleware/validaters"
import { jwtAuth, jwtAuthOption } from "../../middleware/jwtAuth"
import { Article, ArticleLike, ArticleCollect } from "../../db/model"
import { getTextLines } from "../../utils/getTextLines"
import { createArticle, findArticlesByRecommend, findArticlesByTagId, updateArticle, findArticleById, deleteArticle } from "../../services/article"
import { IPageQuery } from "../../middleware/validaters"

const router = express.Router()

/**
 * 创建文章
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
 * 更新文章
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
 * 删除文章
 */
router.delete('/article/:id', jwtAuth, async (req, res) => {
    const result = await deleteArticle(parseInt(req.params.id))
    res.json({
        code: 200,
        data: result
    })
})

/**
 * 获取推荐列表
 */
router.get('/article/recommend', pageQuery, async (req, res, next) => {
    const query: IPageQuery = req.query as unknown as IPageQuery
    const result = await findArticlesByRecommend(query)
    res.json({
        code: 200,
        page: query.page, 
        count: query.count,
        data: result.rows,
        total: result.count
    })
})

/**
 * 获取指定标签的文章列表
 */
router.get('/article/tag/:id', pageQuery, async (req, res) => {
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
 * 获取文章详情
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