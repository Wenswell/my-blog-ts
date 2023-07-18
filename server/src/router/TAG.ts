import { DBtag } from '@/db/models/TAG.model';
import { send } from '@/utils/sendRes';
import { Router } from 'express';
import Joi from 'joi';

const AddTagSchema = Joi.object({
  tagName: Joi.string().required().min(2).max(30),
});

const UpdateTagSchema = Joi.object({
  id: Joi.string().required(),
  tagName: Joi.string().required().min(2).max(30),
});

const DeleteTagSchema = Joi.object({
  id: Joi.string().required(),
});
export function tagRoutes() {
  const router = Router();

  router.get('/', async (req, res) => {

    const asdfasdfasg = await DBtag.getAllTag();

    send.isSuccess(res, asdfasdfasg);

  });

  router.post('/add', async (req, res) => {

    const verifiedResult = AddTagSchema.validate(req.query);
    if (verifiedResult.error) {

      send.isError(res, verifiedResult.error.details[0].message);

      return;
    }

    const { tagName: addTagName } =
      verifiedResult.value as { tagName: string };
    try {

      const { id, tagName } = await DBtag.addTag(addTagName) as {
        id: string,
        tagName: string,
      };

      send.isSuccess(res, { id, tagName });

    } catch (error) {
      send.isMongoError(res, error as object);
      return;
    }
  });

  router.put('/update', async (req, res) => {

    const verifiedResult = UpdateTagSchema.validate(req.body);
    if (verifiedResult.error) {

      send.isError(res, verifiedResult.error.details[0].message);

      return;
    }

    const { id: updateTagId, tagName: updateTagName } =
      verifiedResult.value as { id: string, tagName: string };
    try {

      const updateResult =
        await DBtag.updateTagById({
          id: updateTagId, newName: updateTagName,
        });

      send.isSuccess(res, updateResult);

    } catch (error) {
      send.isCantFindByIdError(res, error as object);
      return;
    }
  });


  router.delete('/delete', async (req, res) => {

    const verifiedResult = DeleteTagSchema.validate(req.query);
    if (verifiedResult.error) {

      send.isError(res, verifiedResult.error.details[0].message);

      return;
    }

    const { id: deleteTagId } =
      verifiedResult.value as { id: string };
    try {

      const { id, tagName } =
        await DBtag.deleteTagById(deleteTagId) as {
          id: string,
          tagName: string,
        };

      send.isSuccess(res, { deletedId: id, deletedTagName: tagName });

    } catch (error) {
      send.isCantFindByIdError(res, error as object);
      return;
    }
  });


  return router;
}