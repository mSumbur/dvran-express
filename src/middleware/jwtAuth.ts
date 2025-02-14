import { expressjwt } from "express-jwt"

const jwtSecret = process.env.JWT_SECRET || ''

/**
 * jwt 中间件
 */
export const jwtAuth = expressjwt({
    // 密钥
    secret: jwtSecret,
    // signOptions: {
    //     expiresIn: 60 * 60 * 24 * 7 + 's'
    // },    
    // 算法
    algorithms: ['HS256'],
    // 无 token 请求不进行解析，并抛出异常
    credentialsRequired: true
})
// .unless({
//     path: [
//         '/api/login/weapp',
//         '/api/category',
//         { url: /^\/api\/post\/([a-zA-Z0-9]+)$/, methods: ['GET'] }
//     ]
// })

export const jwtAuthOption = expressjwt({    
    secret: jwtSecret,
    algorithms: ['HS256'],
    credentialsRequired: false
})

// const authCheck = async (req, res, next) => {
//     if (!req.auth || !req.auth._id) {
//         next(createHttpError(401))
//     } else {
//         next()
//     }
// }