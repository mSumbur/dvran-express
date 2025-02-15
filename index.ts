import path from "path"
import fs from "fs"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"

// env
import dotenv from "dotenv"
dotenv.config({
  path: path.resolve(__dirname, './env/.env.' + process.env.NODE_ENV)
})

import { initDB } from "./src/db"
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
fs.readdirSync(routesPath).forEach(file => {  
  if (file.endsWith('.ts')) {
    // fs.lstatSync(filePath).isFile()   
    // const baseName = path.basename(file, path.extname(file))
    const route = require(path.join(routesPath, file)).default
    app.use(`/api`, route)
  }
})

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('发生错误', err.status, err.code)
  // res.locals.code = err?.status || 500
  // res.locals.message = err?.message || 'server error'
  // res.locals.error = req.app.get('env') === 'dev' ? err : {}
  res.status(err.status || 500)
  res.json({
    code: err?.status || 500,
    message: err?.message || 'server error'
  })
})

const port = process.env.PORT || 3333

async function bootstrap() {
  await initDB()
  app.listen(port, () => console.log("start success ", port))
}

bootstrap()
