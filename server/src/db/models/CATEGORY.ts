import { genCategoryId } from '@/utils/genid';
import { Schema, model, Document, ObjectId } from 'mongoose';
import { Blog } from './BLOG';

export interface Category extends Document {
  id: string;
  categoryName: string;
  blogs: Blog[]; // 添加虚拟属性类型
  count: number;
  createAt: Date;
}

const categorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  categoryName: { type: String, required: true, unique: true, maxLength: 30 },
  count: { type: Number, default: 0 },
  blogList: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog',
  }],
  createAt: { type: Date, default: new Date() },
});


categorySchema.virtual('blogs', {
  ref: 'Blog',
  localField: 'blogList',
  foreignField: '_id',
});

const Category = model<Category>('Category', categorySchema);

export const addCateg = (newName: string) => {
  const newCateg = new Category({
    id: genCategoryId(),
    categoryName: newName,
    createAt: new Date(),
  });
  return newCateg.save();
};

export const getAllCateg = async () => {
  return Category.find({});
};

export const updateCategById = async (
  id: string,
  newName: string,
) => {
  return Category.findOneAndUpdate({ id }, { categoryName: newName }, { new: true });
};

export const deleteCategById = async (id: string) => {
  return Category.findOneAndDelete({ id });
};


export async function updateCategByCategName(BlogObjectId: ObjectId, categoryName: string, isRemove: boolean): Promise<void> {
  if (!categoryName) return;

  if (isRemove === false) {
    const hasTag = await Category.findOne({ categoryName }, { categoryName: 1 });
    if (!hasTag) await addCateg(categoryName);
  }

  const ops = isRemove
    ? { $pull: { blogList: BlogObjectId }, $inc: { count: -1 } }
    : { $addToSet: { blogList: BlogObjectId }, $inc: { count: 1 } };
  await Category.updateOne({ categoryName }, ops);

}