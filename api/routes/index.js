const router = require('express').Router()

const usersRouter = require('./user.router')
const productsRouter = require('./product.router')
const categoriesRouter = require('./category.router')

router.use('/users', usersRouter)
router.use('/products', productsRouter)
router.use('/categories', categoriesRouter)

module.exports = router