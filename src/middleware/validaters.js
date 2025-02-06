const { query } = require('express-validator')

// 自定义验证函数
function validate(validations) {
    return async (req, res, next) => {
        // 顺序执行验证规则，发现错误立即返回
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: 'Validation failed',
                    errors: result.array(), // 返回详细的错误信息
                })
            }
        }
        next() // 如果没有错误，继续后续处理
    }
}

const pageQuery = validate([
    query('page')
        .default(1)
        .toInt()
        .isInt({ min: 1 })
        .withMessage("page is not valid"),
    query('count')
        .default(10)
        .toInt()
        .isInt({ min: 1 })
        .withMessage("count is not valid")
])

module.exports = {
    pageQuery
}

