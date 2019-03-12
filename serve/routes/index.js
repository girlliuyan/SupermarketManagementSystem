var express = require('express');
var router = express.Router();

// 后端服务器的根目录
router.get("/",(req,res)=>{
  res.send("后端服务器根目录")
})

module.exports = router;
