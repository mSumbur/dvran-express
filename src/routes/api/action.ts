/**
 * @description: 用户行为接口，包含点赞收藏帖子、关注用户
 * @author: sumbur
 * @time 2025-01-01 12:13
 */
import express from "express"
import validate from "../../middleware/validate"
import createHttpError from "http-errors"
import MessageService from "../../services/message"
import FollowService from "../../services/follow"
import ActionService from "../../services/action"
import ArticleService from "../../services/article"
import { matchedData, param } from "express-validator"
import { pageQuery } from "../../middleware/validaters"
import { jwtAuth } from "../../middleware/jwtAuth"

const router = express.Router()

/**
 * @openapi
 * /article/:id/:type:
 *  post:
 *      summary: 点赞收藏文章
 *      tags: [用户行为]
 */
router.post('/article/:articleId/:type', jwtAuth, validate([
    param('articleId').toInt().isInt().withMessage('id is not valid'),
    param('type').isString().withMessage('type is not valid')
]), async (req, res) => {
    const { userId } = req.auth
    const { articleId, type } = matchedData(req)
    const article = await ArticleService.findArticleById(articleId)
    if (!article) {
        throw createHttpError(400)
    }
    const result = await ActionService.createArticleAction(articleId, userId, type as ActionService.ActionType)
    const msgRecord = await MessageService.findMessage({ senderId: userId, relationId: articleId, type: type == 'like' ? 1 : 2 })
    // 发送过消息就不再发
    if (!msgRecord) {
        await MessageService.createArticleLikeMessage({
            senderId: userId,
            relationId: articleId,
            receiverId: article.userId
        })
    }
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
 *      tags: [用户行为]
 */
router.delete('/article/:articleId/:type', jwtAuth, validate([
    param('articleId').toInt().isInt().withMessage('id is not valid'),
    param('type').isString().withMessage('type is not valid')
]), async (req, res, next) => {
    const { userId } = req.auth
    const { articleId, type } = matchedData(req)
    const result = await ActionService.deleteArticleAction(parseInt(articleId), userId, type as ActionService.ActionType)
    const msgRecord = await MessageService.findMessage({ senderId: userId, relationId: articleId, type: type == 'like' ? 1 : 2 })
    if (msgRecord) {
        await msgRecord.destroy()
    }
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

export default router