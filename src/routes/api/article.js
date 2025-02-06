const validate = require('../../middleware/validate')
const weappAuthCheck = require('../../middleware/weappAuthCheck')
const handleRes = require('../../middleware/handleRes')
const { body } = require('express-validator')
const { createArticle, findArticlesByRecommend, findArticlesByTagId, updateArticle } = require('../../services/article')
const { pageQuery } = require('../../middleware/validaters')

const router = require('express').Router()

/**
 * 创建文章
 */
router.post('/', weappAuthCheck, validate([
    body('text').isString().trim().withMessage('text must be a string'),
    body('id').optional().isString().trim().withMessage('id must be a string'),
    body('tagNames').optional().isArray(),
    body('tagNames.*').optional().isString().withMessage('Each tagName must be a string')
]), async (req, res, next) => {
    const { openid } = req.user
    const article = await createArticle({ ...req.body, openid })
    res.json({
        code: 200,
        data: article
    })
})

/**
 * 更新文章
 */
router.patch('/:id', validate([
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
router.delete('/:id', (req, res) => {

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
router.get('/tag/:id', pageQuery, handleRes(async (req, res, next) => {
    const { page, count } = req.query
    const result = await findArticlesByTagId(parseInt(req.params.id), req.query)
    res.json({
        code: 200,
        page,
        count,
        data: result.rows,
        total: result.count
    })
}))

/**
 * 获取文章详情
 */
router.get('/:id', (req, res) => {

})

module.exports = router