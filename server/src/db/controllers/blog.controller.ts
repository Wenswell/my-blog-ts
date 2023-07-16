/**
 * 
// user.controller.ts 
import { createBlog, findBlogById } from '../models/blog.model';

export const createNewBlog = async (req, res) => {
  const blog = req.body;
  await createBlog(blog);
  //...
}

export const getBlog = async (req, res) => {
  const id = req.params.id;
  const blog = await findBlogById(id);
  //... 
}
import { 
  User,
  createUser,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
} from '@db/models/blog.model';

// 创建用户
export const createNewUser = (user: User) => {
  return createUser(user);
}

// 查找用户
export const getUserById = async (id: string) => {
  return await findUserById(id);
} 

// 查找用户
export const getAllUser = async () => {
  return await findAllUsers();
} 
 */