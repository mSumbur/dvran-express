const router = require('express').Router()

router.get('/article/:id', (req, res) => {
    res.json({
        code: 200,
        data: [],
        total: 1,
        page: 1,
        count: 1
    })
})

module.exports = router