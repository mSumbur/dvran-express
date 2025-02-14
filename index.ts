import path from "path"
import fs from "fs"
import express, { Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"

// env
import dotenv from "dotenv"
// const dotenv = require('dotenv')
dotenv.config({
  path: path.resolve(__dirname, './env/.env.' + process.env.NODE_ENV)
})

import { initDB } from "./src/db"
import { jwtAuth } from "./src/middleware/jwtAuth"
// const { initDB } = require('./db')
// const { jwtAuth } = require("./middleware/jwtAuth")

// 错误处理插件
import "express-async-errors"
// require('express-async-errors')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(morgan("tiny"))
// app.use(jwtAuth)

// 引入路由
const routesPath = path.join(__dirname, './src/routes/api')
fs.readdirSync(routesPath).forEach(async file => {
  const filePath = path.join(routesPath, file)
  if (fs.lstatSync(filePath).isFile() && file.endsWith('.ts')) {    
    const baseName = path.basename(file, path.extname(file))
    const routeName = `/api/${baseName}`
    const routeModule = await import(filePath)
    const route = routeModule.default
    app.use(routeName, route)
  }
})

// error handler
app.use(function (err: any, req: Request, res: Response, next: any) {
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
