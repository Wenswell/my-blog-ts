/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId } from 'mongoose'
import { genBlogId } from './genid'
import { Blog, DBblog } from '@/db/models/BLOG.model'
import { updateCategByCategName } from '@/db/models/CATEGORY.model'
import { updateTagByTagNameList } from '@/db/models/TAG.model'
import { nanoid } from 'nanoid'
import Mock from 'mockjs'
import { sign, decode } from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { config } from 'dotenv'

async function test() {
  // ↓ ↓ ↓ ↓ TEST AREA ↓ ↓ ↓ ↓
  const keyword = '是'
  const categ = '服务器'
  const tags = ['CSS']
  const reres = await Blog.find(
    {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ],
      $and: [
        { categoryName: categ },
        {
          tagNameList: {
            $in: [...tags],
          },
        },
      ],
    },
    {
      _id: 0,
      __v: 0,
      content: 0,
    },
  )
  console.log('reres', reres)
  //

  // console.log('addMockBlogs', await addMockBlogs(123));
  // console.log(
  //   "sign('payload', 'ADMIN_KEY', { expiresIn: '10s' })",
  //   sign({}, 'ADMIN_KEY', { expiresIn: '10s' }),
  // )

  // const hash = await bcrypt.hash('aergagaerasergf', 10)
  // console.log(
  //   " await bcrypt.hash('aergagaerasergf', 10);",
  //   await bcrypt.hash('aergagaerasergf', 10),
  // )
  // console.log(
  //   " await bcrypt.hash('aergagaerasergf', 10);",
  //   await bcrypt.hash('aergagaerasergf', 10),
  // )
  // console.log(
  //   " await bcrypt.hash('aergagaerasergf', 10);",
  //   await bcrypt.hash('aergagaerasergf', 10),
  // )
  // console.log(
  //   " await bcrypt.hash('aergagaerasergf', 10);",
  //   await bcrypt.hash('aergagaerasergf', 10),
  // )
  // console.log('hash', hash)

  // const isValid = await bcrypt.compare(
  //   'aergagaerasergf',
  //   '$2b$10$dw0.ZQLeN1O4kFi4gibK/e/qbrwidufUqqTvdmfje.9uAIYaX5l7S',
  // )
  // console.log('isValid', isValid)

  // const { ADMIN_SECRET_KEY, USER_SECRET_KEY } = config().parsed!
  // console.log('config()', config())
  // console.log('config().parsed', config().parsed)
  // console.log('ADMIN_SECRET_KEY', ADMIN_SECRET_KEY)
  // console.log('USER_SECRET_KEY', USER_SECRET_KEY)
  // const keyPair = crypto.generateKeyPairSync('rsa', {
  //   modulusLength: 2048, //密钥长度
  //   publicKeyEncoding: {
  //     type: 'spki',
  //     format: 'pem'
  //   },
  //   privateKeyEncoding: {
  //     type: 'pkcs8',
  //     format: 'pem'
  //   }
  // });
  // console.log("keyPair", keyPair)

  //
  // ↑ ↑ ↑ ↑ TEST AREA ↑ ↑ ↑ ↑
}

async function testBcrypt(rounds: number, testTimes: number) {
  const saltRounds = rounds

  const start = Date.now()

  for (let i = 0; i < testTimes; i++) {
    await bcrypt.hash('testpassword', saltRounds)
  }

  const end = Date.now()
  const duration = end - start

  console.log(
    '用时',
    duration,
    `ms, saltRounds:${saltRounds}, 加密${testTimes}次`,
  )
  // 用时 65 ms, saltRounds:1, 加密10次
  // 用时 531 ms, saltRounds:10, 加密10次
  // 用时 5289 ms, saltRounds:10, 加密100次
}

const categories = [
  '后端',
  '前端',
  '客户端',
  '编程',
  '生活',
  '服务器',
  '记录',
  '学习',
  '网罗万象',
  '设计',
  '工具',
  '乐在其中',
  '音乐',
  '视频',
  '闻达天下',
]
const tags = [
  'Go',
  'C#',
  'Rust',
  'Sass',
  'Less',
  'SQL',
  'C++',
  'Swift',
  'iOS',
  'Android',
  'PHP',
  'Ruby',
  'NoSQL',
  'Docker',
  'AWS',
  'Webpack',
  'Gulp',
  'Grunt',
  'Kotlin',
  'HTML',
  'CSS',
  'TypeScript',
  'Angular',
  'jQuery',
  'JavaScript',
  'Node.js',
  'React',
  'Vue.js',
  'Python',
  'Java',
]
interface Post {
  id: number
  title: string
  description: string
  categoryName: string
  tagNameList: string[]
  content: string
  postAt: Date
  editAt: Date
  descImg: string
}
function generateTagList(): string[] {
  return Array.from(
    { length: Math.floor(Math.random() * 6) + 1 },
    () => tags[Math.floor(Math.random() * tags.length)],
  )
}
function generateBlogContent() {
  // 生成随机段落数和循环次数
  const paragraphCount = Mock.Random.integer(1, 5)
  const loopCount = Mock.Random.integer(2, 10)

  // 生成指定次数的文章
  const paragraphs = []
  for (let i = 0; i < loopCount; i++) {
    const texts = []
    for (let j = 0; j < paragraphCount; j++) {
      texts.push(Mock.Random.cparagraph())
    }
    paragraphs.push(texts.join('\n')) // 在段落之间添加换行符
  }

  // 将段落数组转换为单个字符串
  const article = paragraphs.join('\n\n') // 在文章段落之间添加两个换行符

  console.log(article)
  return article
}
async function addMockBlogs(num = 1) {
  for (let i = 0; i < num; i++) {
    const postAt: Date = new Date(Mock.Random.datetime())

    // 生成随机的 editAt 时间（比 postAt 晚 1 到 10 天）
    const tenDays = 10 * 24 * 60 * 60 * 1000
    const editAt = new Date(
      postAt.getTime() + Math.floor(Math.random() * tenDays),
    )

    const mockData: { data: Post } = Mock.mock({
      data: {
        title: '@ctitle(5,15)',
        description: '@cparagraph(1)',
        'categoryName|1': categories,
        tagNameList: generateTagList(),
        content: generateBlogContent(),
        // content: '@cparagraph(3, 300)',
        postAt,
        editAt,
        descImg: '@image',
      },
    })

    const newBlog = new Blog({
      ...mockData.data,
      id: genBlogId(),
    })

    await updateTagByTagNameList(
      newBlog._id as ObjectId,
      newBlog.tagNameList,
      false,
    )

    await updateCategByCategName(
      newBlog._id as ObjectId,
      newBlog.categoryName,
      false,
    )

    await newBlog.save()
  }

  return `\x1b[1mAdded\x1b[0m \x1b[7m${num}\x1b[0m \x1b[1mblogs.\x1b[0m`
}

console.log(
  '\x1b[1m\x1b[7mTEST: \x1b[0m' + `\x1b[7m${nanoid(5)}\x1b[0m`,
  new Date().toLocaleDateString(),
  new Date().toLocaleTimeString(),
)
void test().then(() => {
  console.log(
    '\x1b[1m\x1b[7mT E S T E N D: \x1b[0m' + `\x1b[7m${nanoid(5)}\x1b[0m`,
    new Date().toLocaleDateString(),
    new Date().toLocaleTimeString(),
  )
})
