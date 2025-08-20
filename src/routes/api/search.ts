import express from "express"
import validate from "../../middleware/validate"
import calcPostTextLine from "../../utils/calcPostTextLine"
import { matchedData, query } from "express-validator"
import { pageQuery } from "../../middleware/validaters"
import { PostModel, UserModel } from "../../db/model"
import { findAndCountAll } from "../../utils/findAndCountAll"

const router = express.Router()

/**
 * @openapi
 * /search:
 *  get:
 *      summary: 搜索接口
 *      tags: [搜索]
 */
router.get('/search', pageQuery, validate([
    query('q').isString().withMessage('q must be a string'),
    query('t').isString().withMessage('t must be a string')
]), async (req, res) => {
    const mData = matchedData(req)
    const query = req.query
    const q = query.q as string
    const t = query.t
    let result: any = null
    let data = []
    if (t == 'article') {
        // 普通模糊匹配;每个字符之间插入 .*，实现宽松匹配
        const query = {
            $or: [
                { text: { $regex: new RegExp(q, 'i') } },
                { text: { $regex: new RegExp(q.split('').join('.*'), 'i') } }
            ]
        }
        result = await findAndCountAll(PostModel, query, { 
            ...mData, 
            populate: [
                { path: 'media' },
                { path: 'user' }
            ] 
        })
        data = await calcPostTextLine(req, result.data)
    } else if (t == 'tag') {
        // result = await TagService.findTagsByText(q, query as any)
        data = result.rows
    } else if (t == 'user') {
        const query = {
            $or: [
                { nickname: { $regex: q, $options: 'i' } },
                { nickname: { $regex: q.split('').join('.*'), $options: 'i' } }
            ]
        }
        result = await findAndCountAll(UserModel, query, { ...mData })
        data = result.data
    }
    res.json({
        data: data,
        total: result?.total,
        page: query.page,
        count: query.count
    })
})

export default router