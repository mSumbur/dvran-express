const router = require('express').Router()

router.get('/list', async (req, res) => {
    res.json({
        code: 200,
        data: []
    })
})

module.exports = router