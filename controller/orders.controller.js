const db = require('../app/db.config')
const respCreator = require('../app/object.creator')


class OrdersController {

    async getActiveOrders(req, res) {
        try {
            const activeOrders = await db.query(`SELECT 
            id,
            incoming_num, 
            executor,
            text, 
            to_char(deadline,'yyyy-mm-dd') as deadline
            FROM orders.orders
            WHERE completed = 'false' ORDER BY deadline ASC `)
            res.json(respCreator(200, 'Активные задачи загружены', activeOrders.rows))
        } catch (error) {
            res.json(respCreator(400, 'Ошибка при загрузке активных задач', error))
        }
    }

    async createOrder(req, res) {
        try {
            const { deadline, incoming_num, executor, text } = req.body
            const newOrder = await db.query(`
              INSERT INTO orders.orders ( deadline, incoming_num, executor, text) VALUES ($1, $2, $3, $4) RETURNING *`
                , [deadline, incoming_num, executor, text])
            res.json(respCreator(200, 'Задача успешно создан', newOrder.rows))
        } catch (error) {
            res.json(respCreator(400,
                'Ошибка при создании задачи.Проверьте правильность заполнения.',
                error))
        }
    }

    async updateOrder(req, res) {
        try {
            const { id, deadline, incoming_num, executor, text } = req.body
            const order = await db.query(`
            UPDATE orders.orders SET deadline=$2, incoming_num=$3, executor=$4, 
            text=$5 WHERE id=$1 RETURNING *`,
                [id, deadline, incoming_num, executor, text])
            res.json(respCreator(200, 'Данные задачи обновлены', order.rows))
        } catch (error) {
            res.json(respCreator(400,
                'Ошибка при обновлении данных задачи.Проверьте правильность заполнения.',
                error))
        }
    }

    async deleteOrder(req, res) {
        try {
            const id = req.params.id
            const order = await db.query(`DELETE FROM orders.orders WHERE id=${id} RETURNING *`)
            res.json(respCreator(200, `Задача "${order.rows[0].text}" удалена`, order.rows))
        } catch (error) {
            res.json(respCreator(400, 'Ошибка при удалении задачи', error))
        }
    }

    async completeOrder(req, res) {
        try {
            const { id, outgoing_num } = req.body
            console.log(id, outgoing_num);
            const order = await db.query(`
            UPDATE orders.orders SET completed='true' WHERE id=$1`, [id]);
            const addArchive = await db.query(`INSERT INTO orders.archive(
                outgoing_num, order_id) VALUES ( $1, $2)`, [outgoing_num, id])
            res.json(respCreator(200, 'Задача выполнена и перемещена в архив', addArchive.rows))
        } catch (error) {
            res.json(respCreator(400,
                'Ошибка при выполнении задачи.Проверьте правильность заполнения.',
                error))
        }
    }

    async getArchiveOrders(req, res) {
        try {
            const archiveOrders = await db.query(`
            SELECT 
            orders.archive.id, 
            orders.archive.end_date,
            orders.archive.outgoing_num, 
            orders.orders.text
            FROM orders.archive LEFT JOIN orders.orders
            ON archive.order_id = orders.id
            ORDER BY end_date ASC
            LIMIT 300
            `)
            res.json(respCreator(200, 'Архив задач загружен', archiveOrders.rows))
        } catch (error) {
            res.json(respCreator(400, 'Ошибка при загрузке архива задач', error))
        }
    }

    async returnFromArchive(req, res) {
        try {
            const { id, order_id } = req.body
            const removeOrdrFromArchive = await db.query(`
            DELETE FROM orders.archive WHERE id=$1 RETURNING *`, [id]);
            console.log(removeOrdrFromArchive.rows[0]);
            const changeOrderStatus = await db.query(`
            UPDATE orders.orders SET completed='false' WHERE id=$1`,
                [removeOrdrFromArchive.rows[0].order_id])
            res.json(respCreator(200, 'Статус задачи изменен', changeOrderStatus.rows))
        } catch (error) {
            res.json(respCreator(400, 'Ошибка при изменении статуса задачи', error))
        }
    }

}

module.exports = new OrdersController()
