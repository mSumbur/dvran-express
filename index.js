const path = require("path");
const fs = require('fs');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// env
const dotenv = require('dotenv')
dotenv.config({
  path: path.resolve(__dirname, './env/.env.' + process.env.NODE_ENV)
})

const { initDB } = require('./src/db')
const { jwtAuth } = require("./src/middleware/jwtAuth")

// 错误处理插件
require('express-async-errors');

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(morgan("tiny"))
// app.use(jwtAuth)

// 引入路由
const routesPath = path.join(__dirname, './src/routes/api')
fs.readdirSync(routesPath).forEach(file => {
  // 获取完整路径，检查是否为文件，避免处理目录等其他文件类型，使用文件名（不含扩展名）作为路由前缀
  const filePath = path.join(routesPath, file)
  if (fs.lstatSync(filePath).isFile()) {
    const route = require(filePath)
    const baseName = path.basename(file, path.extname(file))
    const routeName = `/api/${baseName}`
    app.use(routeName, route)
  }
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.code = err.status
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.send(res.locals)
})

const port = process.env.PORT || 3333

async function bootstrap() {
  // await initDB()
  app.listen(port, () => console.log("start success ", port))
}

bootstrap()
