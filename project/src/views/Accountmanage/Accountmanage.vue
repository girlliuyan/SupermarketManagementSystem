<template>
    <div class="account-manage">
        <!-- 面板 卡片组件 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix title">
                <span>账号管理</span>
            </div>
            <div  class="item">
                <el-table 
                    @selection-change="handleSelectionChange"
                    ref="tableData"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%">

                    <el-table-column
                    type="selection">
                    </el-table-column>

                    <el-table-column
                    prop="account"
                    label="账号">
                    </el-table-column>

                    <el-table-column
                    prop="usergroup"
                    label="用户组">
                    </el-table-column>
                    
                    <el-table-column
                    label="日期">
                    <template slot-scope="scope">{{ scope.row.ctime|filterctime }}</template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type='primary'
                            @click="handleEdit(scope.row.id)">
                            <i class="el-icon-edit"></i>
                            编辑
                            </el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)">
                            <i class="el-icon-delete"></i>
                            删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div style="margin-top: 20px">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentpage"
                        :page-sizes="[1, 3, 5, 10]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
                <!-- 批量删除 -->
                <div style="margin-top: 20px">
                    <el-button type='danger' @click='batchesdel'>批量删除</el-button>
                    <el-button type='primary' @click="toggleSelection()">取消选择</el-button>
                </div>
                <!-- dialog对话框 模态框 -->
                <el-dialog title="账号管理" :visible.sync="dialogFormVisible" width='400px'>
                    <el-form :model="accounteditform" :rules='rules'>
                        <el-form-item label="账号" :label-width="formLabelWidth" style="width:340px" prop="account">
                            <el-input v-model="accounteditform.account" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户组" :label-width="formLabelWidth" prop="usergroup">
                        <el-select v-model="accounteditform.usergroup" placeholder="请选择用户组">
                            <el-option label="普通用户" value="普通用户"></el-option>
                            <el-option label="超级管理员" value="超级管理员"></el-option>
                        </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-card>
        <!-- 路由出口 -->
        <router-view/>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    data(){
        return {
           tableData:[],
           accounteditform:{
               account:'',
               usergroup:''
           },
           formLabelWidth: '120px',//模态框标签的宽度
           dialogFormVisible:false,//模态框的可见性设置
           editid:'',// 编辑操作存放的id
           batchesdelId:[],//存放批量删除的id   
           rules:{ //模态框的验证
               account:[
                    {required:true,message:'请输入用户名',trigger:"blur"},//非空验证
                    {min:3,mix:5,message:'请输入3-5个字符',trigger:"blur"}//长度验证
               ],
               usergroup:[
                   {required:true,message:'请选择用户组',trigger:"change"},//非空验证
               ],
            },
            currentpage:1,//当前默认第几页
            pagesize:3,//
            total:12,//总共多少条
        }
    },
    // 钩子函数 调用账号列表
    created(){
        //账号列表功能实现
        this.accountlistbypage();
    },
    methods:{
        // 账号列表功能实现
        // accountlist(){
        //     this.req.get("/account/accountlist")
        //         .then(res=>{
        //             //刚好是数组
        //             this.tableData=res;
        //         })
        //         .catch(error=>{
        //             console.log(error);
        //         })
        // },
        // 分页 根据页码 实现列表功能
        accountlistbypage(){
            let params={
                currentpage:this.currentpage,
                pagesize:this.pagesize
            }
            // console.log(params)
            // 发送axios给后端
            this.req.get('/account/accountlistbypage',params)
                    .then(res=>{
                        let {total,data}=res;
                        this.total=total;
                        this.tableData=data;
                        if(!data.length&&this.currentpage!=1){
                            this.currentpage-=1;
                            this.accountlistbypage();
                        }

                    })
                    .catch(err=>{
                        console.log(err)
                    })
        },
        // 删除功能的实现
        handleDelete(id){
            this.$confirm('是否删除该账号', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
                .then(() => {//确定删除
                    // console.log(id)
                    this.req.get('/account/accountdel',{id})
                            .then(res=>{
                                let {code,reason}=res;
                                if(code===0){
                                    this.$message({
                                        type:'success',
                                        message:reason
                                    })
                                }else if(code===1){
                                    this.$message.err(reason)
                                }                        
                                // 重新请求列表数据
                                this.accountlistbypage();
                            })
                            .catch(error=>{ 
                                console.log(error)
                            })
                })
                .catch(() => {//取消删除
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });   
                })       

        },
        // 修改功能
        handleEdit(id){
            this.dialogFormVisible=true,
            this.req.get('/account/accountedit',{id})
                .then(res=>{
                    // console.log(res)
                    // 接收后端返回来的数据
                    let { account,usergroup,id }=res[0];
                    // console.log(account,usergroup)
                    // 渲染到页面
                        this.accounteditform.account=account;
                        this.accounteditform.usergroup=usergroup;
                        this.editid=id;
                })
                .catch(error=>{
                    console.log(error)
                })
        },
        //修改 保存修改
        saveEdit(){
            this.dialogFormVisible=false;
            let params={
                account:this.accounteditform.account,
                usergroup:this.accounteditform.usergroup,
                id:this.editid
            }
            // console.log(params)
            this.req.post('/account/accountsaveedit',params)
                .then(res=>{
                    const {code,reason}=res;
                    if(code===0){
                        this.$message({
                            type:'success',
                            message:reason
                        })
                    }else if(code===1){
                         this.$message.error(reason)
                    }
                    this.accountlistbypage();
                })
                .catch(err=>{
                    console.log(err)
                })
        },
        //批量删除 取消选择
        toggleSelection(){
            this.$refs.tableData.clearSelection();
        },
        // 
        handleSelectionChange(val){
            this.batchesdelId=val.map(v=>v.id)
            // console.log(this.batchesdelId)
        },
        // 批量删除
        batchesdel(){
            this.$confirm('是否进行批量删除', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).
                then(() => {
                    let id=this.batchesdelId
                     if(!id.length){
                        this.$message.error('你没有选择')
                        return 
                        }
                    this.req.get('/account/accountbatchesdel',{id:this.batchesdelId})
                            .then(res=>{
                                   
                                let {code,reason}=res;
                                if(code===0){
                                    // 接收提示
                                    this.$message({
                                        type:'success',
                                        message:reason
                                    })
                                    // 渲染页面 调用账号列表功能
                                    this.accountlistbypage();
                                }else if(code===1){
                                    this.$message.error(reason)
                                }
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                })
                .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                    });          
                });
           
        },
        // 分页功能
        handleSizeChange(val) {
           this.pagesize=val;
           this.accountlistbypage();
        },
        handleCurrentChange(val) {
            this.currentpage=val;
            this.accountlistbypage();
        }
    },
    // 过滤器
    filters:{
        filterctime(ctime){
            // console.log(ctime)
            return moment(ctime).format('YYYY-MM-DD hh:mm:ss')
        }
    }
}
</script>
<style lang="less">
    @import './Accountmanage.less';
</style>
