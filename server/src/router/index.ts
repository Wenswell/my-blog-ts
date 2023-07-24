import express from 'express'

const router = express.Router()

import fileRoutes from '@router/default/file'
router.use('/files', fileRoutes)

import testRoutes from '@router/default/test'
router.use('/test', testRoutes)

import blogRoutes from './blog/BLOG'
router.use('/blog', blogRoutes)

import categRoutes from './blog/CATEGORY'
router.use('/categ', categRoutes)

import tagRoutes from './blog/TAG'
router.use('/tag', tagRoutes)

import userRoutes from './user/USER'
router.use('/user', userRoutes)

import loginRoutes from './user/LOGIN'
router.use('/login', loginRoutes)

import notFoundHandler from '@router/default/notFound'
router.use(notFoundHandler)

export default (): express.Router => {
  return router
}
