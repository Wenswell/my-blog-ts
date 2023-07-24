import { DBuser } from '@/db/models/USER.model'
import { send } from '@/utils/sendRes'
import { Router } from 'express'
import Joi from 'joi'
import asyncHandler from 'express-async-handler'

const AddUserSchema = Joi.object({
  account: Joi.string().required().min(3).max(12),
  password: Joi.string().required().min(5).max(18),
})

const UpdateUserSchema = Joi.object({
  id: Joi.string().length(5).required(),
  account: Joi.string().min(3).max(12),
  password: Joi.string().min(5).max(18),
})

const UserIdSchema = Joi.object({
  id: Joi.string().length(5).required(),
})

interface AddUser {
  account: string
  password: string
}

interface UpdateUser {
  value: {
    id: string
    account: string
    password: string
    // ...
  }
}

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const verifiedResult = UserIdSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const id: string = (verifiedResult.value as { id: string }).id

    try {
      const rrres = (await DBuser.findOneById(id)) as object

      await send.isSuccess(res, rrres)
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

router.get(
  '/all',
  asyncHandler(async (req, res) => {
    try {
      const rrres = (await DBuser.findAll()) as object

      await send.isSuccess(res, rrres)
    } catch (error) {
      console.log('error', error)
      send.isError(res, error as object)
      return
    }
  }),
)

router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const verifiedResult = AddUserSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)
      return
    }
    try {
      const { id } = (await DBuser.addOne(verifiedResult.value as AddUser)) as {
        id: string
      }

      await send.isSuccess(res, { id })
    } catch (error) {
      console.log('error', error)
      send.isCustomError(res, error as object)
      return
    }
  }),
)

router.put(
  '/update',
  asyncHandler(async (req, res) => {
    const verifiedResult = UpdateUserSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id, ...rest } = verifiedResult.value as UpdateUser['value']
    const upppp = { id, update: { ...rest } }
    try {
      const { acknowledged, matchedCount, modifiedCount } =
        (await DBuser.updateOneById(upppp)) as {
          acknowledged: boolean
          matchedCount: number
          modifiedCount: number
        }
      if (acknowledged && modifiedCount) {
        await send.isSuccess(res, { id })
      } else {
        send.isError(res, {
          acknowledged,
          matchedCount,
          modifiedCount,
        })
      }
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

router.delete(
  '/delete',
  asyncHandler(async (req, res) => {
    const verifiedResult = UserIdSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const id: string = (verifiedResult.value as { id: string }).id

    try {
      const { acknowledged, deletedCount } = (await DBuser.deleteOneById(
        id,
      )) as {
        acknowledged: boolean
        deletedCount: number
      }

      if (acknowledged && deletedCount) {
        await send.isSuccess(res, { deletedId: id })
      }
    } catch (error) {
      send.isCustomError(res, error as object)
      return
    }
  }),
)

export default router
