// const { validate } = require('../../middleware/validate')
// const { body, validationResult } = require('express-validator')

import { IPageQuery, pageQuery } from "../../middleware/validaters"
import { findTagsByRecommend } from "../../services/tag"

import express from "express"
const router = express.Router()

/**
 * 创建标签
 */
router.post('/tag', (req, res) => {
    res.send(req.body)
})

/**
 * 更新标签
 */
router.patch('/tag/:id', (req, res) => {

})

/**
 * 删除标签
 */
router.delete('/tag/:id', (req, res) => {

})

/**
 * 获取推荐标签列表
 */
router.get('/tag/recommend', pageQuery, async (req, res, next) => {
    const query = req.query as unknown as IPageQuery
    const result = await findTagsByRecommend(query)
    const defaultData = [
        { id: 'd1', name: '关注', api: '/article/recommend' },
        { id: 'd2', name: '推荐', api: '/article/recommend' },
    ]
    res.json({
        code: 200,
        page: query.page,
        count: query.count,
        total: result.count,
        data: defaultData.concat(result.rows.map((item: any) => ({
            ...item.dataValues,
            api: '/article/tag/' + item.dataValues.id
        })))
    })
})

/**
 * 获取标签详情
 */
router.get('/tag/:id', (req, res) => {

})

export default router
