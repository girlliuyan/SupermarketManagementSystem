<template>
    <div class="right-header">
        <el-row>
            
            <el-col :span="20">
                <i class="el-icon-location-outline"></i>
                欢迎登陆华联超市管理系统！
            </el-col>

            <el-col :span="2">
                <div class="avater">
                    <img src="./avater.jpg" alt="">
                </div>
            </el-col>

            <el-col :span="2">
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{accountName}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command='personal'>个人中心</el-dropdown-item>
                        <el-dropdown-item command='logout'>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data(){
        return {
            accountName:'',
        }
    },
    methods:{
        // 点击下拉菜单触发的函数
        handleCommand(command) {
            if(command==='logout'){
                // 清除token
                window.localStorage.removeItem('token');
                // 弹提示
                this.$message({
                    type:'success',
                    message:'退出成功，欢迎下次登录！'
                })
                setTimeout(() => {
                    // 跳到登录页面
                    this.$router.push('/login')
                }, 1000);
            }
        },
        // 获取用户名
        getaccountName(){
            this.req.get('/account/getaccountName')
                    .then(res=>{
                        this.accountName=res.accountName;
                    })
                    .catch(err=>{
                        console.log(err)
                    })
        }
    },
    // 钩子函数
    created(){
        this.getaccountName();
    }
}
</script>
<style lang="less">
    @import './Rightheader.less';
</style>
