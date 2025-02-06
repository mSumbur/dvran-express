const { Tag } = require('../db/model')

/**
 * 创建标签
 * @param {*} params 
 */
async function createTag(params) {
    return await Tag.create(params)
}

/**
 * 获取推荐标签
 * @param {*} req 
 * @returns 
 */
async function findTagsByRecommend(pageQuery) {
    const { page, count } = pageQuery
    const offset = (page - 1) * count
    const result = await Tag.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: count,
        offset: offset
    })
    return result
}


module.exports = {
    createTag,
    findTagsByRecommend
}