// user.model.ts

import { failure } from '@/utils/error'
import { genUserId } from '@/utils/genid'
import mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

// 1. 定义 User 接口
export interface AnUser extends Document {
  id: string
  account: string
  // password: string
  hash: string
  createdAt: Date
  updatedAt: Date
  role: number
  loginHistory: Login[]
  updateLoginHistory: () => Promise<void>
}

export interface UpdateAnUser {
  account: string
  password: string
  hash: string
  updatedAt: Date
  // role: number
}

interface Login {
  time: Date
}

// 2. 定义 User 文档 Schema
const userSchema = new mongoose.Schema<AnUser>({
  id: { type: String, required: true },
  account: { type: String, required: true },
  // password: { type: String, required: true },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
  role: { type: Number, default: 0 },
  loginHistory: [
    {
      time: { type: Date, default: new Date() },
    },
  ],
})
userSchema.methods.updateLoginHistory = async function (this: AnUser) {
  console.log('this', this)

  const User = await UserModel.findOne({ id: this.id })

  if (User) {
    User.loginHistory.unshift({ time: new Date() })

    if (User.loginHistory.length > 10) {
      User.loginHistory.pop()
    }

    await User.save()
  }
  // await this.save();
}

// 3. 生成 User 模型
const UserModel = mongoose.model<AnUser>('User', userSchema)

UserModel.findOne({ id: '1' })
  .then(async (res) => {
    if (!res)
      await new UserModel({
        id: '1',
        account: 'admin',
        // password: 'passwd',
        hash: await bcrypt.hash('passwd', 10),
        createdAt: new Date(0),
        role: 1,
      }).save()
  })
  .catch((err) => {
    console.log(err)
  })

// 4. 封装 CRUD 操作

// 创建用户
async function addOne(user: { account: string; password: string }) {
  const newUser = new UserModel({
    id: genUserId(),
    account: user.account,
    // password: user.password,
    hash: await bcrypt.hash(user.password, 10),
    createdAt: new Date(),
    role: 0,
  })

  const findUser = await UserModel.findOne({ account: user.account })
  if (findUser) {
    failure.alreadyExists({ type: 'user', name: user.account })
    return
  }

  return UserModel.create(newUser)
}

// 查找用户
async function findOneById(id: string) {
  const user = await UserModel.findOne(
    { id },
    {
      password: 0,
      _id: 0,
      __v: 0,
      // id: 0,
      // account: 0,
      // createdAt: 0,
      // updatedAt: 0,
      // role: 0,
    },
  )
  if (!user) {
    failure.cantFindByField({ type: 'user', id, field: 'id' })
    return
  }

  return user
}

async function findOneByAccount(account: string) {
  const user = await UserModel.findOne(
    { account },
    {
      password: 0,
      _id: 0,
      __v: 0,
      // id: 0,
      // account: 0,
      // createdAt: 0,
      // updatedAt: 0,
      // role: 0,
    },
  )
  if (!user) {
    failure.cantFindByField({ type: 'user', id: account, field: 'account' })
    return
  }

  return user
}

// 验证账号密码
async function findAndVerifyPasswd(info: {
  account: string
  password: string
}) {
  const { account, password } = info

  const findUser = (await UserModel.findOne({ account })) as AnUser
  if (!findUser) {
    failure.cantFindByField({ type: 'user', id: account, field: 'account' })
    return
  }

  const isValid = await bcrypt.compare(password, findUser.hash)

  if (!isValid) {
    failure.passowrdInvaild({ account })
    return
  }

  await findUser.updateLoginHistory()

  return {
    id: findUser.id,
    account: findUser.account,
    role: findUser.role,
  }
}

// 查找所有用户
function findAll() {
  const users = UserModel.find(
    {},
    {
      password: 0,
      _id: 0,
      __v: 0,
      // id: 0,
      // account: 0,
      createdAt: 0,
      updatedAt: 0,
      // role: 0,
    },
  )

  return users
}

// 更新用户
async function updateOneById({
  id,
  update,
}: {
  id: string
  update: Partial<UpdateAnUser>
}) {
  const user = await UserModel.findOne({ id })
  if (!user) {
    failure.cantFindByField({ type: 'user', id, field: 'id' })
    return
  }

  if (update.password) {
    update.hash = await bcrypt.hash(update.password, 10)
  }

  update.updatedAt = new Date()

  return UserModel.updateOne({ id }, update)
}

// 删除用户
async function deleteOneById(id: string) {
  const user = await UserModel.findOne({ id })
  if (!user) {
    failure.cantFindByField({ type: 'user', id, field: 'id' })
    return
  }
  return UserModel.deleteOne({ id })
}

export const DBuser = {
  addOne,
  findOneById,
  findOneByAccount,
  findAll,
  updateOneById,
  deleteOneById,
  findAndVerifyPasswd,
}
