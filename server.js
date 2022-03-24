const express = require('express')
const cors = require('cors')
const app = express()

const authRouter = require('./routes/auth.routes.js');
const phonebookRouter = require('./routes/phonebook.routes.js');
const ordersRouter = require('./routes/orders.routes.js')

app.use(express.json())
app.use(cors())
app.use('/auth', authRouter)
app.use('/phonebook', phonebookRouter)
app.use('/orders/', ordersRouter)


app.listen(3472, (err) => {
    if (err) throw new Error(err)
    console.log('server start at port 3472');
})
