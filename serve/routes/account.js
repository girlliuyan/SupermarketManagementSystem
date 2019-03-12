var express = require('express');
var router = express.Router();

// 引入数据库连接的模块
const connection = require("./connectMysql")

// 秘钥
const secretKey = 'itsource'
// 验证token的有效性
const expressJwt = require('express-jwt');

// 拦截路由
router.all('*',(req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*"); //允许的域
  res.setHeader("Access-Control-Allow-Headers","authorization"); //允许携带的头
  next();
})

//使用中间件验证token合法性
router.use(expressJwt ({
  secret:  secretKey 
}).unless({
  path: ['/login/checklogin']  //不需要验证的地址login
}));

//拦截器
router.use(function (err, req, res, next) {
  //如果用户的请求没有携带token 会报错
  if (err.name === 'UnauthorizedError') {   
      //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
      res.status(401).send('invalid token...');
  }
});

// 添加账号功能实现
router.post("/accountsubmit",(req,res)=>{
  // 接收数据 解构
  const {account,password,usergroup} = req.body;
  // console.log(account,password,usergroup);
  // 把数据存入数据库 前提在mysql里面建有account表
  const sqlStr = `insert into account(account,password,usergroup) values('${account}','${password}','${usergroup}')`;
  // console.log(sqlStr)
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err
    if(data.affectedRows>0){
      res.send({code:0,reason:'添加账号成功'})
    }else{
      res.send({code:0,reason:'添加账号失败'})
    }
    // console.log(data)
  })
  
})

//  账号列表功能实现
router.get('/accountlist',(req,res)=>{
  // 查询列表的所有数据
  const sqlStr = 'select * from account order by ctime desc';
  // 执行sql语句
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      // data 就是操作结果
      res.send(data);
    })
  // console.log(sqlStr);
  // res.send('1')
})

// 删除功能的实现
router.get('/accountdel',(req,res)=>{
  // 接收前端传过来的id
  let  {id} = req.query;
  // 根据id查询要删除的数据
  const sqlStr = `delete from account where id='${id}'`;
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if (err) throw err;
      // 判断
    if(data.affectedRows>0){
      res.send({code:0,reason:'删除数据成功'})
    }else{
      res.send({code:1,reason:'删除数据失败'})
    }
  })
})

// 修改功能
router.get('/accountedit',(req,res)=>{
  let {id}=req.query;
  // 根据sql语句查询对应的数据
  let sqlStr = `select * from account where id='${id}'`;
  // console.log(sqlStr);
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    res.send(data);
  })

})
// 保存修改
router.post('/accountsaveedit',(req,res)=>{
    let {id,account,usergroup}=req.body;

    // 根据sql语句查询对应的数据
    const sqlStr = `update account set account='${account}', usergroup='${usergroup}' where id=${id}`
    // console.log(sqlStr);
    // 执行sql语句
    connection.query(sqlStr,(err,data)=>{
      if(err) throw err;
      if(data.affectedRows>0){
        res.send({code:0,reason:'修改数据成功'})
      }else{
        res.send({code:1,reason:'修改数据失败'})
      }
    })
})

// 批量删除
router.get('/accountbatchesdel',(req,res)=>{
  // 接收id
  let {id}=req.query;
  // sqlStr语句
  let sqlStr = `delete from account where id in (${id})`;
  // 执行sqlStr语句
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    if(data.affectedRows>0){
      res.send({code:0,reason:'批量删除成功'})
    }else{
      res.send({code:0,reason:'批量删除失败'})
    }
  })
})

// 分页
router.get('/accountlistbypage',(req,res)=>{
  // 接收当前页和设置的页码数
  let {currentpage,pagesize}=req.query;
  // 根据条件写sql语句
  let sqlStr = `select * from account order by ctime desc`;
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    let total=data.length;
    let n=(currentpage-1)*pagesize;

    sqlStr += ` limit ${n},${pagesize}`;    // sql拼接
    // 执行sql语句
    connection.query(sqlStr,(err,data)=>{
      if(err) throw err;
      res.send({total,data})
    })
  })
})

// 获取用户名
router.get('/getaccountName',(req,res)=>{
  const accountName = req.user.account;
  res.send({accountName})
  // console.log('当前登录用户:', req.user);
})

// 检测旧密码
router.get('/checkoldpwd',(req,res)=>{
  let {value}=req.query;
  if(value===req.user.password){
    res.send({code:0,reason:'原密码正确'})
  }else{
    res.send({code:1,reason:'原密码错误'})
  }
})

// 保存密码修改
router.get('/passwordmodify',(req,res)=>{
  let {newPassword}=req.query
  let {id}=req.user
  // sqlStr语句 根据id修改密码
  const sqlStr =`update account set password='${newPassword}' where id=${id}`;
  // 执行sqlStr
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    if(data.affectedRows>0){
      res.send({code:0,reason:'密码修改成功'})
    }else{
      res.send({code:1,reason:'密码修改失败'})
    }
  })
})


module.exports = router;
