const router = require('express').Router()
const validate = require('../../middleware/validate')
const getTextLines = require('../../utils/getTextLines')
const { body } = require('express-validator')
const { jwtAuth, jwtAuthOption } = require('../../middleware/jwtAuth')
const { pageQuery } = require('../../middleware/validaters')
const { createArticle, findArticlesByRecommend, findArticlesByTagId, updateArticle, findArticleById, deleteArticle } = require('../../services/article')
const { Article, ArticleLike, ArticleCollect } = require('../../db/model')
const createHttpError = require('http-errors')

/**
 * 创建文章
 */
router.post('/', jwtAuth, validate([
    body('id').optional().isString().trim().withMessage('id must be a string'),
    body('text').isString().trim().withMessage('text must be a string'),    
    body('media').optional().isArray(),
    body('delta'),
    body('tagNames').optional().isArray(),
    body('tagNames.*').optional().isString().withMessage('Each tagName must be a string'),
    body('tagIds').optional()
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
router.patch('/:id', jwtAuth, validate([
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
router.delete('/:id', jwtAuth, async (req, res) => {
    const result = await deleteArticle(req.params.id)
    res.json({
        code: 200,
        data: result
    })
})

/**
 * 获取推荐列表
 */
router.get('/recommend', pageQuery, async (req, res, next) => {
    const { page, count } = req.query
    const result = await findArticlesByRecommend(req.query)
    res.json({
        code: 200,
        page,
        count,
        data: result.rows,
        total: result.count
    })
})

/**
 * 获取指定标签的文章列表
 */
router.get('/tag/:id', pageQuery, async (req, res, next) => {
    const { page, count } = req.query
    const result = await findArticlesByTagId(parseInt(req.params.id), req.query)
    res.json({
        code: 200,
        page,
        count,
        data: result.rows,
        total: result.count
    })
})

/**
 * 获取文章详情
 */
router.get('/:id', jwtAuthOption, async (req, res) => {    
    const articleId = req.params.id
    let data = (await findArticleById(articleId)).dataValues
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
    const aaa = await ArticleLike.count({ where: { articleId } })
    const deviceWidth = req.get('DeviceWidth')
    const textLines = deviceWidth ? await getTextLines({
        text: data.text,
        textSize: 16,
        wrapHeight: deviceWidth
    }) : []
    res.json({
        code: 200,
        data: {
            ...data,
            textLines
        }
    })
})

module.exports = router