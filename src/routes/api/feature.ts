import express from "express"
const router = express.Router()

/**
 * @openapi
 * /features:
 *  get:
 *      summary: 获取功能列表
 *      tags: [功能]
 */
router.get('/features', async (req, res) => {
    res.json({
        code: 200,
        data: []
    })
})

export default router
