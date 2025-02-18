import { createUserByOpenid, findUserById, updateUserById } from "../../services/user"
import { jwtAuth } from "../../middleware/jwtAuth"
import { body } from "express-validator"
import createHttpError from "http-errors"
import validate from "../../middleware/validate"
import express from "express"
const router = express.Router()

/**
 * 获取当前用户信息
 */
router.get('/user/current', jwtAuth, async (req, res, next) => {
    const { userId, openid } = req.auth
    let result = await findUserById(userId)
    if (!result) {
        throw createHttpError(401)
    }
    res.json({
        code: 200,
        data: result
    })
})

/**
 * 获取用户详情
 */
router.get('/user/:id', async (req, res, next) => {
    const userId = parseInt(req.params.id)
    const user = await findUserById(userId)
    if (user) {
        res.json({
            code: 200,
            data: user
        })
    } else {
        throw createHttpError(400)
    }
})

/**
 * 更新用户信息
 */
router.patch('/user', jwtAuth, validate([
    body('avatar').optional(),
    body('nickname').optional(),
    body('bio').optional(),
    body('phone').optional(),
]), async (req, res, next) => {
    const { userId } = req.auth
    const user = await updateUserById(userId, req.body)
    res.json({
        code: 200,
        data: user
    })
})

export default router