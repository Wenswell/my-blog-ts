import express from 'express';

const router = express.Router();

import { fileRoutes } from '@router/default/file';
router.use('/files', fileRoutes());

import { testRoutes } from '@router/default/test';
router.use('/test', testRoutes());

import { blogRoutes } from './BLOG';
router.use('/blog', blogRoutes());

import { categRoutes } from './CATEGORY';
router.use('/categ', categRoutes());

import { tagRoutes } from './TAG';
router.use('/tag', tagRoutes());


import { notFoundHandler } from '@router/default/notFound';
router.use(notFoundHandler());

export default (): express.Router => {
  return router;
};