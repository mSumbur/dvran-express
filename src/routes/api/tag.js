// const { validate } = require('../../middleware/validate')
// const { body, validationResult } = require('express-validator')

const { pageQuery } = require('../../middleware/validaters')
const { findTagsByRecommend } = require('../../services/tag')

const router = require('express').Router()

/**
 * 创建标签
 */
router.post('/', (req, res) => {
    res.send(req.body)
})

/**
 * 更新标签
 */
router.patch('/:id', (req, res) => {

})

/**
 * 删除标签
 */
router.delete('/:id', (req, res) => {

})

/**
 * 获取推荐标签列表
 */
router.get('/recommend', pageQuery, async (req, res, next) => {
    const { page, count } = req.query
    const result = await findTagsByRecommend(req.query)
    res.json({
        code: 200,
        page,
        count,
        total: result.count,
        data: result.rows.map(item => ({
            ...item.dataValues,
            api: '/article/tag/' + item.dataValues.id
        }))
    })
})

/**
 * 获取标签详情
 */
router.get('/:id', (req, res) => {

})

module.exports = router