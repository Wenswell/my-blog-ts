import { Schema, model, Document, ObjectId } from 'mongoose';
import { genBlogId } from '@/utils/genid';
import { updateTagByTagNameList } from './TAG';
import { updateCategByCategName } from './CATEGORY';

// 1. 定义接口
export interface Blog extends Document {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  tagNameList: string[];
  content: string;
  postAt: Date;
  editAt: Date;
  descImg: string;
}

// 2. 定义Schema
const blogSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, unique: true, maxLength: 30 },
  description: { type: String, required: true, maxLength: 200 },
  categoryName: { type: String, required: true },
  tagNameList: [{ type: String }],
  content: String,
  postAt: { type: Date, default: Date.now },
  editAt: { type: Date },
  descImg: String,
});

// 3. 生成模型
const Blog = model<Blog>('Blog', blogSchema);

// 4. 封装CRUD操作

// 获取博客列表
export const getBlogs = async (query = {}) => {
  return Blog.find(query);
};

// 根据ID获取博客
export const getBlogById = async (id: string) => {
  return Blog.findOne({ id });
};

// 新增博客
export const addBlog = (params: {
  title: string;
  description: string;
  categoryName: string;
  tagNameList: string[];
  content: string;
}) => {

  const newBlog = new Blog({
    id: genBlogId(),
    title: params.title,
    description: params.description,
    categoryName: params.categoryName,
    tagNameList: params.tagNameList,
    content: params.content,
    postAt: new Date(),
  });

  updateTagByTagNameList(newBlog._id as ObjectId, newBlog.tagNameList, false);

  updateCategByCategName(newBlog._id as ObjectId, newBlog.categoryName, false);

  return newBlog.save();
};

// 更新博客
export const updateBlogById = async (
  id: string,
  update: Partial<Blog>,
) => {
  // 1. 查找原博客
  const blog = await Blog.findOne({ id });


  if (update.tagNameList) {
    // 2. 对比新旧tagNameList
    const oldTags = blog.tagNameList;
    const newTags = update.tagNameList;
    const oldCategName = blog.categoryName;
    const newCategName = update.categoryName;
    // 3. 计算差集
    const toAddTagList = newTags.filter(t => !oldTags.includes(t));
    const toRemoveTagList = oldTags.filter(t => !newTags.includes(t));
    // 4. 更新Tag collection
    if (oldCategName !== newCategName) {
      updateCategByCategName(blog._id as ObjectId, newCategName, false);
      updateCategByCategName(blog._id as ObjectId, oldCategName, true);
    }
    updateTagByTagNameList(blog._id as ObjectId, toAddTagList, false);
    updateTagByTagNameList(blog._id as ObjectId, toRemoveTagList, true);
  }
  // 5. 更新博客
  update.editAt = new Date();

  // 6. 返回
  return Blog.updateOne({ id }, update);
};


// 删除博客
export const deleteBlogById = async (id: string) => {
  const blog = await Blog.findOneAndDelete({ id });

  updateTagByTagNameList(blog._id as ObjectId, blog.tagNameList, true);

  return blog;
};


export default Blog;