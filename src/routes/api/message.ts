import express from "express"
import createHttpError from "http-errors"
import MessageModel from "../../db/model/message.model"
import validate from "../../middleware/validate"
import { IPageQuery, pageQuery } from "../../middleware/validaters"
import { jwtAuth } from "../../middleware/jwtAuth"
import { findAndCountAll } from "../../utils/findAndCountAll"
import { matchedData, param } from "express-validator"

const router = express.Router()

/**
 * @openapi
 * /messages
 *  get:
 *      summary: 分页获取当前用户信息
 *      tags: [消息]
 */
router.get('/messages', jwtAuth, pageQuery, async (req, res) => {
    const mData = matchedData(req)
    const { page, count, total, data } = await findAndCountAll(MessageModel,
        {
            receiverId: req.auth.userId
        },
        {
            ...(mData as IPageQuery),
            populate: { path: 'sender' },
            sort: { createdAt: -1 }            
        }
    )
    res.json({
        code: 200,
        page, count, total, data
    })
})

/**
 * 已读信息
 */
router.get('/message/:id', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const message = await MessageModel.findById(mData.id)
    if (!message || message?.receiverId.toString() != req.auth.userId.toString()) {
        throw createHttpError(403)
    }
    message.isRead = true
    await message.save()
    res.json({
        code: 200,
        data: message
    })
})

/**
 * 删除指定信息
 */
router.delete('/message/:id', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const message = await MessageModel.findById(mData.id)
    if (!message || message.receiverId.toString() != req.auth.userId.toString()) {
        throw createHttpError(403)
    }
    await MessageModel.findByIdAndDelete(mData.id)
    res.json({
        code: 200
    })
})

export default router