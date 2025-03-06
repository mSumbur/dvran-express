// const { Sequelize } = require("sequelize")
import { Sequelize } from "sequelize"

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME = '', MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env
const [host, port] = MYSQL_ADDRESS.split(":")

const sequelize = new Sequelize("dvran_test", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port: parseInt(port + ''),
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
})

// 数据库初始化方法
// async function init() {
//   await Counter.sync({ alter: true });
// }

export default sequelize

// 导出初始化方法和模型
// module.exports = {
//   init,
  // sequelize
// }
