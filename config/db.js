const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'serve2save',
    password: 'vijay30406',
    port: 5432,
});

module.exports = pool;
