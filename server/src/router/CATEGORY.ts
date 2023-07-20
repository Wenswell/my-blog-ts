import { DBcateg } from '@/db/models/CATEGORY.model'
import { send } from '@/utils/sendRes'
import { Router } from 'express'
import Joi from 'joi'
import asyncHandler from 'express-async-handler'

const AddCategSchema = Joi.object({
  categoryName: Joi.string().required().min(2).max(30),
})
const GetBlogSchema = Joi.object({
  categoryName: Joi.string().required().min(1).max(30),
  page: Joi.number().min(1),
})

const UpdateCategSchema = Joi.object({
  id: Joi.string().required(),
  categoryName: Joi.string().required().min(2).max(30),
})

const DeleteCategSchema = Joi.object({
  id: Joi.string().required(),
})

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const asdfasdfasg = await DBcateg.getAllCateg()

    await send.isSuccess(res, asdfasdfasg)
  }),
)

// 缓存容量上限
const MAX_CACHE_SIZE = 100

// 查询结果缓存
const cacheMap = new Map<string, object>()

// 缓存key集合,用于记录缓存访问顺序
const cacheKeySet = new Set()

const limit = 10
router.get(
  '/blogs',
  asyncHandler(async (req, res) => {
    const verifiedResult = GetBlogSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    interface FindBlog {
      categoryName: string
      page?: number
    }

    const categoryName = (verifiedResult.value as FindBlog).categoryName
    const page = (verifiedResult.value as FindBlog)?.page || 1

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
    const cacheKey = `${categoryName}`
    try {
      // 查找缓存
      if (cacheMap.has(cacheKey)) {
        // 命中缓存,把key移到set头部
        cacheKeySet.delete(cacheKey)
        cacheKeySet.add(cacheKey)
        const cacheResult = cacheMap.get(cacheKey) as ResultType
        reresult = cacheResult
      } else {
        // 未命中,查询数据库
        const blogs = (await DBcateg.getBlogsByCategName(categoryName)) as []

        // const result = await DBblog.getBlogs(find)
        const totalCount = blogs.length
        const totalPages = Math.ceil(totalCount / limit)

        reresult = { blogs, totalCount, totalPages }

        // 添加新的缓存
        cacheMap.set(cacheKey, reresult)
        cacheKeySet.add(cacheKey)
      }

      // 如果缓存满了,移除最近最少使用的
      if (cacheKeySet.size > MAX_CACHE_SIZE) {
        const oldestKey = cacheKeySet.keys().next().value as string
        cacheMap.delete(oldestKey)
        cacheKeySet.delete(oldestKey)
      }

      // 计算当前页的起始索引和结束索引
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      // 获取当前页的 blogs 数据
      const currentBlogs = reresult.blogs.slice(startIndex, endIndex)

      await send.isSuccess(res, {
        ...reresult,
        currentPage: page,
        blogs: currentBlogs,
      })
    } catch (error) {
      send.isCantFindByIdError(res, error as object)
      return
    }
  }),
)

router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const verifiedResult = AddCategSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { categoryName: addCategoryName } = verifiedResult.value as {
      categoryName: string
    }
    try {
      const { id, categoryName } = (await DBcateg.addCateg(
        addCategoryName,
      )) as {
        id: string
        categoryName: string
      }

      await send.isSuccess(res, { id, categoryName })
    } catch (error) {
      send.isMongoError(res, error as object)
      return
    }
  }),
)

router.put(
  '/update',
  asyncHandler(async (req, res) => {
    const verifiedResult = UpdateCategSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id: updateCategoryId, categoryName: updateCategoryName } =
      verifiedResult.value as { id: string; categoryName: string }
    try {
      const updateResult = await DBcateg.updateCategById({
        id: updateCategoryId,
        newName: updateCategoryName,
      })

      await send.isSuccess(res, updateResult)
    } catch (error) {
      send.isCantFindByIdError(res, error as object)
      return
    }
  }),
)

router.delete(
  '/delete',
  asyncHandler(async (req, res) => {
    const verifiedResult = DeleteCategSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id: deleteCategId } = verifiedResult.value as { id: string }
    try {
      // const huioadfgyihou = await DBcateg.deleteCategById(deleteCategId);

      const { id, categoryName } = (await DBcateg.deleteCategById(
        deleteCategId,
      )) as {
        id: string
        categoryName: string
      }

      // await send.isSuccess(res, { huioadfgyihou });
      await send.isSuccess(res, {
        deletedId: id,
        deletedCategoryName: categoryName,
      })
    } catch (error) {
      send.isCantFindByIdError(res, error as object)
      return
    }
  }),
)

export default router
