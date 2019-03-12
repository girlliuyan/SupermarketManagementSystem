<template>
    <div class="login">
        <div class="login_wrapper">
            <h2>
                <span class="iconfont">&#xe601;</span>
                欢迎进入超市后台登录界面
            </h2>
            <el-form :model="loginForm"
                    status-icon 
                    :rules="rules" 
                    ref="loginForm" 
                    label-width="100px" 
                    class="demo-ruleForm">
                <!-- 登陆账号 -->
                <el-form-item label="登录账号" prop="account">
                    <el-input  type="text" v-model="loginForm.account"></el-input>
                </el-form-item>                
                <el-form-item label="登录密码" prop="password">
                    <el-input type="text" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="text" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <!-- 路由出口 -->
        <router-view/>
    </div>
</template>
<script>
export default {
    data() {
        // 验证密码
        const passwordCheck=(rule,value,callback)=>{
            if(value===""){
                callback(new Error("密码不能为空")) //非空验证
            }else if(value.length < 3||value.length > 5){
                callback(new Error("请输入3到5个字符"))         
            }else{
                // 如果确认密码不为空 要触发一次一致性验证
                if(this.loginForm.checkPass !==""){
                    this.$refs.loginForm.validateField("checkPass")
                }
                callback();
            }
        }
        
        // 再次验证
        const validatePass=(rule,value,callback)=>{
            if(value===""){
                callback(new Error("密码不能为空")) //非空验证
            }else if(value!==this.loginForm.password){
                callback(new Error("两次密码不一致"))
            }else{
                callback();  
            }
        }
      return {
        loginForm: {
          account: '',
          password: '',
          checkPass: ''
        },
        rules: {
            account:[
                {required:true,message:"请输入登录账号",trigger:"blur"},
                {min:3,max:5,message:"长度在3到5个字符",trigger:"blur"},
            ],
            password:[
                 {required:true,validator: passwordCheck, trigger: 'blur' }
            ],
            checkPass:[
                {required:true,validator: validatePass, trigger: 'blur' }
            ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 获取表单账号和密码
            const params={
                account:this.loginForm.account,
                password:this.loginForm.password
            }
            this.req.post('/login/checklogin',params)
                    .then(res=>{
                        let {code,reason,token}=res;
                        // 把token存入浏览器
                        window.localStorage.setItem('token',token)
                        if(code===0){
                            this.$message({
                                type:'success',
                                message:reason
                            })
                            setTimeout(()=>{
                                this.$router.push('/index')
                            },2000)
                        }else if(code===1){
                            this.$message.error(reason)
                        }
                    })
                    .catch()

          } else {
            console.log('前端验证失败，不允许提交');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
};
</script>
<style lang="less">
    @import "./Login.less";
</style>
