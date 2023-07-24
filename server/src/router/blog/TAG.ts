import { DBtag } from '@/db/models/TAG.model'
import { send } from '@/utils/sendRes'
import { Router } from 'express'
import Joi from 'joi'
import asyncHandler from 'express-async-handler'

const AddTagSchema = Joi.object({
  tagName: Joi.string().required().min(2).max(30),
})
const GetBlogSchema = Joi.object({
  tagName: Joi.string().required().min(1).max(30),
  page: Joi.number().min(1),
})

const UpdateTagSchema = Joi.object({
  id: Joi.string().length(6).required(),
  tagName: Joi.string().required().min(2).max(30),
})

const DeleteTagSchema = Joi.object({
  id: Joi.string().length(6).required(),
})

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const asdfasdfasg = await DBtag.findAll()
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
      tagName: string
      page?: number
    }

    const tagName = decodeURIComponent(
      (verifiedResult.value as FindBlog).tagName,
    )
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
    const cacheKey = `${tagName}`
    try {
      // 查找缓存
      console.log('cacheMap', cacheMap)
      console.log('cacheMap.has(cacheKey)', cacheMap.has(cacheKey))
      if (cacheMap.has(cacheKey)) {
        // 命中缓存,把key移到set头部
        cacheKeySet.delete(cacheKey)
        cacheKeySet.add(cacheKey)
        const cacheResult = cacheMap.get(cacheKey) as ResultType
        reresult = cacheResult
      } else {
        // 未命中,查询数据库
        const blogs = (await DBtag.getBlogsByName(tagName)) as []

        // const result = await DBblog.findAll(find)
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
      send.isCustomError(res, error as object)
      return
    }
  }),
)

router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const verifiedResult = AddTagSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { tagName: addOneName } = verifiedResult.value as { tagName: string }
    try {
      const { id, tagName } = (await DBtag.addOne(addOneName)) as {
        id: string
        tagName: string
      }

      await send.isSuccess(res, { id, tagName })
    } catch (error) {
      send.isMongoError(res, error as object)
      return
    }
  }),
)

router.put(
  '/update',
  asyncHandler(async (req, res) => {
    const verifiedResult = UpdateTagSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id: updateTagId, tagName: updateTagName } =
      verifiedResult.value as { id: string; tagName: string }
    try {
      const updateResult = await DBtag.updateOneById({
        id: updateTagId,
        newName: updateTagName,
      })

      if (!updateResult) throw 'updateOneById failed'

      await send.isSuccess(res, updateResult)
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

router.delete(
  '/delete',
  asyncHandler(async (req, res) => {
    const verifiedResult = DeleteTagSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id: deleteTagId } = verifiedResult.value as { id: string }
    try {
      const { id, tagName } = (await DBtag.deleteTagById(deleteTagId)) as {
        id: string
        tagName: string
      }

      await send.isSuccess(res, { deletedId: id, deletedTagName: tagName })
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

export default router
