// 1.引入mysql模块
const mysql = require("mysql");

// 2.使用mysql的连接方法创建连接对象
const connection = mysql.createConnection({
    host:"localhost", //服务器地址
    user:"root",  //用户名
    password : 'root', // mysql的密码
    database : 'smms' // 要连接的数据库的名字
})

// 3.执行连接
connection.connect(()=>{
    console.log("数据库连接成功");
})

// 4.暴露出去
module.exports = connection;