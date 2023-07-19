// module-alias changes the default behavior of require
// 必须放在最开始
require('module-alias/register')
// 引入 module-alias 定义路径别名
import moduleAlias from 'module-alias'

moduleAlias.addAlias('@', __dirname)
moduleAlias.addAlias('@db', __dirname + '/db')
// moduleAlias.addAlias('@utils', __dirname + '/utils')
// moduleAlias.addAlias('@config', __dirname + '/utils/config')
moduleAlias.addAlias('@router', __dirname + '/router')
// moduleAlias.addAlias('@public', __dirname + '/public')

import express from 'express'
// 创建Express应用实例
const app = express()
// 允许访问静态文件
// 当客户端访问匹配的路径时,Express 直接返回对应的静态文件,不需要额外的路由处理
// 根路径默认导向 'public/index.html'
app.use(express.static('public'))

import bodyParser from 'body-parser'
// 使用bodyParser中间件解析json格式请求体
app.use(bodyParser.json())

import cookieParser from 'cookie-parser'
// 使用cookieParser中间件解析cookie
app.use(cookieParser())

import compression from 'compression'
// 使用compression中间件,开启gzip压缩
app.use(compression())

// 引入 multer 用于上传文件
import multer from 'multer'
// 定义接收上传文件的目录
const upload = multer({ dest: 'public/upload/temp' })
// 接收一切上传的文件
app.use(upload.any())

// 导入cors中间件用于实现跨域资源共享
import cors from 'cors'
// 使用cors中间件,允许跨域
app.use(
  cors({
    credentials: true,
  }),
)

// 导入路由模块
import router from './router'
// 使用路由模块处理请求
// app.use('/', router());
app.use(router())

import '@/utils/run-test'

import http from 'http'
// 创建http服务器实例
const server = http.createServer(app)
const PORT = 7333
// 监听8080端口

const handleDBConnect = () => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://192.168.1.5:${PORT}/`)
  })
}

import { connect } from '@/db'
connect(handleDBConnect)
