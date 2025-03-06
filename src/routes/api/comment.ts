import express from "express"
import validate from "../../middleware/validate"
import { jwtAuth } from "../../middleware/jwtAuth"
import { body } from "express-validator"
import { IPageQuery, pageQuery } from "../../middleware/validaters"
import { getTextLines } from "../../utils/getTextLines"
import CommentService from "../../services/comment"
const router = express.Router()

/**
 * @openapi
 * /comment:
 *   post:
 *      summary: 创建评论
 *      tags: [评论]
 *      responses:
 *          200:
 *              code: 状态码
 *              data: 创建的评论
 */
router.post('/comment', jwtAuth, validate([
    body('content').isString(),
    body('articleId').isInt().withMessage('articleId must be an integer'),
    body('parentId').optional().isInt()
]), async (req, res, next) => {
    const { userId } = req.auth
    const comment = await CommentService.createComment({ ...req.body, userId })
    res.json({
        code: 200,
        data: comment
    })
})

/**
 * @openapi
 * /comments/:id:
 *  get:
 *      summary: 获取文章评论列表
 *      tags: [评论]
 */
router.get('/comments/:id', pageQuery, async (req, res) => {
    const pageQuery = req.query as unknown as IPageQuery
    const articleId = parseInt(req.params.id)
    const result = await CommentService.findComments({ ...pageQuery, articleId })

    const deviceHeight = req.get('DeviceHeight')
    const data = []
    for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows[i].dataValues
        data.push({
            ...item,
            textLines: await getTextLines({
                text: item.content,
                textSize: 16,
                wrapHeight: parseInt(deviceHeight + '') * 0.66 - 70
            })
        })
    }
    res.json({
        code: 200,
        data,
        total: result.count,
        page: pageQuery.page,
        count: pageQuery.count
    })
})

export default router
