/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express'

export default (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',

    data: {
      httpVersion: req.httpVersion,
      originalUrl: req.originalUrl,
      url: req.url,
      params: req.params,
      query: req.query,
      body: req.body,
      method: req.method,
      cookies: req.cookies,
      complete: req.complete,
    },
  })
}
