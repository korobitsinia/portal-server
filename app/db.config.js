const { Pool } = require("pg")

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    max: 20,
    database: 'portal',
    user: 'portal',
    password: 'zaS35vVb',
})


module.exports = pool