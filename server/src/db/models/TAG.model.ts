import { failure } from '@/utils/error'
import { genTagId } from '@/utils/genid'
import { Schema, model, Document, ObjectId, Types } from 'mongoose'
import { AnBlog, Blog } from './BLOG.model'

export interface AnTag extends Document {
  id: string
  tagName: string
  blogs: AnBlog[] // 添加虚拟属性类型
  count: number
  createdAt: Date
  blogList: Types.ObjectId[]
  updateBlogsTag: (oldName: string, newName: string) => Promise<void>
  deleteBlogsTag: (oldName: string) => Promise<void>
}

const tagSchema = new Schema({
  id: { type: String, required: true, unique: true },
  tagName: { type: String, required: true, unique: true, maxLength: 30 },
  count: { type: Number, default: 0 },
  blogList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
  createdAt: { type: Date, default: new Date() },
})

tagSchema.virtual('blogs', {
  ref: 'Blog',
  localField: 'blogList',
  foreignField: '_id',
})

tagSchema.methods.updateBlogsTag = async function (
  this: AnTag,
  oldName: string,
  newName: string,
) {
  const blogs = await Blog.find({
    _id: { $in: this.blogList },
  })

  console.log('blogs', blogs.length)
  for (const blog of blogs) {
    blog.tagNameList = blog.tagNameList.map((name) => {
      if (name === oldName) {
        return newName
      }
      return name
    })
    await blog.save()
  }
}

tagSchema.methods.deleteBlogsTag = async function (
  this: AnTag,
  oldName: string,
) {
  const blogs = await Blog.find({
    _id: { $in: this.blogList },
  })

  for (const blog of blogs) {
    await updateTagByTagNameList(blog._id as ObjectId, [oldName], true)

    blog.tagNameList = blog.tagNameList.filter((name) => name !== oldName)

    await blog.save()
  }
}

const Tag = model<AnTag>('tag', tagSchema)

const getBlogsByName = async (tagName: string) => {
  const tag = await Tag.findOne({ tagName }).populate('blogs')
  console.log('tag', tag)
  if (!tag) {
    failure.cantFindByField({ type: 'tag', id: tagName, field: 'tagName' })
    return
  }
  return tag.blogs
}

const findAll = async () => {
  return Tag.find({}, { _id: 0, id: 1, tagName: 1, count: 1 })
}

const addOne = (newName: string) => {
  const newTag = new Tag({
    id: genTagId(),
    tagName: newName,
    createdAt: new Date(),
  })
  return newTag.save()
}

const updateOneById = async ({
  id,
  newName,
}: {
  id: string
  newName: string
}) => {
  const findTag = await Tag.findOne({ id })
  if (!findTag) {
    failure.cantFindByField({ type: 'tag', id, field: 'id' })
    return
  }

  const updatedTag = await Tag.findOneAndUpdate(
    { id },
    { tagName: newName },
    { new: true },
  )

  if (!updatedTag) throw 'findOneAndUpdate failed'

  await updatedTag.updateBlogsTag(findTag.tagName, newName)

  const { id: tagId, tagName } = updatedTag as { id: string; tagName: string }

  return { id: tagId, tagName, oldName: findTag?.tagName }
}

const deleteTagById = async (id: string) => {
  const findTag = await Tag.findOne({ id })
  if (!findTag) {
    failure.cantFindByField({ type: 'tag', id, field: 'id' })
    return
  }

  const deletedTag = await Tag.findOneAndDelete({ id }, { new: true })

  if (!deletedTag) throw 'findOneAndDelete failed'

  await deletedTag.deleteBlogsTag(findTag.tagName)

  return deletedTag
}

export async function updateTagByTagNameList(
  BlogObjectId: ObjectId,
  tagNameList: string[],
  isRemove: boolean,
): Promise<void> {
  if (!tagNameList.length) return

  for (const tagName of tagNameList) {
    if (isRemove === false) {
      const hasTag = await Tag.findOne({ tagName }, { tagName: 1 })
      if (!hasTag) await addOne(tagName)
    }

    const ops = isRemove
      ? { $pull: { blogList: BlogObjectId }, $inc: { count: -1 } }
      : { $addToSet: { blogList: BlogObjectId }, $inc: { count: 1 } }
    await Tag.updateOne({ tagName }, ops)
  }
}

export const DBtag = {
  getBlogsByName,
  findAll,
  addOne,
  updateOneById,
  deleteTagById,
}
