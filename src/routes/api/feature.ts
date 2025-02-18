import express from "express"
const router = express.Router()

router.get('/features', async (req, res) => {
    res.json({
        code: 200,
        data: []
    })
})

export default router
