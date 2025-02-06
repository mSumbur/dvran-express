const { expressjwt } = require('express-jwt')

/**
 * jwt 中间件
 */
const jwtAuth = expressjwt({
    // 密钥
    secret: process.env.JWT_SECRET || 'secret',
    // signOptions: {
    //     expiresIn: 60 * 60 * 24 * 7 + 's'
    // },    
    // 算法
    algorithms: ['HS256'],
    // 无 token 请求不进行解析，并抛出异常
    credentialsRequired: false
})
// .unless({
//     path: [
//         '/api/login/weapp',
//         '/api/category',
//         { url: /^\/api\/post\/([a-zA-Z0-9]+)$/, methods: ['GET'] }
//     ]
// })

const authCheck = async (req, res, next) => {
    if (!req.auth || !req.auth._id) {
        next(createHttpError(401))
    } else {
        next()
    }
}

module.exports = { 
    jwtAuth,
    authCheck
}