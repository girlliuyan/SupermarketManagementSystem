<template>
    <div class=".password-modify">
        <!-- 面板 卡片组件 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix title">
                <span>密码修改</span>
            </div>
            <div  class="item">
                <el-form :model="passwordModifyForm"
                    status-icon 
                    :rules="rules" 
                    size='small'
                    ref="passwordModifyForm" 
                    label-width="120px" 
                    style='width:400px;'
                    class="demo-ruleForm">
                    <!-- 登陆账号 -->
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input  type="text" v-model="passwordModifyForm.oldPassword"></el-input>
                    </el-form-item>  

                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="text" v-model="passwordModifyForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码：" prop="checkPass">
                        <el-input type="text" v-model="passwordModifyForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('passwordModifyForm')">提交</el-button>
                        <el-button @click="resetForm('passwordModifyForm')">重置</el-button>
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
        // 检测旧密码
        let validateOldPwd=(rule,value,callback)=>{
            this.req.get('/account/checkoldpwd',{value:value})
                    .then(res=>{
                        let {code,reason}=res;
                        if(code===1){ //验证失败
                            callback(new Error(reason))
                        }else if(code===0){ //验证成功
                            callback()
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
        }
        // 新密码验证
        let validateNewPwd=(rule,value,callback)=>{
            if(value===''){//非空验证
                callback(new Error('请输入密码'))
            }else if(value.length<3||value.length>5){
                callback(new Error('请输入3-5位密码'))
            }else if(value===this.passwordModifyForm.oldPassword){//不能和旧密码一致
                callback(new Error('新密码不能和原密码一致'))
            }else{
                if(this.passwordModifyForm.checkPass!==''){
                    this.$refs.passwordModifyForm.validateField('checkPass');
                }
                callback();
            }
        }
        // 确认新密码
        let validatePass=(rule,value,callback)=>{
            if(value===''){//非空验证
                callback(new Error('请输入密码'))
            }else if(value!==this.passwordModifyForm.newPassword){
                callback(new Error('您输入的密码不一致'))
            }else{
                callback()
            }
        }
        return {
            passwordModifyForm:{
                oldPassword:'',
                newPassword:'',
                checkPass:'',
            },
            rules:{
                oldPassword:[
                    {required:true,validator:validateOldPwd,trigger:"blur"}
                ],
                newPassword:[
                    {required:true,validator:validateNewPwd,trigger:"blur"}
                ],
                checkPass:[
                    {required:true,validator:validatePass,trigger:"blur"}
                ],
            }
        }
    },
    methods:{
        submitForm(){
            this.$refs.passwordModifyForm.validate((valid)=>{
                if(valid){
                    const params={
                        newPassword:this.passwordModifyForm.newPassword
                    }
                    this.req.get('/account/passwordmodify',params)
                            .then(res=>{
                                const {code,reason}=res
                                if(code===0){
                                    this.$message({
                                        type:'success',
                                        message:reason
                                    })
                                    // 清除token
                                    window.localStorage.removeItem('token')
                                    setTimeout(()=>{
                                        this.$router.push('/login')
                                    },2000)
                                }
                            })
                            .catch(err=>{
                                console.log(err)
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
    @import './Passwordmodify.less';
</style>
