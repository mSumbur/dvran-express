import express from "express"
import createHttpError from "http-errors"
import validate from "../../middleware/validate"
import { jwtAuth, jwtAuthOption } from "../../middleware/jwtAuth"
import { body, matchedData, param } from "express-validator"
import { pageQuery } from "../../middleware/validaters"
import { UserActionModel, UserModel } from "../../db/model"
import { findAndCountAll } from "../../utils/findAndCountAll"
import { IUserActionType } from "../../db/model/user-action.model"

const router = express.Router()

/**
 * @openapi
 * /user/current:
 *  get:
 *      summary: 获取当前用户信息
 *      tags: [用户]
 */
router.get('/user/current', jwtAuth, async (req, res, next) => {
    let result = await UserModel.findById(req.auth.userId).lean()
    if (!result) {
        throw createHttpError(401)
    }
    const followerCount = await UserActionModel.countDocuments({
        targetUserId: req.auth.userId,
        type: IUserActionType.follow
    })
    const followingCount = await UserActionModel.countDocuments({
        userId: req.auth.userId,
        type: IUserActionType.follow
    })
    res.json({
        code: 200,
        data: {
            ...result,
            followerCount,
            followingCount
        }
    })
})

/**
 * @openapi
 * /user/:id:
 *  get:
 *      summary: 获取用户详情
 *      tags: [用户]
 */
router.get('/user/:id', jwtAuthOption, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const user = await UserModel.findById(mData.id).lean()
    const userId = req.auth.userId
    let isFollow = false
    if (user && userId) {        
        const isFollowResult = await UserActionModel.findOne({
            userId: userId,
            targetUserId: mData.id
        })
        isFollow = !!isFollowResult
    }
    const followerCount = await UserActionModel.countDocuments({
        targetUserId: mData.id,
        type: IUserActionType.follow
    })
    const followingCount = await UserActionModel.countDocuments({
        userId: mData.id,
        type: IUserActionType.follow
    })
    res.json({
        code: 200,
        data: {
            ...user,
            isFollow,
            followerCount,
            followingCount
        }
    })
})

/**
 * @openapi
 * /user/followers:
 *  get:
 *      summary: 获取粉丝列表
 *      tags: [用户]
 */
router.get('/user/:id/followers', jwtAuth, pageQuery, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    // const query = req.query as unknown as IPageQuery
    const { page, count, total, data } = await findAndCountAll(UserActionModel, 
        { targetUserId: mData.id, type: IUserActionType.follow },
        { ...mData, populate: { path: 'userId' } }
    )
    res.json({
        code: 200,
        page, count, total, data: data.map(i => i.userId)
    })
})

/**
 * @openapi
 * /user/following:
 *  get:
 *      summary: 获取关注列表
 */
router.get('/user/:id/following', jwtAuth, pageQuery, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    // const query = req.query as unknown as IPageQuery
    const { page, count, total, data } = await findAndCountAll(UserActionModel, 
        { userId: mData.id, type: IUserActionType.follow },
        { ...mData, populate: { path: 'targetUserId' } }
    )
    res.json({
        code: 200,
        page, count, total, data: data.map(i => i.targetUserId)
    })
})

/**
 * @openapi
 * /user/:id:
 *  get:
 *      summary: 更新用户信息
 *      tags: [用户]
 */
router.patch('/user', jwtAuth, validate([
    body('avatar').optional(),
    body('nickname').optional(),
    body('bio').optional(),
    body('phone').optional(),
]), async (req, res, next) => {
    const mData = matchedData(req)
    const user = await UserModel.findByIdAndUpdate(req.auth.userId, mData, { new: true })
    res.json({
        code: 200,
        data: user
    })
})

/**
 * @openapi
 * /user:
 *  post:
 *      summary: 创建用户
 *      tags: [用户]
 */
router.post('/user', jwtAuth, validate([
    body('nickname').isString().withMessage('nickname must be a string'),
    body('avatar').optional().isString().withMessage('avatar must be a string')
]), async (req, res) => {
    const mData = matchedData(req)    
    const randomIndex = Math.floor(Math.random() * 6) + 1
    const defaultAvatar = process.env?.MEDIA_DOMAIN + '/male-' + randomIndex + '.png'
    const userCount = await UserModel.countDocuments()
    const defaultNickname = 'ᠬᠡᠷᠡᠭ᠍ᠯᠡᠭ᠍ᠴᠢ ' + userCount
    const user = await UserModel.create({
        ...mData,
        avatar: mData.avatar || defaultAvatar,
        nickname: mData.nickname || defaultNickname
    })
    
    res.json({
        code: 200,
        data: user
    })
})

/**
 * @openapi
 * /user/:id/follow:
 *  post:
 *      summary: 关注用户
 *      tags: [用户行为]
 */
router.post('/user/:id/follow', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const filter = { userId: req.auth.userId, targetUserId: mData.id, type: IUserActionType.follow }
    const result = await UserActionModel.findOneAndUpdate(
        filter,
        { $setOnInsert: filter },
        { new: true, upsert: true }
    )
    res.json({
        code: 200,
        data: result
    })
})

/**
 * @openapi
 * /user/:id/follow:
 *  delete:
 *      summary: 取消关注
 *      tags: [用户行为]
 */
router.delete('/user/:id/follow', jwtAuth, validate([
    param('id').isMongoId().withMessage('Invalid id')
]), async (req, res) => {
    const mData = matchedData(req)
    const filter = { userId: req.auth.userId, targetUserId: mData.id, type: IUserActionType.follow }
    const result = await UserActionModel.deleteOne(filter)
    res.json({
        code: 200,
        data: result
    })
})

/**
 * @openapi
 * /users:
 *  get:
 *      summary: 获取用户列表
 *      tags: [用户]
 */
router.get('/users', jwtAuth, pageQuery, async (req, res) => {
    // const query = req.query as unknown as IPageQuery
    // const result = await UserService.findUsers(query)
    // res.json({
    //     code: 200,
    //     data: result.rows,
    //     total: result.count,
    //     page: query.page,
    //     count: query.count
    // })
})

export default router