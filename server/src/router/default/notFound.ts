/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express'

export default (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Not Found. It's not a valid interface.`,
    data: {
      originalUrl: req.originalUrl,
      url: req.url,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      cookies: req.cookies,
      complete: req.complete,
      httpVersion: req.httpVersion,
    },
  })
}

// import { Request, Response } from 'express'

// export default (req: Request, res: Response) => {

//   interface Idata {
//     httpVersion: string,
//     originalUrl: string,
//     url: string,
//     method: string,
//     params?: object,
//     query?: object,
//     body?: object,
//     cookies?: object
//   }

//   interface Ireq extends Idata {
//     params: object,
//     query: object,
//     body: object,
//     cookies: object
//   }

//   const { httpVersion, originalUrl, url, method, params, query, body, cookies } = req as Ireq

//   const data: Idata = {
//     httpVersion: httpVersion,
//     originalUrl: originalUrl,
//     url: url,
//     method: method,
//   }
//   if (Object.keys(params).length === 0) data.params = params
//   if (Object.keys(query).length === 0) data.query = query
//   if (Object.keys(body).length === 0) data.body = body
//   if (Object.keys(cookies).length === 0) data.cookies = cookies

//   res.status(404).json({
//     status: 'error',
//     message: `Not Found. It's not a valid interface.`,
//     req,
//     data,
//   })
// }
