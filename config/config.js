const dotenv = require('dotenv').config();
module.exports = {
    database: process.env.APP_DB_NAME,
    username: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASSWD,
    host: process.env.APP_DB_HOST,
    dialect: 'mysql',
    define: {
        underscored: true
    }
}
