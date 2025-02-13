/**
 * @description: auth
 */

const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const router = require('express').Router()
const { findUserByOpenid, createUserByOpenid } = require('../../services/user')

/**
 * 微信小程序登录(无感)
 */
router.post('/weapp/login', async (req, res) => {
    const { appid, code } = req.body
    const appSecret = process.env.WEAPP_SECRET
    const result = await axios(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&js_code=${code}&secret=${appSecret}&grant_type=authorization_code`)

    if (!result || !result.data || !result.data.openid) {
        throw createHttpError(500)
    }

    // 查询用户
    let user = await findUserByOpenid(result.data.openid)
    console.log(result.data, user)
    // 没有当前用户记录时新建用户
    if (!user) {
        user = await createUserByOpenid(result.data.openid)
    }

    const token = jwt.sign(
        { userId: user.id, openid: user.openid },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 24 * 7 + 's' }
    )

    res.json({
        code: 200,
        data: {
            token,
            user
        }
    })
})

module.exports = router