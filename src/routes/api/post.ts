import express from "express"
import createHttpError from "http-errors"
import validate from "../../middleware/validate"
import calcPostTextLine from "../../utils/calcPostTextLine"
import { body, matchedData, param, query } from "express-validator"
import { pageQuery } from "../../middleware/validaters"
import { jwtAuth, jwtAuthOption } from "../../middleware/jwtAuth"
import { PostModel, MediaModel, PostActionModel, MessageModel, UserActionModel } from "../../db/model"
import { getTextLines } from "../../utils/getTextLines"
import { IPageQuery } from "../../middleware/validaters"
import { findAndCountAll } from "../../utils/findAndCountAll"
import { IPostActionType } from "../../db/model/post-action.model"
import { IMessageType } from "../../db/model/message.model"
import { IUserActionType } from "../../db/model/user-action.model"

const router = express.Router()

/**
 * @openapi
 * /posts/feeds:
 *  get:
 *      summary: 获取全部帖子
 *      tags: [帖子]
 */
router.get('/posts/feeds', pageQuery, async (req, res) => {
    const { page, count, total, data } = await findAndCountAll(PostModel,
        { isDeleted: false },
        {
            ...(matchedData(req) as unknown as IPageQuery),
            populate: [
                { path: 'media', perDocumentLimit: 1 },
                { path: 'user', select: 'avatar nickname' }
            ],
            sort: { createdAt: -1 }
        }
    )
    res.json({
        code: 200,
        data: await calcPostTextLine(req, data),
        page, count, total
    })
})

/**
 * @openapi
 * /posts/follow:
 *  get:
 *      summary: 获取全部帖子
 *      tags: [帖子]
 */
router.get('/posts/follow', jwtAuth, pageQuery, async (req, res) => {
    const followedUser = await UserActionModel.find({
        userId: req.auth.userId,
        type: IUserActionType.follow
    })
    if (followedUser.length == 0) {
        res.json({
            code: 200, data: [], total: 0, page: 1, count: 0
        })
        return
    }
    const { page, count, total, data } = await findAndCountAll(PostModel,
        {
            userId: { $in: followedUser.map(i => i.targetUserId) },
            isDeleted: false
        },
        {
            ...(matchedData(req) as unknown as IPageQuery),
            populate: [
                { path: 'media', perDocumentLimit: 1 },
                { path: 'user', select: 'avatar nickname' }
            ],
            sort: { createdAt: -1 }
        }
    )
    res.json({
        code: 200,
        data: await calcPostTextLine(req, data),
        page, count, total
    })
})

/**
 * @openapi
 * /posts/recommend:
 *  get:
 *      summary: 获取推荐帖子
 *      tags: [帖子]     
 */
router.get('/posts/recommend', pageQuery, async (req, res, next) => {
    const { page, count, total, data } = await findAndCountAll(PostModel,
        { isDeleted: false, isRecommended: true },
        {
            ...(matchedData(req) as unknown as IPageQuery),
            populate: [
                { path: 'media', perDocumentLimit: 1 },
                { path: 'user', select: 'avatar nickname' }
            ],
            sort: { createdAt: -1 }
        }
    )
    res.json({
        code: 200,
        data: await calcPostTextLine(req, data),
        page, count, total
    })
})

/**
 * @openapi
 * /posts/bytag/:id:
 *  get:
 *      summary: 获取指定标签的帖子列表
 *      tags: [帖子]      
 */
router.get('/posts/bytag/:id', pageQuery, validate([
    param('id').isMongoId().withMessage('id must be a valid mongo id')
]), async (req, res) => {
    const mData = matchedData(req)
    const { page, count, total, data } = await findAndCountAll(
        PostModel,
        { tagId: mData.id },
        {
            ...mData,
            sort: { createdAt: -1 },
            populate: [
                { path: 'media', perDocumentLimit: 1 },
                { path: 'user', select: 'avatar nickname' }
            ]
        }
    )
    res.json({
        code: 200,
        page, count, total,
        data: await calcPostTextLine(req, data)
    })
})

/**
 * @openapi
 * /posts/byuser/:id:
 *  get:
 *      summary: 获取指定用户的帖子列表
 *      tags: [帖子]      
 */
router.get('/posts/byuser/:id', pageQuery, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const { page, count, total, data } = await findAndCountAll(
        PostModel,
        { userId: mData.id },
        {
            ...mData,
            sort: { createdAt: -1 },
            populate: [
                { path: 'media', perDocumentLimit: 1 },
                { path: 'user', select: 'avatar nickname' }
            ]
        }
    )
    res.json({
        code: 200,
        page, count, total,
        data: await calcPostTextLine(req, data)
    })
})

/**
 * @openapi
 * /posts/bycurrentuser:
 *  get:
 *      summary: 获取当前用户的帖子列表
 *      tags: [帖子]      
 */
router.get('/posts/bycurrentuser', jwtAuth, pageQuery, validate([]), async (req, res) => {
    const mData = matchedData(req)
    const { page, count, total, data } = await findAndCountAll(
        PostModel,
        { userId: req.auth.userId },
        {
            ...mData,
            sort: { createdAt: -1 },
            populate: [
                { path: 'media', perDocumentLimit: 1 },
                { path: 'user', select: 'avatar nickname' }
            ]
        }
    )
    res.json({
        code: 200,
        page, count, total,
        data: await calcPostTextLine(req, data)
    })
})

/**
 * @openapi
 * /articles/like:
 *  get:
 *      summary: 获取点赞帖子列表
 *      tags: [帖子]
 */
router.get('/posts/like', jwtAuth, pageQuery, async (req, res) => {
    const mData = matchedData(req)
    const { page, count, total, data } = await findAndCountAll(PostActionModel,
        { userId: req.auth.userId, type: IPostActionType.like },
        { ...mData, populate: { path: 'postId', populate: 'media user' }, sort: { createdAt: -1 } }
    )
    const list = await calcPostTextLine(req, data.filter(i => i.postId), { keyStr: 'postId' })
    res.json({
        code: 200,
        data: list,
        page, count, total
    })
})

/**
 * @openapi
 * /articles/collect:
 *  get:
 *      summary: 获取收藏帖子列表
 *      tags: [帖子]
 */
router.get('/posts/collect', jwtAuth, pageQuery, async (req, res) => {
    const mData = matchedData(req)
    const { page, count, total, data } = await findAndCountAll(PostActionModel,
        { userId: req.auth.userId, type: IPostActionType.collect },
        { ...mData, populate: { path: 'postId', populate: 'media user' }, sort: { createdAt: -1 } }
    )
    const list = await calcPostTextLine(req, data.filter(i => i.postId), { keyStr: 'postId' })
    res.json({
        code: 200,
        data: list,
        page, count, total
    })
})

/**
 * @openapi
 * /post/:id:
 *  get:
 *      summary: 获取帖子详情
 *      tags: [帖子]       
 */
router.get('/post/:id', jwtAuthOption, validate([
    param('id').isMongoId().withMessage('Invalid id'),
    query('delta').optional().isBoolean().withMessage('Invalid query')
]), async (req, res, next) => {
    const mData = matchedData(req)
    console.log('query::: ', mData.delta)
    let data = await PostModel.findById(mData.id).populate('user media').select(mData.delta ? '+delta' : '').lean()
    if (!data || data.isDeleted) {
        throw createHttpError(404)
    }
    // 点赞收藏数
    const likeCount = await PostActionModel.countDocuments({ postId: mData.id, type: IPostActionType.like })
    const collectCount = await PostActionModel.countDocuments({ postId: mData.id, type: IPostActionType.collect })
    Object.assign(data, { likeCount, collectCount })
    // 点赞收藏状态
    if (req.auth) {
        const actionLike = await PostActionModel.findOne({ postId: mData.id, userId: req.auth.userId, type: IPostActionType.like })
        const actionCollect = await PostActionModel.findOne({ postId: mData.id, userId: req.auth.userId, type: IPostActionType.collect })
        Object.assign(data, { isLike: !!actionLike, isCollect: !!actionCollect })
    }
    const deviceWidth = req.get('DeviceWidth')
    const textLines = deviceWidth ? await getTextLines({
        text: data.text,
        textSize: 16,
        wrapHeight: parseInt(deviceWidth + '')
    }) : []
    res.json({
        code: 200,
        data: {
            ...data,
            textLines
        }
    })
})

/**
 * @openapi
 * /post:
 *  post:
 *      summary: 创建帖子
 *      tags: [帖子]         
 */
router.post('/post', jwtAuth, validate([
    // body('id').optional().isString().trim().withMessage('id must be a string'),
    body('text').isString().trim().withMessage('text must be a string'),
    body('media').optional().isArray(),
    body('tagNames').optional().isArray(),
    body('tagNames.*').optional().isString().withMessage('each tagName must be a string'),
    body('tagIds').optional().isArray(),
    body('delta').optional().isArray()
]), async (req, res, next) => {
    const mData = matchedData(req)
    const media = await MediaModel.insertMany(mData.media)
    const post = await PostModel.create({
        text: mData.text,
        delta: mData.delta,
        openid: req.auth.openid,
        userId: req.auth.userId,
        media,
    })
    res.json({
        code: 200,
        data: post
    })
})

/**
 * @openapi
 * /post/{id}/{action}:
 *  post:
 *    summary: 点赞或收藏帖子
 *    tags: [帖子]
 */
router.post('/post/:id/:action', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid id'),
    param('action').isIn(['like', 'collect']).withMessage('Invalid action')
]), async (req, res) => {
    const mData = matchedData(req)
    const post = await PostModel.findById(mData.id).lean()
    if (!post || post.isDeleted) {
        throw createHttpError(404)
    }
    const filter = {
        postId: mData.id,
        userId: req.auth.userId,
        type: mData.action == 'like' ? IPostActionType.like : IPostActionType.collect
    }
    await PostActionModel.findOneAndUpdate(filter,
        { $setOnInsert: filter },
        { new: true, upsert: true }
    ).lean()
    // 添加消息
    console.log('创建消息：：：', mData.action == 'like' ? IMessageType.like : IMessageType.collect)
    const msgFilter = {
        senderId: req.auth.userId,
        receiverId: post.userId,
        relationId: mData.id,
        type: mData.action == 'like' ? IMessageType.like : IMessageType.collect
    }
    await MessageModel.findOneAndUpdate(msgFilter,
        { $setOnInsert: msgFilter },
        { upsert: true }
    )
    console.log('创建消息end')
    res.json({
        code: 200,
        data: {}
    })
})

/**
 * @openapi
 * /post/:id:
 *  patch:
 *      summary: 更新帖子
 *      tags: [帖子]
 */
router.patch('/post/:id', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid iD'),
    body('text').optional().isString().trim().withMessage('Text must be a string'),
    body('delta').optional().isArray().withMessage('Invalid delta'),
    body('tagNames').optional().isArray(),
    body('tagNames.*').optional().isString().withMessage('Each tagName must be a string')
]), async (req, res) => {
    const mData = matchedData(req)
    const post = await PostModel.findById(mData.id)
    if (!post) {
        throw createHttpError(404)
    }
    if (post.userId.toString() == req.auth.userId.toString()) {
        post.text = mData.text
        post.delta = mData.delta
        await post.save()
    }
    res.json({
        code: 200,
        data: post
    })
})

/**
 * @openapi
 * /post/:id:
 *  delete:
 *      summary: 删除帖子
 *      tags: [帖子]
 */
router.delete('/post/:id', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid ID')
]), async (req, res) => {
    const mData = matchedData(req)
    const post = await PostModel.findById(mData.id)
    if (!post) {
        throw createHttpError(403)
    }
    if (post.userId.toString() == req.auth.userId.toString() && !post.isDeleted) {
        post.isDeleted = true
        post.deletedAt = new Date()
        await post.save()
    }
    res.json({
        code: 200,
        data: post
    })
})

/**
 * @openapi
 * /post/:id/:action
 *  delete:
 *      summary: 删除帖子动作
 *      tags: [帖子]
 */
router.delete('/post/:id/:action', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid id'),
    param('action').isIn(['like', 'collect']).withMessage('Invalid action')
]), async (req, res) => {
    const mData = matchedData(req)
    const result = await PostActionModel.deleteOne({
        postId: mData.id,
        userId: req.auth.userId,
        type: mData.action == 'like' ? IPostActionType.like : IPostActionType.collect
    })
    if (!result.acknowledged) {
        throw createHttpError(403)
    }
    // 删除消息
    await MessageModel.deleteOne({
        senderId: req.auth.userId,
        relationId: mData.id,
        type: mData.action == 'like' ? IMessageType.like : IMessageType.collect
    })
    res.json({
        code: 200,
        data: {}
    })
})

export default router