const Router = require('express')
const router = new Router()
const ordersController = require('./../controller/orders.controller')
const roleMiddleware = require('../middleware/roleMiddleware')

router.get('/', ordersController.getActiveOrders)
router.post('/',roleMiddleware("orders",2), ordersController.createOrder)
router.put('/', roleMiddleware("orders",2), ordersController.updateOrder)
router.delete('/:id',roleMiddleware("orders",2), ordersController.deleteOrder)
router.put('/complete', roleMiddleware("orders",2), ordersController.completeOrder)

router.get('/archive', ordersController.getArchiveOrders)
router.put('/archive', roleMiddleware("orders",2), ordersController.returnFromArchive)


module.exports = router