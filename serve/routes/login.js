var express = require('express');
var router = express.Router();
// 引入数据库连接模块
const connection = require("./connectMysql")

// 引入jwt
const jwt=require('jsonwebtoken')

// 秘钥
const secretKey = 'itsource'

// 拦截所有的请求 解决跨域问题
router.all('*',(req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*"); //允许的域
  res.setHeader("Access-Control-Allow-Headers","authorization"); //允许携带的头
  next();
})

// 后端服务器的根目录
router.post("/checklogin",(req,res)=>{
  // 接收消息
  let {account,password}=req.body;
  const sqlStr = `select * from account where account='${account}' and password='${password}'`;
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    if(data.length){ //登录成功
      // 转化成真正的对象 浅拷贝
      const userInfo = Object.assign({},data[0])
      // 生成token
      const token=jwt.sign(userInfo, secretKey,{
        expiresIn:60*60*2 //token过期时间 以秒为单位
      })
      res.send({code:0,reason:'欢迎您，登录成功！',token:token})
    }else{
      res.send({code:1,reason:'登录失败，请检查你的用户名或密码'})
    }
  })
})

module.exports = router;
