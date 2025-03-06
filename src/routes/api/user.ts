// import { createUser, findUserById, findUserFollowStatus, findUsers, updateUserById } from "../../services/user"
import { jwtAuth, jwtAuthOption } from "../../middleware/jwtAuth"
import { body, matchedData, param } from "express-validator"
import { IPageQuery, pageQuery } from "../../middleware/validaters"
import createHttpError from "http-errors"
import validate from "../../middleware/validate"
import express from "express"
import FollowService from "../../services/follow"
import UserService from "../../services/user"

const router = express.Router()

/**
 * @openapi
 * /user/current:
 *  get:
 *      summary: 获取当前用户信息
 *      tags: [用户]
 */
router.get('/user/current', jwtAuth, async (req, res, next) => {
    const { userId, openid } = req.auth
    let result = await UserService.findUserById(userId)
    if (!result) {
        throw createHttpError(401)
    }
    res.json({
        code: 200,
        data: result
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
    param('id').toInt().isInt().withMessage('id must be an intger')
]), async (req, res) => {
    const { id } = matchedData(req)
    const user = await UserService.findUserById(id)
    const { userId } = req.auth
    if (user && userId) {
        const isFollow = await UserService.findUserFollowStatus({
            followerId: userId,
            followingId: id
        })
        res.json({
            code: 200,
            data: {
                ...user?.dataValues,
                isFollow
            }
        })
    } else {
        res.json({
            code: 200,
            data: user
        })
    }
})

/**
 * @openapi
 * /user/followers:
 *  get:
 *      summary: 获取粉丝列表
 */
router.get('/user/:id/followers', jwtAuth, pageQuery, validate([
    param('id').toInt().isInt().withMessage('id must be an integer')
]), async (req, res) => {    
    const { id } = matchedData(req)
    const query = req.query as unknown as IPageQuery
    const result = await FollowService.getFollowersByUserId({ ...query, userId: id })
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
 * /user/followers:
 *  get:
 *      summary: 获取关注列表
 */
router.get('/user/:id/following', jwtAuth, pageQuery, validate([
    param('id').toInt().isInt().withMessage('id must be an integer')
]), async (req, res) => {    
    const { id } = matchedData(req)
    const query = req.query as unknown as IPageQuery
    const result = await FollowService.getFollowingByUserId({ ...query, userId: id })
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
    const { userId } = req.auth
    const user = await UserService.updateUserById(userId, req.body)
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
    const result = await UserService.createUser(matchedData(req))
    res.json({
        code: 200,
        data: result
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
    param('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {
    const { userId } = req.auth
    const { id } = matchedData(req)
    const result = await FollowService.followUser({ followerId: userId, followingId: id })
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
    param('id').toInt().isInt().withMessage('id is not valid')
]), async (req, res, next) => {
    const { userId } = req.auth
    const { id } = matchedData(req)
    const result = await FollowService.unFollowUser({ followerId: userId, followingId: id })
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
    const query = req.query as unknown as IPageQuery
    const result = await UserService.findUsers(query)
    res.json({
        code: 200,
        data: result.rows,
        total: result.count,
        page: query.page,
        count: query.count
    })
})

export default router