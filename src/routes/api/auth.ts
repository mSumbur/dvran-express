/**
 * @description: auth
 */

import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import axios from "axios"
import express from "express"
import { findUserByOpenid, createUserByOpenid } from "../../services/user"
const router = express.Router()

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
    let user: any = await findUserByOpenid(result.data.openid)
    console.log(result.data, user)
    // 没有当前用户记录时新建用户
    if (!user) {
        user = await createUserByOpenid(result.data.openid)
    }

    const jwtSecret = process.env.JWT_SECRET || ''
    // @ts-ignore
    const token = jwt.sign(
        { userId: user.id, openid: user.openid }, 
        jwtSecret,
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

export default router
// module.exports = router