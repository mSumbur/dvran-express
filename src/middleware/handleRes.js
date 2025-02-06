const createHttpError = require('http-errors')

/**
 * 处理控制器错误
 * @param {any} callback 
 * @returns 
 */
const handleRes = (callback) => {
    return async (req, res, next) => {
        try {
            await callback(req, res, (value) => {
                res.json(value.data ? {
                    code: 200,
                    ...value
                } : {
                    code: 200,
                    data: value
                })
            })
        } catch (err) {
            console.log('err is: ', err)
            if (err.statusCode) {
                next(err)
            } else {
                next(createHttpError(500, '服务器错误'))
            }            
        }
    }
}

module.exports = handleRes