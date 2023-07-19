import { DBtag } from '@/db/models/TAG.model'
import { send } from '@/utils/sendRes'
import { Router } from 'express'
import Joi from 'joi'
import asyncHandler from 'express-async-handler'

const AddTagSchema = Joi.object({
  tagName: Joi.string().required().min(2).max(30),
})

const UpdateTagSchema = Joi.object({
  id: Joi.string().required(),
  tagName: Joi.string().required().min(2).max(30),
})

const DeleteTagSchema = Joi.object({
  id: Joi.string().required(),
})

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const asdfasdfasg = await DBtag.getAllTag()
    await send.isSuccess(res, asdfasdfasg)
  }),
)

router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const verifiedResult = AddTagSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { tagName: addTagName } = verifiedResult.value as { tagName: string }
    try {
      const { id, tagName } = (await DBtag.addTag(addTagName)) as {
        id: string
        tagName: string
      }

      await send.isSuccess(res, { id, tagName })
    } catch (error) {
      send.isMongoError(res, error as object)
      return
    }
  }),
)

router.put(
  '/update',
  asyncHandler(async (req, res) => {
    const verifiedResult = UpdateTagSchema.validate(req.body)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id: updateTagId, tagName: updateTagName } =
      verifiedResult.value as { id: string; tagName: string }
    try {
      const updateResult = await DBtag.updateTagById({
        id: updateTagId,
        newName: updateTagName,
      })

      if (!updateResult) throw 'updateTagById failed'

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
    const verifiedResult = DeleteTagSchema.validate(req.query)
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message)

      return
    }

    const { id: deleteTagId } = verifiedResult.value as { id: string }
    try {
      const { id, tagName } = (await DBtag.deleteTagById(deleteTagId)) as {
        id: string
        tagName: string
      }

      await send.isSuccess(res, { deletedId: id, deletedTagName: tagName })
    } catch (error) {
      send.isCantFindByIdError(res, error as object)
      return
    }
  }),
)

export default router
