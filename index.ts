import path from "path"
import fs from "fs"
import express, { Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import "express-async-errors" // 错误处理插件
import dotenv from "dotenv"
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express'

// env
dotenv.config({
  path: path.resolve(__dirname, './env/.env.' + process.env.NODE_ENV)
})

import { connectDB } from "./src/db"
// import { initDB } from "./src/db"

// Swagger 配置
const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Dvran后端API',
      description: 'API documentation for the Express application',
      version: '1.0.0',
    },
    basePath: '/',
  },
  apis: ['./src/routes/api/*.ts'], // 通过注释生成 API 文档, 指定扫描的文件
}

const app: Application = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(morgan("tiny"))
// app.use(jwtAuth)

// 引入api路由
const routesPath = path.join(__dirname, './src/routes/api')
fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith('.ts')) {
    // fs.lstatSync(filePath).isFile()   
    // const baseName = path.basename(file, path.extname(file))
    const route = require(path.join(routesPath, file)).default
    app.use(`/api`, route)
  }
})

// 初始化 SwaggerJSDoc，在 Express 中设置 Swagger UI 路由
const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // res.locals.code = err?.status || 500
  // res.locals.message = err?.message || 'server error'
  // res.locals.error = req.app.get('env') === 'dev' ? err : {}
  res.status(err.status || 500)
  res.json({
    code: err?.status || 500,
    message: err?.message || 'server error'
  })
})

const port = process.env.PORT 

// async function bootstrap() {
  // await initDB()
  // return app.listen(port, () => console.log("start success ", port))
// }

// bootstrap()

const server = app.listen(port, async () => {
  await connectDB()
  console.log("start success ", port)
})

export { app, server }