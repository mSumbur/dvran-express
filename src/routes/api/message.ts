import express from "express"
const router = express.Router()

/**
 * 分页获取当前用户信息
 */
router.get('/messages', async (req, res, next) => {

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