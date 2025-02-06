const { User } = require("../db/model")
const nanoid = require('nanoid')

/**
 * 创建用户
 * @param {*} username 
 * @returns 
 */
async function createUser(username) {
    const user = await User.create({
        username,
        nickname: username,
    })
    return user
}

/**
 * 使用openid创建用户
 * @param {*} openid 
 */
async function createUserByOpenid(openid, unionid) {
    const userCount = await User.count()
    const user = await User.create({
        openid,
        unionid,
        username: nanoid(),
        nickname: 'ᠬᠡᠷᠡᠭ᠍ᠯᠡᠭ᠍ᠴᠢ ' + userCount
    })
    return user
}

/**
 * 使用openid查询用户
 * @param {*} openid 
 * @returns 
 */
async function findUserByOpenid(openid) {
    const result = await User.findOne({
        where: {
            openid
        }
    })
    return result
}

/**
 * 使用id查询用户
 * @param {*} id 
 * @returns 
 */
async function findUserById(id) {
    const result = await User.findByPk(parseInt(id))
    return result
}

/**
 * 通过id更新用户
 * @param {*} id 
 * @param {*} value 
 */
async function updateUserById(id, value) {
    const result = await User.update(value, { id })
    return result
}

module.exports = {
    createUser,
    createUserByOpenid,
    findUserByOpenid,
    findUserById,
    updateUserById
}