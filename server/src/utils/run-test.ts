import { addBlog, deleteBlogById, getBlogById, getBlogs, updateBlogById } from '@/db/models/BLOG';
import { addCateg, getAllCateg, updateCategById, deleteCategById } from "@/db/models/CATEGORY";
import { addTag, getAllTag, updateTagById, deleteTagById, Tag, getBlogsByTagName } from '@/db/models/TAG';
import { nanoid } from "nanoid";

console.log('\x1b[1m\x1b[7mTEST: \x1b[0m' + `\x1b[7m${nanoid(5)}\x1b[0m`, new Date().toLocaleDateString(), new Date().toLocaleTimeString());

async function test() {

  // const tag = await Tag.findOne({ tagName: '7FJtjw' }).populate('blogs');
  // console.log("tag", tag.blogs)

  // console.log("getBlogsByTagName", await getBlogsByTagName('7FJtjw'))

  // const updatabyiddd = await updateBlogById('ccd4eg8esz', {
  //   title: `new title at${new Date()}`,
  //   tagNameList: ['7FJtj'],
  //   categoryName:'123',
  // })
  // console.log("updatabyiddd", updatabyiddd)

  // const newBlog = {
  //   title: `My First Blog${new Date().toLocaleTimeString()}`,
  //   description: 'This is my first blog post',
  //   categoryName: '456',
  //   tagNameList: ['7FJtjw'],
  //   content: 'Hello World!',
  // }
  // const addd = await addBlog(newBlog)
  // console.log("addd", addd)

  // const findidd = await getBlogById('lv64vzby7a')
  // console.log("findidd", findidd)


  // console.log("getAllTag()", await getAllTag())
  // console.log("getAllCateg()", await getAllCateg())
  // console.log("getBlogs()", await getBlogs())
}

async function testTAG() {
  console.log("getAllTag()", await getAllTag())
  console.log("addTag()", await addTag(nanoid(4)))
  console.log("updateTagById()", await updateTagById('DLQXWO', `new at ${new Date()}`))
  console.log("deleteTagById()", await deleteTagById('2yqs93'))
}

async function testCATEGORY() {
  console.log("getAllCateg()", await getAllCateg())
  console.log("addCateg()", await addCateg(nanoid(6)))
  console.log("updateCategById()", await updateCategById('Zg2IulI', `new at ${new Date()}`))
  console.log("deleteCategById()", await deleteCategById('cGDAlc1'))
}

async function testBLOG() {

  const newBlog = {
    title: 'My First Blog',
    description: 'This is my first blog post',
    categoryName: '456',
    tagNameList: ['789', '101'],
    content: 'Hello World!',
  }
  const addd = await addBlog(newBlog)
  console.log("addd", addd)

  const finddd = await getBlogs()
  console.log("finddd", finddd)
  const findidd = await getBlogById('U4mnT2NqE')
  console.log("findidd", findidd)

  const updatabyiddd = await updateBlogById('U4mnT2NqE', { title: `new title at${new Date()}` })
  console.log("updatabyiddd", updatabyiddd)

  const deelete = await deleteBlogById('5pk1an4whq')
  console.log("deelete", deelete.title)
}


test().then(() => { console.log('\x1b[1m\x1b[7mT E S T E N D: \x1b[0m' + `\x1b[7m${nanoid(5)}\x1b[0m`, new Date().toLocaleDateString(), new Date().toLocaleTimeString()); })
