import express from "express"
const router = express.Router()

router.get('/list', async (req, res) => {
    res.json({
        code: 200,
        data: []
    })
})

export default router
