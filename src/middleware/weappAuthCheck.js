const createHttpError = require("http-errors")

function weappAuthCheck(req, res, next) {
    if (req.headers["x-wx-source"]) {
        req.user = {
            openid: req.headers["X-WX-OPENID"],
            unionid: req.headers["X-WX-UNIONID"],
            ipaddress: req.headers["X-Forwarded-For"]
        }
        next()
    } else {
        next(createHttpError(401))
        // res.status(401).json({
        //     code: 401,
        //     message: '没有权限'
        // })
    }
}

module.exports = weappAuthCheck