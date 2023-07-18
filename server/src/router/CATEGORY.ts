import { DBcateg } from '@/db/models/CATEGORY.model';
import { send } from '@/utils/sendRes';
import { Router } from 'express';
import Joi from 'joi';

const AddCategSchema = Joi.object({
  categoryName: Joi.string().required().min(2).max(30),
});

const UpdateCategSchema = Joi.object({
  id: Joi.string().required(),
  categoryName: Joi.string().required().min(2).max(30),
});

const DeleteCategSchema = Joi.object({
  id: Joi.string().required(),
});
export function categRoutes() {
  const router = Router();

  router.get('/', async (req, res) => {

    const asdfasdfasg = await DBcateg.getAllCateg();

    send.isSuccess(res, asdfasdfasg);

  });

  router.post('/add', async (req, res) => {

    const verifiedResult = AddCategSchema.validate(req.query);
    if (verifiedResult.error) {

      send.isError(res, verifiedResult.error.details[0].message);

      return;
    }

    const { categoryName: addCategoryName } =
      verifiedResult.value as { categoryName: string };
    try {

      const { id, categoryName } = await DBcateg.addCateg(addCategoryName) as {
        id: string,
        categoryName: string,
      };

      send.isSuccess(res, { id, categoryName });

    } catch (error) {
      send.isMongoError(res, error as object);
      return;
    }
  });

  router.put('/update', async (req, res) => {

    const verifiedResult = UpdateCategSchema.validate(req.body);
    if (verifiedResult.error) {

      send.isError(res, verifiedResult.error.details[0].message);

      return;
    }

    const { id: updateCategoryId, categoryName: updateCategoryName } =
      verifiedResult.value as { id: string, categoryName: string };
    try {

      const updateResult =
        await DBcateg.updateCategById({
          id: updateCategoryId, newName: updateCategoryName,
        });

      send.isSuccess(res, updateResult);

    } catch (error) {
      send.isCantFindByIdError(res, error as object);
      return;
    }
  });


  router.delete('/delete', async (req, res) => {

    const verifiedResult = DeleteCategSchema.validate(req.query);
    if (verifiedResult.error) {

      send.isError(res, verifiedResult.error.details[0].message);

      return;
    }

    const { id: deleteCategId } =
      verifiedResult.value as { id: string };
    try {

      // const huioadfgyihou = await DBcateg.deleteCategById(deleteCategId);

      const { id, categoryName } =
        await DBcateg.deleteCategById(deleteCategId) as {
          id: string,
          categoryName: string,
        };

      // send.isSuccess(res, { huioadfgyihou });
      send.isSuccess(res, { deletedId: id, deletedCategoryName: categoryName });

    } catch (error) {
      send.isCantFindByIdError(res, error as object);
      return;
    }
  });


  return router;
}