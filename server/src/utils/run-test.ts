/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Blog, DBblog } from '@/db/models/BLOG.model';
const { addBlog, deleteBlogById, getBlogById, getBlogs, updateBlogById } = DBblog;
import { DBcateg, updateCategByCategName } from '@/db/models/CATEGORY.model';
const { addCateg, getAllCateg, updateCategById, deleteCategById } = DBcateg;
import { DBtag, updateTagByTagNameList } from '@/db/models/TAG.model';
const { addTag, getAllTag, updateTagById, deleteTagById } = DBtag;
import { nanoid } from 'nanoid';

console.log('\x1b[1m\x1b[7mTEST: \x1b[0m' + `\x1b[7m${nanoid(5)}\x1b[0m`, new Date().toLocaleDateString(), new Date().toLocaleTimeString());
import Mock from 'mockjs';
import { ObjectId } from 'mongoose';
import { genBlogId } from './genid';

async function test() {

  // console.log('addMockBlogs', await addMockBlogs(123));

  // testTAG();
  // testCATEGORY();
  // testBLOG();

  // const tag = await Tag.findOne({ tagName: '7FJtjw' }).populate('blogs');
  // console.log("tag", tag.blogs)

  // console.log("getBlogsByTagName", await getBlogsByTagName('7FJtjw'))

  // const updatabyiddd = await updateBlogById({
  //   id: 'rgpnwucek1',
  //   update: {
  //     // title: `new title at${new Date().toString()}`,
  //     tagNameList: ['7FJtj'],
  //     categoryName: '123',
  //   },
  // });
  // console.log('updatabyiddd', updatabyiddd);

  // const newBlog = {
  //   title: `My First Blog${new Date().toString().toLocaleTimeString()}`,
  //   description: 'This is my first blog post',
  //   categoryName: '456',
  //   tagNameList: ['7FJtjw'],
  //   content: 'Hello World!',
  // }
  // const addd = await addBlog(newBlog)
  // console.log("addd", addd)

  // const findidd = await getBlogById('lv64vzby7a');
  // console.log('findidd', findidd);


  // console.log("getAllTag()", await getAllTag())
  // console.log("getAllCateg()", await getAllCateg())
  // console.log("getBlogs()", await getBlogs())
}

async function testTAG() {
  console.log('getAllTag()', await getAllTag());
  console.log('addTag()', await addTag(nanoid(4)));
  console.log('updateTagById()', await updateTagById({
    id: 'DLQXWO',
    newName: `new at ${new Date().toString()}`,
  }));
  console.log('deleteTagById()', await deleteTagById('2yqs93'));
}

async function testCATEGORY() {
  console.log('getAllCateg()', await getAllCateg());
  console.log('addCateg()', await addCateg(nanoid(6)));
  console.log('updateCategById()', await updateCategById({
    id: 'Zg2IulI',
    newName: `new at ${new Date().toString()}`,
  }));
  console.log('deleteCategById()', await deleteCategById('cGDAlc1'));
}

async function testBLOG() {

  const newBlog = {
    title: 'My First Blog',
    description: 'This is my first blog post',
    categoryName: '456',
    tagNameList: ['789', '101'],
    content: 'Hello World!',
  };
  const addd = await addBlog(newBlog);
  console.log('addd', addd);

  const finddd = await getBlogs({});
  console.log('finddd', finddd);
  const findidd = await getBlogById('U4mnT2NqE');
  console.log('findidd', findidd);

  const updatabyiddd = await updateBlogById({
    id: 'U4mnT2NqE',
    update: { title: `new title at${new Date().toString()}` },
  });
  console.log('updatabyiddd', updatabyiddd);

  const deelete = await deleteBlogById('5pk1an4whq');
  console.log('deelete', deelete);
}



const categories = ['客户端', '前端', '后端', '服务器', '生活', '编程', '记录', '学习', '网络', '设计', '工具', '游戏', '音乐', '视频', '新闻'];
const tags = ['JavaScript', 'Node.js', 'React', 'Vue.js', 'Python', 'Java', 'C++', 'Swift', 'iOS', 'Android', 'PHP', 'Ruby', 'Go', 'C#', 'Rust', 'Kotlin', 'HTML', 'CSS', 'TypeScript', 'Angular', 'jQuery', 'Sass', 'Less', 'SQL', 'NoSQL', 'Docker', 'AWS', 'Webpack', 'Gulp', 'Grunt'];
interface Post {
  id: number;
  title: string;
  description: string;
  categoryName: string;
  tagNameList: string[];
  content: string;
  postAt: Date;
  editAt: Date;
  descImg: string;
}
const generateTagList = (): string[] => (
  Array.from({ length: Math.floor(Math.random() * 6) + 1 }, () => tags[Math.floor(Math.random() * tags.length)])
);

// 将日期字符串转换为 Date 对象

async function addMockBlogs(num = 1) {

  for (let i = 0; i < num; i++) {
    const postAt: Date = new Date(Mock.Random.datetime());

    // 生成随机的 editAt 时间（比 postAt 晚 1 到 10 天）
    const tenDays = 10 * 24 * 60 * 60 * 1000;
    const editAt = new Date(postAt.getTime() + Math.floor(Math.random() * tenDays));

    const mockData: { data: Post } = Mock.mock({
      'data': {
        title: '@ctitle(5,15)',
        description: '@cparagraph(1)',
        'categoryName|1': categories,
        tagNameList: generateTagList(),
        content: '@cparagraph(3, 10)',
        postAt,
        editAt,
        descImg: '@image',
      },
    });

    const newBlog = new Blog({
      id: genBlogId(),
      ...mockData.data,
    });

    await updateTagByTagNameList(
      newBlog._id as ObjectId, newBlog.tagNameList, false);

    await updateCategByCategName(
      newBlog._id as ObjectId, newBlog.categoryName, false);

    await newBlog.save();

  }

  return `\x1b[1mAdded\x1b[0m \x1b[7m${num}\x1b[0m \x1b[1mblogs.\x1b[0m`;
}


test().then(() => { console.log('\x1b[1m\x1b[7mT E S T E N D: \x1b[0m' + `\x1b[7m${nanoid(5)}\x1b[0m`, new Date().toLocaleDateString(), new Date().toLocaleTimeString()); });
