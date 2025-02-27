import express from "express"
import { IPageQuery, pageQuery } from "../../middleware/validaters"
import { jwtAuth } from "../../middleware/jwtAuth"
import { findMessagesByUserId } from "../../services/message"
const router = express.Router()

/**
 * 分页获取当前用户信息
 */
router.get('/messages', jwtAuth, pageQuery, async (req, res, next) => {
    const { userId } = req.auth
    const pageQuery = req.query as unknown as IPageQuery
    const result = await findMessagesByUserId(userId, pageQuery)
    res.json({
        code: 200,
        data: result.rows,
        page: pageQuery.page,
        count: pageQuery.count,
        total: result.count
    })
})

/**
 * 已读信息
 */
router.patch('/message/:id', async (req, res, next) => {
    
})

/**
 * 删除指定信息
 */
router.delete('/message/:id', async (req, res, next) => {

})

export default router