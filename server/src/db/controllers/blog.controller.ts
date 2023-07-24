/**
 * 
// user.controller.ts 
import { createBlog, findBlogById } from '../models/blog.model';

export const createNewBlog = asyncHandler(async (req, res) => {
  const blog = req.body;
  await createBlog(blog);
  //...
}

export const getBlog = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const blog = await findBlogById(id);
  //... 
}
import { 
  User,
  createUser,
  findOneById,
  findAll,
  updateUser,
  deleteUser,
} from '@db/models/blog.model';

// 创建用户
export const createNewUser = (user: User) => {
  return createUser(user);
}

// 查找用户
export const getUserById = async (id: string) => {
  return await findOneById(id);
} 

// 查找用户
export const findAllUser = async () => {
  return await findAll();
} 
 */
