import { Response } from 'express'

function isSuccess(res: Response, data: object): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      res.status(200).json({
        success: true,
        message: 'OK',
        data,
      })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

function isError(res: Response, err: object | string) {
  res.status(400).json({
    success: false,
    message: { error: err },
    data: {},
  })
}

function isMongoError(res: Response, error: object) {
  const { code, keyValue } = error as { code: number; keyValue: object }
  const err = { code, keyValue }
  console.error(`\x1b[31m 失败：${JSON.stringify(err)} \x1b[0m`)

  isError(res, err)
}

function isCustomError(res: Response, error: object) {
  const { name, message } = error as { name: string; message: string }
  const err = { name, message }
  console.error(`\x1b[31m 失败：${JSON.stringify(err)} \x1b[0m`)

  send.isError(res, err)
}

export const send = {
  isSuccess,
  isError,
  isMongoError,
  isCustomError,
}
