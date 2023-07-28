import { DBuser } from '@/db/models/USER.model'
import { send } from '@/utils/sendRes'
import { Router } from 'express'
import Joi from 'joi'
import asyncHandler from 'express-async-handler'
import { sign, verify } from 'jsonwebtoken'
import { config } from 'dotenv'
import { failure } from '@/utils/error'

const { ADMIN_SECRET_KEY, USER_SECRET_KEY } = config().parsed!

function getSecretKey(role: 0 | 1) {
  return role ? ADMIN_SECRET_KEY : USER_SECRET_KEY
}

const LoginSchema = Joi.object({
  account: Joi.string().required().min(3).max(12),
  password: Joi.string().required().min(5).max(18),
})

const VerifyTokenSchema = Joi.object({
  account: Joi.string().required().min(3).max(12),
  token: Joi.string().required(),
})

const router = Router()

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const verifiedResult = LoginSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const user = verifiedResult.value as {
      account: string
      password: string
    }

    try {
      const findUser = (await DBuser.findAndVerifyPasswd(user)) as {
        id: string
        account: string
        role: 0 | 1
      }

      const secretKey = getSecretKey(findUser.role)

      const token = sign(
        {
          account: user.account,
        },
        secretKey,
        { expiresIn: '1d' },
      )

      await send.isSuccess(res, { ...findUser, token })
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

router.post(
  '/verify_token',

  asyncHandler(async (req, res) => {
    const verifiedResult = VerifyTokenSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { account: getAccount, token: getToken } = verifiedResult.value as {
      account: string
      token: string
    }

    try {
      const findUser = (await DBuser.findOneByAccount(getAccount)) as {
        id: string
        account: string
        role: 0 | 1
      }

      const secretKey = getSecretKey(findUser.role)

      const { account, exp } = verify(getToken, secretKey) as {
        account: string
        iat: number
        exp: number
      }

      if (account !== getAccount) {
        failure.notYourToken({ account: getAccount })
        return
      }

      const secLeft = Math.round((exp * 1000 - Date.now()) / 1000)

      await send.isSuccess(res, { account, secLeft })
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

export default router
