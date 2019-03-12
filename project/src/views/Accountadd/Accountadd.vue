<template>
    <div class="account-add">
        <!-- 面板 卡片组件 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix title">
                <span>添加账号</span>
            </div>
            <div  class="item">
                <el-form :model="accountForm"
                    status-icon 
                    :rules="rules" 
                    size='small'
                    ref="accountForm" 
                    label-width="120px" 
                    class="demo-ruleForm">
                    <!-- 登陆账号 -->
                    <el-form-item label="用户名：" prop="account">
                        <el-input  type="text" v-model="accountForm.account"></el-input>
                    </el-form-item>  

                    <el-form-item label="密码：" prop="password">
                        <el-input type="text" v-model="accountForm.password" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码：" prop="checkPass">
                        <el-input type="text" v-model="accountForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                     <el-form-item label="选择用户组：" prop="usergroup">
                        <el-select v-model="accountForm.usergroup" placeholder="选择用户组：">
                        <el-option label="普通用户" value="普通用户"></el-option>
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('accountForm')">提交</el-button>
                        <el-button @click="resetForm('accountForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <!-- 路由出口 -->
        <router-view/>
    </div>
</template>
<script>
import qs from 'qs';
export default {
    data(){
        let validatePwd=(rule,value,callback)=>{
            if(value===''){//非空验证
                callback(new Error('请输入密码'))
            }else if(value.length<3||value.length>5){
                callback(new Error('请输入3-5位密码'))
            }else{
                if(this.accountForm.checkPass!==''){
                    this.$refs.accountForm.validateField('checkPass');
                }
                callback();
            }
        }
        let validatePass=(rule,value,callback)=>{
            if(value===''){//非空验证
                callback(new Error('请输入密码'))
            }else if(value!==this.accountForm.password){
                callback(new Error('您输入的密码不一致'))
            }else{
                callback()
            }
        }
        return {
            accountForm:{
                account:'',
                password:'',
                checkPass:'',
                usergroup:''
            },
            rules:{
                account:[
                    {required:true,message:'请输入用户名',trigger:"blur"},//非空验证
                    {min:3,max:5,message:'请输入3-5位字符',trigger:"blur"}//字符数验证
                ],
                password:[
                    {required:true,validator:validatePwd,trigger:"blur"}
                ],
                checkPass:[
                    {required:true,validator:validatePass,trigger:"blur"}
                ],
                usergroup:[
                    {required:true,message:"请选择用户组",trigger:"change"}
                ]
            }
        }
    },
    methods:{
        submitForm(){
            this.$refs.accountForm.validate((valid)=>{
                if(valid){
                    const params ={
                        account:this.accountForm.account,
                        password:this.accountForm.password,
                        usergroup:this.accountForm.usergroup
                    }
                    this.req.post("/account/accountsubmit",params)
                            .then(res=>{
                                // console.log(response.data);
                                // 解构 拿数据
                                let {code,reason} = res;
                                // 判断
                                if(code===0){//成功
                                    // 弹提示信息
                                    this.$message({
                                        message: reason,
                                        type: 'success'
                                    });
                                    // 跳转页面到账号管理
                                    this.$router.push('/index/accountmanage');
                                }else if(code===1){
                                    // 弹失败信息
                                    this.$message.error(reason)
                                }
                            })
                            .catch(error=>{
                                console.log(error)
                            })
                }else{
                    // alert("前端验证失败，不允许提交");
                    this.$message.error('前端验证失败，不允许提交');
                    return false;
                }
            })
        },
        resetForm(nameFrom){
            this.$refs[nameFrom].resetFields();
        }
    }
}
</script>
<style lang="less">
    @import './Accountadd.less';
</style>
