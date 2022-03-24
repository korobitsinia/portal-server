const Router = require('express')
const router = new Router()
const authController = require('../controller/auth.controller')


router.post('/registration', authController.registration)
router.post('/', authController.login)


module.exports = router