import { failure } from '@/utils/error';
import { genTagId } from '@/utils/genid';
import { Schema, model, Document, ObjectId, Types } from 'mongoose';
import { Blog } from './BLOG.model';

export interface Tag extends Document {
  id: string;
  tagName: string;
  blogs: Blog[]; // 添加虚拟属性类型
  count: number;
  createAt: Date;
  blogList: Types.ObjectId[];
  updateBlogsTag: (oldName: string, newName: string) => Promise<void>;
  deleteBlogsTag: (oldName: string) => Promise<void>;
}

const tagSchema = new Schema({
  id: { type: String, required: true, unique: true },
  tagName: { type: String, required: true, unique: true, maxLength: 30 },
  count: { type: Number, default: 0 },
  blogList: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog',
  }],
  createAt: { type: Date, default: new Date() },
});

tagSchema.virtual('blogs', {
  ref: 'Blog',
  localField: 'blogList',
  foreignField: '_id',
});

tagSchema.methods.updateBlogsTag =
  async function (this: Tag, oldName: string, newName: string) {

    const blogs = await Blog.find({
      _id: { $in: this.blogList },
    });

    console.log('blogs', blogs.length);
    blogs.forEach(async blog => {
      blog.tagNameList = blog.tagNameList.map(name => {
        if (name === oldName) {
          return newName;
        }
        return name;
      });
      await blog.save();
    });

  };

tagSchema.methods.deleteBlogsTag =
  async function (this: Tag, oldName: string) {

    const blogs = await Blog.find({
      _id: { $in: this.blogList },
    });

    blogs.forEach(async blog => {

      await updateTagByTagNameList(blog._id as ObjectId, [oldName], true);

      blog.tagNameList = blog.tagNameList.filter(name => name !== oldName);

      await blog.save();
    });

  };


const Tag = model<Tag>('tag', tagSchema);


const getBlogsByTagName = async (tagName: string) => {
  const tag = await Tag.findOne({ tagName }).populate('blogs');
  return tag.blogs;
};

const getAllTag = async () => {
  return Tag.find({}, { _id: 0, id: 1, tagName: 1, count: 1 });
};

const addTag = (newName: string) => {
  const newTag = new Tag({
    id: genTagId(),
    tagName: newName,
    createAt: new Date(),
  });
  return newTag.save();
};

const updateTagById = async (
  { id, newName }: { id: string, newName: string, },
) => {

  const findTag = await Tag.findOne({ id });
  if (!findTag) failure.cantFindById({ type: 'tag', id });

  const updatedTag = await Tag.findOneAndUpdate(
    { id }, { tagName: newName }, { new: true });

  await updatedTag.updateBlogsTag(findTag.tagName, newName);

  const { id: tagId, tagName } = updatedTag as { id: string, tagName: string };

  return { id: tagId, tagName, oldName: findTag.tagName };
};

const deleteTagById = async (id: string) => {
  const findTag = await Tag.findOne({ id });
  if (!findTag) failure.cantFindById({ type: 'tag', id });

  const deletedTag = await Tag.findOneAndDelete(
    { id }, { new: true });

  await deletedTag.deleteBlogsTag(findTag.tagName);

  return deletedTag;
};

export async function updateTagByTagNameList(
  BlogObjectId: ObjectId, tagNameList: string[], isRemove: boolean,
): Promise<void> {
  if (!tagNameList.length) return;

  for (const tagName of tagNameList) {
    if (isRemove === false) {
      const hasTag = await Tag.findOne({ tagName }, { tagName: 1 });
      if (!hasTag) await addTag(tagName);
    }

    const ops = isRemove
      ? { $pull: { blogList: BlogObjectId }, $inc: { count: -1 } }
      : { $addToSet: { blogList: BlogObjectId }, $inc: { count: 1 } };
    await Tag.updateOne({ tagName }, ops);
  }
}

export const DBtag = {
  getBlogsByTagName,
  getAllTag,
  addTag,
  updateTagById,
  deleteTagById,
};