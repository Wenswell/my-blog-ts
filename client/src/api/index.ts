import request from '@/utils/require'
import { AxiosResponse } from 'axios'

export interface IBlogPrew {
  id: string
  title: string
  description: string
  categoryName: string
  tagNameList: string[]
  postAt: string
  editAt: string
  descImg: string
}

export interface IBlogDetail extends IBlogPrew {
  content: string
}

export interface ICategItem {
  id: string
  categoryName: string
  count: number
}

export interface ITagItem {
  id: string
  tagName: string
  count: number
}

export interface NormalResult extends AxiosResponse {
  success: boolean
  message: string
  data: {
    [x: string]: any
    // totalCount: number
    // totalPages: number
    // blogs: IBlogPrew[]
  }
}

interface ISearchBlogParams {
  keyword?: string
  categoryName?: string
  tagNameList?: string[]
  page?: number
  pageSize?: number
}

interface IGetBlogByCategNameParams {
  categoryName?: string
  page?: number
  pageSize?: number
}

interface IGetBlogByTagNameParams {
  tagName?: string
  page?: number
  pageSize?: number
}

interface IVerifyAndGetTokenParams {
  account: string
  password: string
}

export async function searchBlogs(obj: ISearchBlogParams) {
  return await request('/blog', 'get', obj)
}

export async function getCateg() {
  return await request('/categ', 'get')
}

export async function getTag() {
  return await request('/tag', 'get')
}

export async function getBlogByCategName(obj: IGetBlogByCategNameParams) {
  return await request('/categ/blogs', 'get', obj)
}

export async function getBlogByTagName(obj: IGetBlogByTagNameParams) {
  return await request('/tag/blogs', 'get', obj)
}

export async function getDetailById(obj: { id: string }) {
  return await request('/blog/detail', 'get', obj)
}

export async function delBlogById(obj: { id: string }) {
  return await request('/blog/delete', 'delete', obj)
}

export async function verifyAndGetToken(obj: IVerifyAndGetTokenParams) {
  return await request('/login', 'post', obj)
}

// export default function blogSearch({
//   keyword,
//   categoryName,
//   tagNameList,
//   page,
//   pageSize,
// }: ISearchBlogParams): Promise<NormalResponse> {
//   return request('/blog', 'get', {
//     keyword,
//     categoryName,
//     tagNameList,
//     page,
//     pageSize,
//   });
// };

// const token = ( // 后台登录
// ) => { return request('/admin/verify_token', 'get') }

// const login = ( // 后台登录
//   { account, password }) => { return request('/admin/login', 'post', { account, password }) }

// const blogGetDetailById = ( // 根据ID获取文章详情
//   { id }) => { return request(`/blog/detail`, 'get', { id }) }

// const blogSearch = ( // 搜索文章
//   { keyword, categoryId, tags, page, pageSize }) => { return request(`/blog/search`, 'get', { keyword, categoryId, tags, page, pageSize }) }

// const blogDeleteById = ( // 根据ID删除文章
//   { id }) => { return request(`/blog/_token/delete`, 'delete', { id }) }

// const blogUpdate = ( // 更新文章
//   { id, title, categoryId, content, description }) => { return request(`/blog/_token/update`, 'put', { id, title, categoryId, content, description }) }

// const blogAdd = ( // 添加文章
//   { title, categoryId, tags, content, description }) => { return request(`/blog/_token/add`, 'post', { title, categoryId, tags, content, description }) }

// const getTags = ( // 获取所有tags
// ) => { return request(`/blog/get_tags`, 'get') }

// const categoryGet = ( // 获取所有分类
// ) => { return request(`/category/get`, 'get') }

// const categoryDeleteById = ( // 根据ID删除分类
//   { id }) => { return request(`/category/_token/delete`, 'delete', { id }) }

// const categoryUpdate = ( // 更新分类
//   { id, type }) => { return request(`/category/_token/update`, 'put', { id, type }) }

// const categoryAdd = ( // 添加分类
//   { type }) => { return request(`/category/_token/add`, 'post', { type }) }

// const uploadImg = ( // 上传图片
//   { form }) => { return request(`/_token/upload`, 'post', form, 'upload') }

// export default {
//   baseURL: axios.defaults.baseURL,

// token,
// login,

// blogGetDetailById,
// blogSearch,
// blogDeleteById,
// blogUpdate,
// blogAdd,

// getTags,

// categoryGet,
// categoryDeleteById,
// categoryUpdate,
// categoryAdd,

// uploadImg,
// }
