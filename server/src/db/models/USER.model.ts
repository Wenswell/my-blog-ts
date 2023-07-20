// user.model.ts

import mongoose from 'mongoose'

// 1. 定义 User 接口
export interface User {
  name: string
  age: number
}

// 2. 定义 User 文档 Schema
const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
})

// 3. 生成 User 模型
const UserModel = mongoose.model<User>('User', userSchema)

// 4. 封装 CRUD 操作

// 创建用户
const createUser = (user: User) => {
  return UserModel.create(user)
}

// 查找用户
const findUserById = (id: string) => {
  return UserModel.findById(id)
}

// 查找所有用户
const findAllUsers = () => {
  return UserModel.find()
}

// 更新用户
const updateUser = (id: string, user: User) => {
  return UserModel.findByIdAndUpdate(id, user)
}

// 删除用户
const deleteUser = (id: string) => {
  return UserModel.findByIdAndDelete(id)
}

export const user = {
  createUser,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
}
