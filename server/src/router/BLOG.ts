import { DBblog } from '@/db/models/BLOG.model';
import { send } from '@/utils/sendRes';
import { Router } from 'express';
import Joi from 'joi';

const AddBlogSchema = Joi.object({
  title: Joi.string().required().max(30),
  description: Joi.string().required().max(200),
  categoryName: Joi.string().min(2).max(30),
  tagNameList: Joi.array().items(Joi.string().min(2)),
  content: Joi.string().required(),
  descImg: Joi.string(),
});

const UpdateBlogSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().max(30),
  description: Joi.string().max(200),
  categoryName: Joi.string(),
  tagNameList: Joi.array().items(Joi.string()),
  content: Joi.string(),
  descImg: Joi.string(),
});

const deleteBlogSchema = Joi.object({
  id: Joi.string().required(),
});

interface AddBlog {
  title: string;
  description: string;
  categoryName: string;
  tagNameList: string[];
  content: string;
  descImg?: string;
}

interface UpdateBlog {
  value: {
    id: string;
    title: string;
    description: string;
    content: string;
    // ...
  }
}

export function blogRoutes() {

  const router = Router();

  router.get('/', async (req, res) => {

    const search: string = req.query.search ? String(req.query.search) : '';
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;

    enum SortFields {
      TITLE = 'title',
      POST_AT = 'postAt',
      EDIT_AT = 'editAt',
    }
    let sort = req.query.sort as SortFields;

    if (!Object.values(SortFields).includes(sort)) {
      sort = SortFields.EDIT_AT;
    }

    enum Order {
      ASC = 1,
      DESC = -1
    }
    // 统一转为大写
    const orderQuery = (req.query.order as string)?.toUpperCase();
    // 映射为枚举
    const order = Order[orderQuery as keyof typeof Order] || Order.DESC;

    const find = {
      search,
      page,
      limit,
      sort,
      order,
    };
    console.log('find', find);

    const { blogs, totalCount, totalPages } = await DBblog.getBlogs(find);

    send.isSuccess(res, {
      totalCount,
      totalPages,
      blogs,
    });

  });

  router.post('/add', async (req, res) => {
    // const {
    //   title, description, categoryName, tagNameList, content, descImg
    // } = req.body as AddBlog;

    const verifiedResult = AddBlogSchema.validate(req.body);
    if (verifiedResult.error) {
      send.isError(res, verifiedResult.error.details[0].message);
      return;
    }
    try {
      const { id } = await DBblog.addBlog(
        verifiedResult.value as AddBlog) as { id: string };

      send.isSuccess(res, { id });

    } catch (error) {
      send.isMongoError(res, error as object);
      return;
    }

  });

  router.put('/update', async (req, res) => {

    const verifiedResult = UpdateBlogSchema.validate(req.body);
    if (verifiedResult.error) {

      send.isError(res, verifiedResult.error.details[0].message);

      return;
    }


    const { id, ...rest } = verifiedResult.value as UpdateBlog['value'];
    const upppp = { id, update: { ...rest } };
    try {
      const {
        acknowledged,
        matchedCount,
        modifiedCount,
      } = await DBblog.updateBlogById(upppp) as {
        acknowledged: boolean,
        matchedCount: number,
        modifiedCount: number,
      };
      if (acknowledged && modifiedCount) {
        send.isSuccess(res, { id });
      } else {
        send.isError(res, {
          acknowledged,
          matchedCount,
          modifiedCount,
        });
      }

    } catch (error) {
      send.isError(res, error as object);
      return;
    }


  });

  router.delete('/delete', async (req, res) => {

    const verifiedResult = deleteBlogSchema.validate(req.query);
    if (verifiedResult.error) {

      send.isError(res, verifiedResult.error.details[0].message);

      return;
    }

    const id: string = (verifiedResult.value as { id: string }).id;

    try {
      const {
        acknowledged,
        deletedCount,
      } = await DBblog.deleteBlogById(id) as {
        acknowledged: boolean,
        deletedCount: number,
      };

      if (acknowledged && deletedCount) {
        send.isSuccess(res, { deletedId: id });
      }

    } catch (error) {
      send.isCantFindByIdError(res, error as object);
      return;
    }

  });

  return router;

}