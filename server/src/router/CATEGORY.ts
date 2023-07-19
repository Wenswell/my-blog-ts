import { DBcateg } from '@/db/models/CATEGORY.model'
import { send } from '@/utils/sendRes'
import { Router } from 'express'
import Joi from 'joi'
import asyncHandler from 'express-async-handler'

const AddCategSchema = Joi.object({
  categoryName: Joi.string().required().min(2).max(30),
})

const UpdateCategSchema = Joi.object({
  id: Joi.string().required(),
  categoryName: Joi.string().required().min(2).max(30),
})

const DeleteCategSchema = Joi.object({
  id: Joi.string().required(),
})

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const asdfasdfasg = await DBcateg.getAllCateg()

    await send.isSuccess(res, asdfasdfasg)
  }),
)

router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const verifiedResult = AddCategSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { categoryName: addCategoryName } = verifiedResult.value as {
      categoryName: string
    }
    try {
      const { id, categoryName } = (await DBcateg.addCateg(
        addCategoryName,
      )) as {
        id: string
        categoryName: string
      }

      await send.isSuccess(res, { id, categoryName })
    } catch (error) {
      send.isMongoError(res, error as object)
      return
    }
  }),
)

router.put(
  '/update',
  asyncHandler(async (req, res) => {
    const verifiedResult = UpdateCategSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id: updateCategoryId, categoryName: updateCategoryName } =
      verifiedResult.value as { id: string; categoryName: string }
    try {
      const updateResult = await DBcateg.updateCategById({
        id: updateCategoryId,
        newName: updateCategoryName,
      })

      await send.isSuccess(res, updateResult)
    } catch (error) {
      send.isCantFindByIdError(res, error as object)
      return
    }
  }),
)

router.delete(
  '/delete',
  asyncHandler(async (req, res) => {
    const verifiedResult = DeleteCategSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id: deleteCategId } = verifiedResult.value as { id: string }
    try {
      // const huioadfgyihou = await DBcateg.deleteCategById(deleteCategId);

      const { id, categoryName } = (await DBcateg.deleteCategById(
        deleteCategId,
      )) as {
        id: string
        categoryName: string
      }

      // await send.isSuccess(res, { huioadfgyihou });
      await send.isSuccess(res, {
        deletedId: id,
        deletedCategoryName: categoryName,
      })
    } catch (error) {
      send.isCantFindByIdError(res, error as object)
      return
    }
  }),
)

export default router
