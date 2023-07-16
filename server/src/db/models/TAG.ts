import { genTagId } from '@/utils/genid';
import { Schema, model, Document, ObjectId } from 'mongoose';
import { Blog } from './BLOG';

export interface Tag extends Document {
  id: string;
  tagName: string;
  blogs: Blog[]; // 添加虚拟属性类型
  count: number;
  createAt: Date;
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

const Tag = model<Tag>('tag', tagSchema);


export const getBlogsByTagName = async (tagName: string) => {
  const tag = await Tag.findOne({ tagName }).populate('blogs');
  return tag.blogs;
};

export const getAllTag = async () => {
  return Tag.find({});
};

export const addTag = (newName: string) => {
  const newTag = new Tag({
    id: genTagId(),
    tagName: newName,
    createAt: new Date(),
  });
  return newTag.save();
};

export const updateTagById = async (
  id: string,
  newName: string,
) => {
  return Tag.findOneAndUpdate({ id }, { tagName: newName }, { new: true });
};

export const deleteTagById = async (id: string) => {
  return Tag.findOneAndDelete({ id });
};

export function updateTagByTagNameList(BlogObjectId: ObjectId, tagNameList: string[], isRemove: boolean): void {
  if (!tagNameList.length) return;

  tagNameList.forEach(async tagName => {
    if (isRemove === false) {
      const hasTag = await Tag.findOne({ tagName }, { tagName: 1 });
      if (!hasTag) await addTag(tagName);
    }

    const ops = isRemove
      ? { $pull: { blogList: BlogObjectId }, $inc: { count: -1 } }
      : { $addToSet: { blogList: BlogObjectId }, $inc: { count: 1 } };
    await Tag.updateOne({ tagName }, ops);

  });

}