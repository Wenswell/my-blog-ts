import { send } from '@/utils/sendRes'
import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()

router.get('/download', (req, res) => {
  // 获取查询参数中的文件名
  const fileName = req.query.fileName as string
  // 构建文件的完整路径
  const filePath = `${process.cwd()}/public/upload/${fileName}`

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) res.sendStatus(404)
  })

  // 使用 res.download() 方法发送文件给客户端进行下载
  res.download(filePath)
  // .download 完整方法：
  // res.download(filePath, 'img.png', err=>{
  //   if(err){
  //     // 处理错误
  //   } else {
  //     // 下载成功后执行，比如扣除积分
  //   }
})

router.post('/upload', (req, res) => {
  type FileArray = Array<Express.Multer.File>

  // 在 POST 路由句柄中
  const files = req.files as FileArray

  if (!files) {
    return res.status(400).send({
      code: 400,
      msg: '上传文件不能为空',
    })
  }

  const fileNameList: string[] = []
  for (const file of files) {
    // 获取文件后缀
    const lastDotIndex = file.originalname.lastIndexOf('.')
    const ext = file.originalname.substring(lastDotIndex + 1)

    // 生成新文件名
    const newFilename = Date.now().toString() + '.' + ext

    // 移动并修改文件名
    fs.renameSync(
      path.join(process.cwd(), 'public', 'upload', 'temp', file.filename),
      path.join(process.cwd(), 'public', 'upload', newFilename),
    )

    // 收集文件名用于返回
    // 拼接地址后即可访问
    // eg. http://localhost:3123/upload/1686923848106.jpg
    fileNameList.push(`upload/${newFilename}`)
  }

  void send.isSuccess(res, { data: fileNameList })

  // console.log('Upload new files', fileNameList)
  // res.status(200).send({
  //   code: 200,
  //   msg: 'ok',
  //   data: fileNameList,
  // })
})

router.put('/', (req, res) => {
  res.send('Method PUT test successful!')
})

router.delete('/', (req, res) => {
  res.send('Method DELETE test successful!')
})

export default router
