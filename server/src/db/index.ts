import mongoose from 'mongoose'

// load env
import { config } from 'dotenv'

// get env variables from parsed config
const { DB_HOST, DB_PORT, DB_NAME } = config().parsed!

const DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

export const connect = (
  success: () => void,
  error: () => void = () => {
    console.log('连接失败')
  },
) => {
  void mongoose.connect(DB_URI).then((res) => {
    console.log(`连接至数据库【${res.connections[0].name}】`)
  })

  // 使用once防止重复执行
  mongoose.connection.once('open', () => {
    success()
  })

  mongoose.connection.on('error', () => {
    error()
  })

  mongoose.connection.on('close', () => {
    console.log('关闭连接')
  })
}
