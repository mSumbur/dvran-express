import express from "express"
import validate from "../../middleware/validate"
import createHttpError from "http-errors"
import { jwtAuth } from "../../middleware/jwtAuth"
import { body, matchedData, param } from "express-validator"
import { IPageQuery, pageQuery } from "../../middleware/validaters"
import { getTextLines } from "../../utils/getTextLines"
import { MessageModel, PostCommentModel, PostModel } from "../../db/model"
import { findAndCountAll } from "../../utils/findAndCountAll"
import { IMessageType } from "../../db/model/message.model"

const router = express.Router()

/**
 * @openapi
 * /comment:
 *   post:
 *      summary: 创建评论
 *      tags: [评论]
 */
router.post('/comment', jwtAuth, validate([
    body('content').isString().withMessage('Content is must be a string'),
    body('postId').isMongoId().withMessage('Invalid ArticleId'),
    body('parentId').optional().isMongoId().withMessage('Invalid parentId')
]), async (req, res, next) => {
    const mData = matchedData(req)
    const post = await PostModel.findById(mData.postId)
    if (!post || post.isDeleted) {
        throw createHttpError(403)
    }
    const comment = await PostCommentModel.create({
        userId: req.auth.userId,        
        postId: mData.postId,
        parentId: mData.parentId,
        content: mData.content
    })
    await MessageModel.create({
        senderId: req.auth.userId,
        receiverId: post.userId,
        relationId: mData.postId,
        content: mData.content,
        type: IMessageType.comment
    })
    res.json({
        code: 200,
        data: comment
    })
})

/**
 * @openapi
 * /comment/{id}
 *  delete:
 *      summary: 删除评论
 *      tags: [评论]
 */
router.delete('/comment/:id', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const comment = await PostCommentModel.findById(mData.id)
    if (!comment || comment.userId.toString() != req.auth.userId.toString()) {
        createHttpError
        throw createHttpError(403)
    }
    comment.isDeleted = true
    comment.deletedAt = new Date()
    await comment.save()
    res.json({
        code: 200,
        data: comment 
    })
})

/**
 * @openapi
 * /comments/{id}:
 *  get:
 *      summary: 获取文章评论列表
 *      tags: [评论]
 */
router.get('/comments/:id', pageQuery, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const { page, count, total, data } =  await findAndCountAll(PostCommentModel, 
        { postId: mData.id }, 
        { 
            ...(mData as IPageQuery),
            populate: { path: 'user' }
        }
    )
    const deviceHeight = req.get('DeviceHeight')
    const list = []
    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        list.push({
            ...item,
            textLines: await getTextLines({
                text: item.content || '',
                textSize: 16,
                wrapHeight: parseInt(deviceHeight + '') * 0.66 - 70
            })
        })
    }

    res.json({
        code: 200,
        data: list,
        page, count, total
    })
})

export default router
