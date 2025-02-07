const handleRes = require('../../middleware/handleRes')
const { createGalpicTextImage } = require('../../services/tool')
const qiniu = require("qiniu")
const router = require('express').Router()

/**
 * 七牛token
 */
router.post('/qiniutoken', async (req, res, next) => {
    // 生成鉴权对象 mac
    const accessKey = process.env.QINIU_AK
    const secretKey = process.env.QINIU_SK
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    // 简单上传凭证
    const expires = 7200
    const options = {
        scope: 'dvran',
        expires
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)
    res.json({
        code: 200,
        data: uploadToken
    })
})

/**
 * 获取galpic文字图片
 */
router.post('/text', handleRes(async (req, res, next) => {
    const result = await createGalpicTextImage(req.body)
    next(result)
    // res.setHeader('Content-Type', 'image/png')
    // result.pipe(res)
}))

router.get('/env-value', async (req, res, next) => {
    res.json({
        code: 200,
        data: process.env
    })
})

module.exports = router