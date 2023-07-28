import { DBblog } from '@/db/models/BLOG.model'
import { send } from '@/utils/sendRes'
import { Router } from 'express'
import Joi from 'joi'
import asyncHandler from 'express-async-handler'

const AddBlogSchema = Joi.object({
  title: Joi.string().required().min(2).max(30),
  description: Joi.string().required().max(200),
  categoryName: Joi.string().min(2).max(30),
  tagNameList: Joi.array().items(Joi.string().min(2)),
  content: Joi.string().required(),
  descImg: Joi.string(),
})

const UpdateBlogSchema = Joi.object({
  id: Joi.string().length(10).required(),
  title: Joi.string().min(2).max(30),
  description: Joi.string().max(200),
  categoryName: Joi.string(),
  tagNameList: Joi.array().items(Joi.string()),
  content: Joi.string(),
  descImg: Joi.string(),
})

const BlogIdSchema = Joi.object({
  id: Joi.string().length(10).required(),
})

interface AddBlog {
  title: string
  description: string
  categoryName: string
  tagNameList: string[]
  content: string
  descImg?: string
}

interface UpdateBlog {
  value: {
    id: string
    title: string
    description: string
    content: string
    // ...
  }
}

const router = Router()

// 缓存容量上限
const MAX_CACHE_SIZE = 100

// 查询结果缓存
const cacheMap = new Map<string, object>()

// 缓存key集合,用于记录缓存访问顺序
const cacheKeySet = new Set()

function clearCache() {
  cacheKeySet.clear()
  cacheMap.clear()
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    // 确保tagNameList是数组
    let tagNameList: string[] = []
    if (Array.isArray(req.query.tagNameList)) {
      // 确保数组不为空
      if (req.query.tagNameList.length > 0) {
        tagNameList = req.query.tagNameList as string[]
      }
    }

    const keyword: string = req.query.keyword ? String(req.query.keyword) : ''
    const categoryName: string = req.query.categoryName
      ? String(req.query.categoryName)
      : ''
    // const tagNameList: string[] = req.query.tagNameList as Array<string> ? req.query.tagNameList as string[] : [];
    const page: number = Number(req.query.page) || 1
    const limit: number = Number(req.query.limit) || 10

    enum SortFields {
      TITLE = 'title',
      POST_AT = 'postAt',
      EDIT_AT = 'editAt',
    }
    let sort = req.query.sort as SortFields

    if (!Object.values(SortFields).includes(sort)) {
      sort = SortFields.EDIT_AT
    }

    enum Order {
      ASC = 1,
      DESC = -1,
    }
    // 统一转为大写
    const orderQuery = (req.query.order as string)?.toUpperCase()
    // 映射为枚举
    const order = Order[orderQuery as keyof typeof Order] || Order.DESC

    const find = {
      keyword,
      categ: categoryName,
      tags: tagNameList,
      page,
      limit,
      sort,
      order,
    }
    console.log('find', find)

    interface ResultType {
      blogs: []
      totalCount: number
      totalPages: number
    }

    let reresult: ResultType = {
      blogs: [],
      totalCount: 0,
      totalPages: 0,
    }

    // 生成缓存key
    const cacheKey = `${keyword}-${categoryName}-${tagNameList.join(
      '-',
    )}-${page}`
    // const cacheKey = `${keyword}`

    // 查找缓存
    console.log('cacheMap', cacheMap.keys())
    if (cacheMap.has(cacheKey)) {
      // 命中缓存,把key移到set头部
      cacheKeySet.delete(cacheKey)
      cacheKeySet.add(cacheKey)
      const cacheResult = cacheMap.get(cacheKey) as ResultType
      reresult = cacheResult
    } else {
      // 未命中,查询数据库
      const result = await DBblog.findAll(find)

      reresult = result as ResultType

      // 添加新的缓存
      cacheMap.set(cacheKey, result)
      cacheKeySet.add(cacheKey)
    }

    // 如果缓存满了,移除最近最少使用的
    if (cacheKeySet.size > MAX_CACHE_SIZE) {
      const oldestKey = cacheKeySet.keys().next().value as string
      cacheMap.delete(oldestKey)
      cacheKeySet.delete(oldestKey)
    }

    const { blogs, totalCount, totalPages } = reresult

    await send.isSuccess(res, {
      currentPage: page,
      totalCount,
      totalPages,
      blogs,
    })
  }),
)

router.get(
  '/detail',
  asyncHandler(async (req, res) => {
    const verifiedResult = BlogIdSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const id: string = (verifiedResult.value as { id: string }).id

    try {
      const rrres = (await DBblog.findOneById(id)) as object

      await send.isSuccess(res, rrres)
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

router.post(
  '/add',
  asyncHandler(async (req, res) => {
    // const {
    //   title, description, categoryName, tagNameList, content, descImg
    // } = req.body as AddBlog;

    const verifiedResult = AddBlogSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)
      return
    }
    try {
      const { id } = (await DBblog.addOne(verifiedResult.value as AddBlog)) as {
        id: string
      }

      await send.isSuccess(res, { id })
    } catch (error) {
      send.isMongoError(res, error as object)
      return
    }
  }),
)

router.put(
  '/update',
  asyncHandler(async (req, res) => {
    const verifiedResult = UpdateBlogSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id, ...rest } = verifiedResult.value as UpdateBlog['value']
    const upppp = { id, update: { ...rest } }
    try {
      const { acknowledged, matchedCount, modifiedCount } =
        (await DBblog.updateOneById(upppp)) as {
          acknowledged: boolean
          matchedCount: number
          modifiedCount: number
        }
      if (acknowledged && modifiedCount) {
        cacheKeySet.clear()
        cacheMap.clear()
        await send.isSuccess(res, { id })
      } else {
        send.isError(res, {
          acknowledged,
          matchedCount,
          modifiedCount,
        })
      }
    } catch (error) {
      send.isError(res, error as object)
      return
    }
  }),
)

router.delete(
  '/delete',
  asyncHandler(async (req, res) => {
    const verifiedResult = BlogIdSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const id: string = (verifiedResult.value as { id: string }).id

    try {
      const { acknowledged, deletedCount } = (await DBblog.deleteOneById(
        id,
      )) as {
        acknowledged: boolean
        deletedCount: number
      }

      if (acknowledged && deletedCount) {
        cacheKeySet.clear()
        cacheMap.clear()
        await send.isSuccess(res, { deletedId: id })
      }
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

export { clearCache }

export default router
