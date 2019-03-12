<template>
    <div class="index">
        <el-container>
            <el-aside width="200px">
                <Leftnav></Leftnav>
            </el-aside>
            <el-container>
                <el-header>
                    <Rightheader></Rightheader>
                </el-header>
                <el-main>        
                        <!-- 路由出口 -->
                        <router-view/>
                </el-main>
                <el-footer>
                    <Rightfooter></Rightfooter>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>
<script>
// 引入组件
import Leftnav from '@/components/Leftnav/Leftnav.vue'
import Rightheader from '@/components/Rightheader/Rightheader.vue'
import Rightfooter from '@/components/Rightfooter/Rightfooter.vue'
export default {
    components:{
        // 注册组件
        Leftnav,
        Rightheader,
        Rightfooter
    }
}
</script>
<style lang="less">
    @import "./Index.less";
</style>
