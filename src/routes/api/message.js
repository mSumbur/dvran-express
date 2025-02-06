const handleRes = require('../../middleware/handleRes')

const router = require('express').Router()

/**
 * 分页获取当前用户信息
 */
router.get('/', handleRes(async (req, res, next) => {

}))

/**
 * 已读信息
 */
router.patch('/:id', handleRes(async (req, res, next) => {
    
}))

/**
 * 删除指定信息
 */
router.delete('/:id', handleRes(async (req, res, next) => {

}))

module.exports = router