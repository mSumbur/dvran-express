// 自定义验证函数
function validate(validations) {
    return async (req, res, next) => {
        const filteredBody = {}
        // 顺序执行验证规则，发现错误立即返回
        for (const validation of validations) {
            const keyName = validation.builder.fields[0]
            filteredBody[keyName] = req.body[keyName]
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: 'Validation failed',
                    errors: result.array(), // 返回详细的错误信息
                })
            }
        }
        // 用过滤后的 body 替代原始的 body
        req.body = filteredBody
        next() // 如果没有错误，继续后续处理
    }
}

module.exports = validate