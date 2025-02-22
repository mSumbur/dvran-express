// const { validate } = require('../../middleware/validate')
// const { body, validationResult } = require('express-validator')

import { IPageQuery, pageQuery } from "../../middleware/validaters"
import { createTag, findTagById, findTags, findTagsByRecommend, updateTag } from "../../services/tag"

import express from "express"
import validate from "../../middleware/validate"
import { body, param } from "express-validator"
import { jwtAuth } from "../../middleware/jwtAuth"
const router = express.Router()

/**
 * @openapi
 * /tag:
 *  post:
 *      summary: 创建标签
 *      tags: [标签]
 */
router.post('/tag', validate([
    body('name').isString().withMessage('name must be a string'),
    body('image').isString().withMessage('image must be a string'),
    body('isRecommend').optional().isBoolean()
]), async (req, res) => {
    const tag = await createTag(req.body)
    res.json({
        code: 200,
        data: tag
    })
})

/**
 * @openapi
 * /tag/:id:
 *  patch:
 *      summary: 更新标签
 *      tags: [标签]
 */
router.patch('/tag/:id', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id must be an intger'),
    body('name').isString().withMessage('name must be a string'),
    body('image').isString().withMessage('image must be a string'),
    body('isRecommend').optional().isBoolean()
]), async (req, res) => {
    console.log('redd', req.body)
    const id = parseInt(req.params.id)
    const tag = await updateTag(id, req.body)
    res.json({
        code: 200,
        data: tag
    })
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
        { id: 'd1', name: 'ᠲᠠᠭᠠᠭᠰᠠᠨ ᠨᠡᠢᠳᠡᠯᠡᠯ', api: '/articles/recommend' },
        { id: 'd2', name: 'ᠲᠡᠪᠰᠢᠭᠦᠯᠬᠦ ᠨᠡᠢᠳᠡᠯᠡᠯ', api: '/articles/recommend' },
    ]
    res.json({
        code: 200,
        page: query.page,
        count: query.count,
        total: result.count,
        data: defaultData.concat(result.rows.map((item: any) => ({
            ...item.dataValues,
            api: '/articles/by/tag/' + item.dataValues.id
        })))
    })
})

/**
 * @openapi
 * /tags:
 *  get:
 *      summary: 获取全部标签
 *      tags: [标签]
 */
router.get('/tags', pageQuery, async (req, res) => {
    const query = req.query as unknown as IPageQuery
    const result = await findTags(query)
    res.json({
        code: 200,
        data: result.rows,
        total: result.count,
        page: query.page,
        count: query.count        
    })
})

/**
 * @openapi
 * /tag/:id:
 *  get:
 *      summary: 获取标签详情
 *      tags: [标签]
 */
router.get('/tag/:id', validate([
    param('id').toInt().isInt().withMessage('id must be an integer')
]), async (req, res) => {
    const tag = await findTagById(parseInt(req.params.id))
    res.json({
        code: 200,
        data: tag
    })
})

export default router
