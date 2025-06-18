import express from "express";
import { jwtAuth } from "../../middleware/jwtAuth";
import { body, matchedData, param } from "express-validator";
import { IPageQuery, pageQuery } from "../../middleware/validaters";
import validate from "../../middleware/validate";
import MdayService from "../../services/mday";

const router = express.Router()

/**
 * @openapi
 * /mday/:id:
 *  get:
 *      summary: 获取日期详情
 *      tags: [扩展功能-日期]
 */
router.get('/mday/:id', jwtAuth, validate(
    param('id').toInt().isInt().withMessage('id must be an integer')
), async (req, res) => {
    const { id } = matchedData(req)
    const mday = await MdayService.findMdayById(id)
    res.json({
        code: mday ? 200 : 404,
        data: mday
    })
})

/**
 * @openapi
 * /mdays:
 *  get:
 *      summary: 获取当前用户全部日期
 *      tags: [扩展功能-日期]
 */
router.get('/mdays', jwtAuth, pageQuery, async (req, res) => {
    const { userId } = req.auth
    const query: IPageQuery = matchedData(req)    
    const result = await MdayService.findMdaysByUserId({ ...query, userId })
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
 * /mday:
 *  post:
 *      summary: 创建日期
 *      tags: [扩展功能-日期]
 */
router.post('/mday', jwtAuth, validate([
    body('text').isString().withMessage('text must be a string'),
    body('day').toDate(),
    body('fontSize').toInt().isInt().withMessage('fontSize must be an integer'),
    body('fontFamily').isString(),
    body('color').isString(),
    body('bgImg').isString(),
    body('bgColor').isString(),
    body('width').toInt().isInt()
]), async (req, res) => {
    const { userId, openid } = req.auth
    const data: MdayService.CreateMdayType = matchedData(req)
    const note = await MdayService.createMday({
        ...data, userId, openid
    })
    res.json({
        code: note ? 200 : 400,
        data: note
    })
})

/**
 * @openapi
 * /mday/:id:
 *  patch:
 *      summary: 修改日期
 *      tags: [扩展功能-日期]
 */
router.patch('/mday/:id', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id must be an integer'),
    body('text').isString().withMessage('text must be a string'),
    body('day').toDate(),
    body('fontSize').toInt().isInt().withMessage('fontSize must be an integer'),
    body('fontFamily').isString(),
    body('color').isString(),
    body('bgImg').isString(),
    body('bgColor').isString(),
    body('width').toInt().isInt()
]), async (req, res) => {
    const { userId } = req.auth
    const data: MdayService.UpdateMdayType = matchedData(req)
    const note = await MdayService.updateMday({ ...data, userId })
    res.json({
        code: note ? 200 : 400,
        data: note
    })
})

/**
 * @openapi
 * /mday/:id:
 *  delete:
 *      summary: 删除mday
 *      tags: [扩展功能-日期]
 */
router.delete('/mday/:id', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id must be an integer')
]), async (req, res) => {
    const { id } = matchedData(req)
    const result = await MdayService.removeMday(id)
    res.json({
        code: result ? 200 : 400,
        data: result
    })
})

export default router