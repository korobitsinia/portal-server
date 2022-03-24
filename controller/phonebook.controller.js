const db = require('../app/db.config')
const respCreator = require('../app/object.creator')

class PhonebookController {

  async createPerson(req, res) {
    try {
      const { name, dep, dep_group, group_pos, num_ip, num_city, num_work, num_reserve, note } = req.body
      const newPerson = await db.query(`
          INSERT INTO phonebook.phonebook
          ( name, dep, dep_group, group_pos, num_ip, num_city, num_work, num_reserve, note)
          VALUES ($1, $2, $3, $4, $5,  $6, $7,  $8,  $9) RETURNING *`
        , [name, dep, dep_group, group_pos, num_ip, num_city, num_work, num_reserve, note])
      res.json(respCreator(200, 'Сотрудник успешно создан', newPerson.rows))
    } catch (error) {
      res.json(respCreator(400,
        'Ошибка при создании сотрудника.Проверьте правильность заполнения. Поля отмченные * являются обязательными',
        error))
    }
  }

  async getPeople(req, res) {
    try {
      const allPeople = await db.query(`SELECT * FROM phonebook.phonebook ORDER BY dep ASC,dep_group ASC, group_pos ASC`)
      res.json(respCreator(200, 'Данные сотрудников учреждения загружены', allPeople.rows))
    } catch (error) {
      res.json(respCreator(400, 'Ошибка при загрузке всех данных', error))
    }
  }

  async getDepartment(req, res) {
    try {
      const id = req.params.id
      const department = await db.query(`SELECT * FROM phonebook.phonebook WHERE dep=${id} 
                                      ORDER BY dep ASC,dep_group ASC, group_pos ASC`)
      res.json(respCreator(200, 'Данные сотрудников подразделения загружены', department.rows))
    } catch (error) {
      res.json(respCreator(400, 'Ошибка при загрузке данных сотруднков выбранного подразделения', error))
    }
  }

  async updatePerson(req, res) {
    try {
      const { id, name, dep, dep_group, group_pos, num_ip, num_city, num_work, num_reserve, note } = req.body
      const person = await db.query(`
        UPDATE phonebook.phonebook
        SET 
        name=$1, dep=$2, dep_group=$3, 
        group_pos=$4, num_ip=$5, num_city=$6,
        num_work=$7, num_reserve=$8, note=$9
        WHERE id=$10 
        RETURNING *`
        , [name, dep, dep_group, group_pos, num_ip, num_city, num_work, num_reserve, note, id])
      res.json(respCreator(200, 'Данные сотрудника обновлены', person.rows))
    } catch (error) {
      res.json(respCreator(400,
        'Ошибка при обновлении данных сотрудника.Проверьте правильность заполнения. Поля отмченные * являются обязательными',
        error))
    }
  }

  async deletePerson(req, res) {
    try {
      const id = req.params.id
      const person = await db.query(`DELETE FROM phonebook.phonebook WHERE id=${id} RETURNING *`)
      res.json(respCreator(200, `Данные сотрудника "${person.rows[0].name}" удалены`, person.rows))
    } catch (error) {
      res.json(respCreator(400, 'Ошибка при удалении данных сотрудника', error))
    }
  }
}

module.exports = new PhonebookController()