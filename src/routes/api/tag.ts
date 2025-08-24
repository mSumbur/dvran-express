import express from "express"
import validate from "../../middleware/validate"
// import TagService from "../../services/tag"
import { IPageQuery, pageQuery } from "../../middleware/validaters"
import { body, matchedData, param, query } from "express-validator"
import { jwtAuth } from "../../middleware/jwtAuth"
import { findAndCountAll } from "../../utils/findAndCountAll"
import { TagModel } from "../../db/model"
import createHttpError from "http-errors"

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
    // const tag = await TagService.createTag(req.body)
    res.json({
        code: 200,
        // data: tag
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
    body('description').optional(),
    body('isRecommend').optional().isBoolean()
]), async (req, res) => {
    const id = parseInt(req.params.id)
    // const tag = await TagService.updateTag(id, req.body)
    res.json({
        code: 200,
        // data: tag
    })
})

/**
 * 删除标签
 */
router.delete('/tag/:id', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid ID')
]), (req, res) => {
    res.json({
        code: 200
    })
})

/**
 * @openapi
 * /tag/recommend:
 *  get:
 *      summary: 获取推荐标签列表
 *      tags: [标签]
 */
router.get('/tag/recommend', pageQuery, async (req, res, next) => {
    const query = req.query as unknown as IPageQuery
    // const result = await TagService.findTagsByRecommend(query)
    const result = {
        count: 0,
        rows: []
    }
    const defaultData = [
        { id: 'd1', name: 'ᠬᠠᠯᠠᠮᠰᠢᠯ ᠨᠡᠢᠳᠡᠯᠡᠯ ᡂᠠ', api: '/posts/recommend' },
        { id: 'd2', name: 'ᠨᠡᠢᠳᠡᠯᠡᠯ ᠊ᠤᠨ\nᠲᠠᠯᠠᠪᠠᠢ', api: '/posts/feeds' },
        { id: 'd3', name: 'ᠲᠠᠭᠠᠭᠰᠠᠨ ᠬᠦᠮᠦᠰ ᠡᠴᠡ', api: '/posts/follow' },        
    ]
    res.json({
        code: 200,
        page: query.page,
        count: query.count,
        total: result.count,
        data: defaultData.concat(result.rows.map((item: any) => ({
            ...item.dataValues,
            api: '/articles?tag=' + item.dataValues.id
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
    const mData = matchedData(req)
    const { page, count, total, data } = await findAndCountAll(TagModel, {}, mData)
    res.json({
        code: 200,
        page, count, 
        total, data
    })
})

/**
 * @openapi
 * /tag:
 *  get:
 *      summary: 获取标签详情
 *      tags: [标签]
 */
router.get('/tag', validate([
    query('name').isString().withMessage('name must be a string')
]), async (req, res) => {
    const mData = matchedData(req)
    console.log('name:::', mData.name)
    const tag = await TagModel.findOne({
        name: mData.name
    })
    if (!tag) {
        throw createHttpError(404)
    }
    res.json({
        code: 200,
        data: tag
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
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const tag = await TagModel.findById(mData.id)
    if (!tag) {
        throw createHttpError(404)
    }
    res.json({
        code: 200,
        data: tag
    })
})

export default router
