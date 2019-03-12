<template>
    <div class="left-nav">
        <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="rgb(48, 65, 86)"
        text-color="#fff"
        unique-opened
        router
        active-text-color="rgb(64, 158, 255)">

            <el-submenu  :index="index+''" v-for='(menu,index) in menuData' :key="index">
                <template slot="title">
                    <span class="iconfont" v-html="menu.iconfont"></span>
                    <span>{{menu.title}}</span>
                </template>
                <el-menu-item v-for='(submenu,index) in menu.children' :key="index" :index="submenu.path">{{submenu.subTitle}}</el-menu-item>        
            </el-submenu>

            <!-- <el-submenu index="2">
                <template slot="title">
                    <span class="iconfont">&#xe609;</span>
                    <span>账号管理</span>
                </template>
                <el-menu-item index="/index/accountmanage">账号管理</el-menu-item>
                <el-menu-item index="/index/accountadd">账号添加</el-menu-item>
                <el-menu-item index="/index/passwordmodify">密码修改</el-menu-item>
            </el-submenu>

            <el-submenu index="3">
                <template slot="title">
                    <span class="iconfont">&#xe65d;</span>
                    <span>商品管理</span>
                </template>
                <el-menu-item index="/index/goodsmanage">商品管理</el-menu-item>
                <el-menu-item index="/index/goodsadd">商品添加</el-menu-item>
            </el-submenu>

            <el-submenu index="4">
                <template slot="title">
                    <span class="iconfont">&#xe616;</span>
                    <span>统计管理</span>
                </template>
                <el-menu-item index="/index/salesstatistics">销售统计</el-menu-item>
                <el-menu-item index="/index/stockstatistics">进货统计</el-menu-item>
            </el-submenu> -->

        </el-menu>
    </div>
</template>
<script>
export default {
    data(){
        return {
            menuData:[
                    // 系统管理
                    {
                    title:"系统管理",
                    iconfont:"&#xe6a6;",
                    children:[
                        {subTitle:"系统信息",
                        path:"/index"}
                        ]
                    },
                    // 账号管理
                    {
                    title:"账号管理",
                    iconfont:"&#xe609;",
                    children:[
                        {subTitle:"账号管理",
                        path:"/index/accountmanage"},

                        {subTitle:"账号添加",
                        path:"/index/accountadd"},

                        {subTitle:"密码修改",
                        path:"/index/passwordmodify"}
                        ]
                    },
                    // 商品管理
                    {
                    title:"商品管理",
                    iconfont:"&#xe65d;",
                    children:[
                        {subTitle:"商品管理",
                        path:"/index/goodsmanage"},
                        {subTitle:"商品添加",
                        path:"/index/goodsadd"}
                        ]
                    },
                    // 统计管理
                    {
                    title:"统计管理",
                    iconfont:"&#xe616;",
                    children:[
                        {subTitle:"销售统计",
                        path:"/index/salesstatistics"},
                        {subTitle:"进货统计",
                        path:"/index/stockstatistics"}
                        ]
                    },
                ]
            
        }
    },
    methods:{

    }
};
</script>
<style lang="less">
    @import "./Leftnav.less";
</style>