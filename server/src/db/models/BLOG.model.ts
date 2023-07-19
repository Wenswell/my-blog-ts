import { Schema, model, Document, ObjectId, FilterQuery } from 'mongoose'
import { genBlogId } from '@/utils/genid'
import { updateTagByTagNameList } from './TAG.model'
import { updateCategByCategName } from './CATEGORY.model'
import { failure } from '@/utils/error'

// 1. 定义接口
export interface Blog extends Document {
  id: string
  title: string
  description: string
  categoryName: string
  tagNameList: string[]
  content: string
  postAt: Date
  editAt: Date
  descImg: string
}

// 2. 定义Schema
const blogSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, unique: true, maxLength: 30 },
  description: { type: String, required: true, maxLength: 200 },
  categoryName: { type: String, default: '无' },
  tagNameList: [{ type: String }],
  content: { type: String, required: true },
  postAt: { type: Date, default: Date.now },
  editAt: { type: Date },
  descImg: String,
})

// 3. 生成模型
export const Blog = model<Blog>('Blog', blogSchema)

// 4. 封装CRUD操作

// 获取博客列表
type BlogSortFields = 'title' | 'postAt' | 'editAt'

interface GetBlogsOptions {
  query?: FilterQuery<Blog> // 查询条件
  keyword?: string // 搜索关键词
  page?: number
  limit?: number
  sort?: BlogSortFields // 排序字段
  order?: 1 | -1 // 排序顺序 1 升序 -1 降序
}

const getBlogs = async ({
  keyword,
  sort = 'editAt', // 默认排序字段
  order = -1, // 默认降序
  page = 1,
  limit = 10,
}: GetBlogsOptions) => {
  // 构建查询条件
  let findQuery: FilterQuery<Blog> = {}
  if (keyword) {
    findQuery = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ],
    }
  }

  const sortQuery =
    sort === 'editAt' ? { postAt: order, editAt: order } : { [sort]: order }

  const skip = (page - 1) * limit
  const totalCount = await Blog.countDocuments(findQuery)

  const blogs = await Blog.find(findQuery, { _id: 0, __v: 0, content: 0 })
    .sort(sortQuery) // 添加排序
    .skip(skip)
    .limit(limit)

  const totalPages = Math.ceil(totalCount / limit)
  return { blogs, totalCount, totalPages }
}

// 根据ID获取博客
const getBlogById = async (id: string) => {
  return Blog.findOne({ id })
}

// 新增博客
const addBlog = async (params: {
  title: string
  description: string
  categoryName: string
  tagNameList: string[]
  content: string
  descImg?: string
}) => {
  const newBlog = new Blog({
    id: genBlogId(),
    title: params.title,
    description: params.description,
    categoryName: params.categoryName,
    tagNameList: params.tagNameList,
    content: params.content,
    postAt: new Date(),
    descImg: params.descImg,
  })

  await updateTagByTagNameList(
    newBlog._id as ObjectId,
    newBlog.tagNameList,
    false,
  )

  await updateCategByCategName(
    newBlog._id as ObjectId,
    newBlog.categoryName,
    false,
  )

  return newBlog.save()
}

// 更新博客
const updateBlogById = async ({
  id,
  update,
}: {
  id: string
  update: Partial<Blog>
}) => {
  // 1. 查找原博客
  const blog = await Blog.findOne({ id })
  if (!blog) {
    failure.cantFindById({ type: 'blog', id })
    return
  }

  if (update.tagNameList) {
    // 2. 对比新旧tagNameList
    const oldTags = blog.tagNameList
    const newTags = update.tagNameList
    const oldCategName = blog.categoryName
    const newCategName = update.categoryName ? update.categoryName : ''
    // 3. 计算差集
    const toAddTagList = newTags.filter((t) => !oldTags.includes(t))
    const toRemoveTagList = oldTags.filter((t) => !newTags.includes(t))
    // 4. 更新Tag collection
    if (oldCategName !== newCategName) {
      await updateCategByCategName(blog._id as ObjectId, newCategName, false)
      await updateCategByCategName(blog._id as ObjectId, oldCategName, true)
    }
    await updateTagByTagNameList(blog._id as ObjectId, toAddTagList, false)
    await updateTagByTagNameList(blog._id as ObjectId, toRemoveTagList, true)
  }
  // 5. 更新博客
  update.editAt = new Date()

  // 6. 返回
  return Blog.updateOne({ id }, update)
}

// 删除博客
const deleteBlogById = async (id: string) => {
  // const blog = await Blog.findOneAndDelete({ id });
  const blog = await Blog.findOne({ id })
  if (!blog) {
    failure.cantFindById({ type: 'blog', id })
    return
  }

  await updateTagByTagNameList(blog._id as ObjectId, blog.tagNameList, true)

  return Blog.deleteOne({ id })
}

export const DBblog = {
  getBlogs,
  getBlogById,
  addBlog,
  updateBlogById,
  deleteBlogById,
}
