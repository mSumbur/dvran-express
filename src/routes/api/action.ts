/**
 * @description: 用户行为接口，包含点赞收藏帖子、关注用户
 * @author: sumbur
 * @time 2025-01-01 12:13
 */
import express from "express"
import validate from "../../middleware/validate"
import { body, param, query } from "express-validator"
import { ActionType, createArticleAction, deleteArticleAction } from "../../services/action"
import { pageQuery } from "../../middleware/validaters"
import { jwtAuth } from "../../middleware/jwtAuth"

const router = express.Router()

/**
 * @openapi
 * /article/:id/:type:
 *  post:
 *      summary: 点赞收藏文章
 *      tags: [文章]
 */
router.post('/article/:id/:type', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id is not valid'),
    param('type').isString().withMessage('type is not valid')  
]), async (req, res) => {
    const userId = req.auth.userId
    const { id: articleId, type } = req.params
    const result = await createArticleAction(parseInt(articleId), userId, type as ActionType)
    res.json({
        code: 200,
        data: result
    })
})

/**
 * @openapi
 * /article/:id/:type:
 *  delete:
 *      summary: 取消点赞收藏文章
 *      tags: [文章]
 */
router.delete('/article/:id/:type', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id is not valid'),
    param('type').isString().withMessage('type is not valid')   
]), async (req, res, next) => {
    const { userId } = req.auth
    const { id: articleId, type } = req.params
    const result = await deleteArticleAction(parseInt(articleId), userId, type as ActionType)
    res.json({
        code: 200,
        data: result
    })
})

/**
 * @openapi
 * /article/:id/:type:
 *  get:
 *      summary: 获取点赞收藏列表
 *      tags: [文章]
 */
router.get('/article/:id/:type', jwtAuth, pageQuery, validate([
    param('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {

})

/**
 * @openapi
 * /user/:id/follow:
 *  post:
 *      summary: 关注用户
 *      tags: [用户]
 */
router.post('/user/:id/follow', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {

})

/**
 * @openapi
 * /user/:id/follow:
 *  delete:
 *      summary: 取消关注
 *      tags: [用户]
 */
router.delete('/user/:id/follow', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {

})

export default router