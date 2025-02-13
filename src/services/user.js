const { User } = require("../db/model")
const { nanoid } = require('nanoid')

/**
 * 创建用户
 * @param {*} username 
 * @returns 
 */
async function createUser(username) {
    const avatarList = [
        'changjinglu',
        'hudie',
        'laohu',
        'luotuo',
        'mao',
        'mianyang',
        'milu',
        'nainiu',
        'songshu',
        'xiniu',
        'xiongmao',
        'yangtuo'
    ]

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
async function createUserByOpenid(openid) {
    const userCount = await User.count()
    const user = await User.create({
        openid,
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
    const [updatedCount, updatedUsers] = await User.update(value, {
        where: { id },
        returning: true, // 返回更新后的记录
    })    
    return { updatedCount, updatedUsers }    
}

module.exports = {
    createUser,
    createUserByOpenid,
    findUserByOpenid,
    findUserById,
    updateUserById
}