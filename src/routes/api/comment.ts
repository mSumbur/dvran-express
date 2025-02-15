import express from "express"
import { jwtAuth } from "../../middleware/jwtAuth"
import { createComment } from "../../services/comment"
import validate from "../../middleware/validate"
import { body } from "express-validator"
const router = express.Router()

/**
 * 创建评论
 */
router.post('/', jwtAuth, validate([
    body('content').isString(),
    body('articleId').isInt().withMessage('articleId must be an integer'),
    body('parentId').optional().isInt()
]), async (req, res, next) => {
    const { userId } = req.auth
    const comment = await createComment({ ...req.body, userId })
    res.json({
        code: 200,
        data: comment
    })
})

/**
 * 获取文章评论列表
 */
router.get('/article/:id', (req, res) => {
    res.json({
        code: 200,
        data: [],
        total: 1,
        page: 1,
        count: 1
    })
})

export default router
