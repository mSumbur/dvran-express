/**
 * @description: 用户行为接口，包含点赞收藏帖子、关注用户
 * @author: sumbur
 * @time 2025-01-01 12:13
 */
import express from "express"
import validate from "../../middleware/validate"
import { body, query } from "express-validator"
import { createArticleAction, deleteArticleAction } from "../../services/action"
import { pageQuery } from "../../middleware/validaters"
import { jwtAuth } from "../../middleware/jwtAuth"

const router = express.Router()

/**
 * 点赞收藏文章
 */
router.post('/article', jwtAuth, validate([
    body('type').isString().withMessage('type is not valid'),
    body('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res) => {
    const userId = req.auth.userId
    const { id: articleId, type } = req.body
    const result = await createArticleAction(parseInt(articleId), userId, type)
    res.json({
        code: 200,
        data: result
    })
})

/**
 * 取消点赞收藏帖子
 */
router.delete('/article', jwtAuth, validate([
    body('type').isString().withMessage('type is not valid'),
    body('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {
    const { userId } = req.auth
    const { id: articleId, type } = req.body
    const result = await deleteArticleAction(parseInt(articleId), userId, type)
    res.json({
        code: 200,
        data: result
    })
})

/**
 * 点赞收藏列表
 */
router.get('/article/:type', jwtAuth, pageQuery, validate([
    query('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {

})

/**
 * 关注用户
 */
router.post('/user', jwtAuth, validate([
    body('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {

})

/**
 * 取消关注
 */
router.delete('/user', jwtAuth, validate([
    body('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {

})

export default router