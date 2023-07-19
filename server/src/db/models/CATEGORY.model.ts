import { failure } from '@/utils/error'
import { genCategoryId } from '@/utils/genid'
import { Schema, model, Document, ObjectId, Types } from 'mongoose'
import { Blog } from './BLOG.model'

export interface Category extends Document {
  id: string
  categoryName: string
  blogs: Blog[] // 添加虚拟属性类型
  count: number
  createAt: Date
  blogList: Types.ObjectId[]
  updateBlogsCategory: (name: string) => Promise<void>
  deleteBlogsCategory: () => Promise<void>
}

const categorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  categoryName: { type: String, required: true, unique: true, maxLength: 30 },
  count: { type: Number, default: 0 },
  blogList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
  createAt: { type: Date, default: new Date() },
})

categorySchema.virtual('blogs', {
  ref: 'Blog',
  localField: 'blogList',
  foreignField: '_id',
})

categorySchema.methods.updateBlogsCategory = async function (
  this: Category,
  newName: string,
) {
  // 根据blogList查询Blog
  const blogs = await Blog.find({
    _id: { $in: this.blogList },
  })

  // 更新所有blog的categoryName
  for (const blog of blogs) {
    blog.categoryName = newName
    await blog.save()
  }
}

categorySchema.methods.deleteBlogsCategory = async function (this: Category) {
  // 根据blogList查询Blog
  const blogs = await Blog.find({
    _id: { $in: this.blogList },
  })

  // 更新所有blog的categoryName
  for (const blog of blogs) {
    await updateCategByCategName(blog._id as ObjectId, '无', false)
    await updateCategByCategName(blog._id as ObjectId, this.categoryName, true)

    blog.categoryName = '无'
    await blog.save()
  }
}
const Category = model<Category>('Category', categorySchema)

Category.findOne({ id: '-1' })
  .then(async (res) => {
    if (!res)
      await new Category({
        id: '-1',
        categoryName: '无',
        createAt: new Date(0),
      }).save()
  })
  .catch((err) => {
    console.log(err)
  })

const addCateg = (newName: string) => {
  const newCateg = new Category({
    id: genCategoryId(),
    categoryName: newName,
    createAt: new Date(),
  })
  return newCateg.save()
}

const getAllCateg = async () => {
  return Category.find({}, { _id: 0, id: 1, categoryName: 1, count: 1 })
}

const updateCategById = async ({
  id,
  newName,
}: {
  id: string
  newName: string
}) => {
  const categ = await Category.findOne({ id })
  if (!categ || id == '-1') failure.cantFindById({ type: 'category', id })

  const updatedCateg = await Category.findOneAndUpdate(
    { id },
    { categoryName: newName },
    { new: true },
  )

  if (!updatedCateg) throw 'findOneAndUpdate failed'

  await updatedCateg.updateBlogsCategory(newName)

  const { id: categId, categoryName } = updatedCateg as {
    id: string
    categoryName: string
  }

  return { id: categId, categoryName, oldName: categ?.categoryName }
}

const deleteCategById = async (id: string) => {
  const categ = await Category.findOne({ id })
  if (!categ || id == '-1') failure.cantFindById({ type: 'category', id })

  const deletedCateg = await Category.findOneAndDelete({ id }, { new: true })

  if (!deletedCateg) throw 'findOneAndDelete failed'

  await deletedCateg.deleteBlogsCategory()

  return deletedCateg
}

export async function updateCategByCategName(
  BlogObjectId: ObjectId,
  categoryName: string,
  isRemove: boolean,
): Promise<void> {
  if (!categoryName) return

  if (isRemove === false && categoryName !== '无') {
    const hasTag = await Category.findOne({ categoryName }, { categoryName: 1 })
    console.log('hasTag', hasTag)
    if (!hasTag) await addCateg(categoryName)
  }

  const ops = isRemove
    ? { $pull: { blogList: BlogObjectId }, $inc: { count: -1 } }
    : { $addToSet: { blogList: BlogObjectId }, $inc: { count: 1 } }
  await Category.updateOne({ categoryName }, ops)
}

export const DBcateg = {
  addCateg,
  getAllCateg,
  updateCategById,
  deleteCategById,
}
