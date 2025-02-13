const createHttpError = require('http-errors')
const handleRes = require('../../middleware/handleRes')
const { findUserByOpenid, createUserByOpenid, findUserById, updateUserById } = require('../../services/user')
const { jwtAuth } = require('../../middleware/jwtAuth')
const validate = require('../../middleware/validate')
const { body } = require('express-validator')

const router = require('express').Router()

/**
 * 获取当前用户信息
 */
router.get('/current', jwtAuth, async (req, res, next) => {
    const { userId, openid } = req.auth
    let result = await findUserById(userId)
    if (!result) {
        result = await createUserByOpenid(openid)
    }
    res.json({
        code: 200,
        data: result.dataValues
    })
})

/**
 * 获取用户详情
 */
router.get('/:id', handleRes(async (req, res, next) => {
    const user = await findUserById(req.params.id)
    if (user && user.dataValues) {
        next(user.dataValues)
    } else {
        throw createHttpError(400)
    }
}))

/**
 * 更新用户信息
 */
router.patch('/:id', jwtAuth, validate([
    body('avatar').optional(),
    body('nickname').optional(),
    body('bio').optional(),
    body('phone').optional(),
]), async (req, res, next) => {
    const user = await updateUserById(req.params.id, req.body)
    res.json({
        code: 200,
        data: user
    })
})

module.exports = router