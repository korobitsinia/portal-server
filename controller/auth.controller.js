const db = require('../app/db.config')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('../app/secret')
const respCreator = require('../app/object.creator')

const geterateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }
  return jwt.sign(payload, secret, { expiresIn: "365d" })
}

class AuthController {

  async registration(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.json(respCreator(400, "Ошибка при регистрации (пустые поля)"))
      }
      const { username, password } = req.body

      const candidateForRegistration = await db.query(`SELECT * FROM auth.users WHERE username=$1`, [username])
      if (candidateForRegistration.rows[0]) {
        return res.json(respCreator(400, "Пользователь с таким именем уже существует"))
      }

      const salt = bcrypt.genSaltSync(2)
      const hashPassword = bcrypt.hashSync(password, salt)
      const user = await db.query(
        `INSERT INTO auth.users(username, password, permission_id)
        VALUES ($1, $2, $3)`, [username, hashPassword, 10])
      return res.json(respCreator(200, "Пользователь успешно зарегестрирован"))

    } catch (error) {
      return res.json(respCreator(400, "Ошибка в процессе регистрации", error))
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body
      const queryResult = await db.query(` SELECT 
      auth.users.id, 
      auth.users.username,
      auth.users.password, 
      auth.permissions.phonebook, 
      auth.permissions.orders, 
      auth.permissions.statistics, 
      auth.permissions.calendar, 
      auth.permissions.park, 
      auth.permissions.reserve
      FROM auth.users LEFT JOIN auth.permissions
      ON users.permission_id = permissions.id WHERE username=$1`, [username]);
      const user = queryResult.rows[0]
      if (!user) {
        return res.json(respCreator(400, `Пользователь ${username} не найден`,))
      }

      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.json(respCreator(400, `Введен не верный пароль`))
      }

      const access = {
        username: user.username,
        phonebook: user.phonebook,
        orders: user.orders,
        statistics: user.statistics,
        calendar: user.calendar,
        park: user.park,
        reserve: user.reserve
      }
      const token = geterateAccessToken(user.id, user)
      return res.json(respCreator(200, `Вы вошли под именем ${username}`, { token, access }))

    } catch (error) {
      return res.json(respCreator(400, `Ошибка в процессе входа`,error))
    }
  }
}

module.exports = new AuthController()
