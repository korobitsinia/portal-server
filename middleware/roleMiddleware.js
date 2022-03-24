const jwt = require('jsonwebtoken')
const { secret } = require('../app/secret')
const respCreator = require('../app/object.creator')

module.exports = function (role,lvl) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {

            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.json(respCreator(400, 'Пользователь не авторизован'))
            }

            const { roles } = jwt.verify(token, secret)
            let hasRole = false
            if(lvl <= roles[role]) {
                hasRole = true
            }

            if (!hasRole) {
                return res.json(respCreator(400, 'У вас нет прав на выполнение этой операции'))
            }
            next()
        } catch (e) {
            return res.json({ message: "Войдите в систему" })
        }
    }
}