const createHttpError = require('http-errors')
const handleRes = require('../../middleware/handleRes')
const { findUserByOpenid, createUserByOpenid, findUserById, updateUserById } = require('../../services/user')

const router = require('express').Router()

/**
 * 获取当前用户信息
 */
router.get('/current', handleRes(async (req, res, next) => {
    if (process.env.NODE_ENV == "development") {
        next({ id: 1, nickname: '12445' })
    } else {
        const { openid, unionid } = req.user
        let result = await findUserByOpenid(openid)
        if (!result) {
            result = await createUserByOpenid(openid, unionid)
        }
        next(result.dataValues)
    }
}))

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
router.patch('/:id', handleRes(async (req, res, next) => {
    const user = await updateUserById(req.params.id)
    next(user.dataValues)
}))

module.exports = router