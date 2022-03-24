const Router = require('express')
const router = new Router()
const phonebookController = require('../controller/phonebook.controller')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/',roleMiddleware("phonebook",2), phonebookController.createPerson)
router.get('/', phonebookController.getPeople)
router.get('/:id', phonebookController.getDepartment)
router.put('/', roleMiddleware("phonebook",2), phonebookController.updatePerson)
router.delete('/:id',roleMiddleware("phonebook",2), phonebookController.deletePerson)



module.exports = router