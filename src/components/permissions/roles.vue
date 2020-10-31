<template>
	<div>
	  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <el-button type="primary" @click="visibleBoolean2 = true">添加角色</el-button>
       <el-table :data="dataTable" size="small" border stripe v-loading="loading">
         <!--展开项-->
         <el-table-column type="expand">
           <template slot-scope="props">
             <!--一级展开列表-->
             <el-row v-for="(item,index) in props.row.children" :key="item.id" :class="['bdbuttom', index == 0 ? 'bdtop' : '']">
               <el-col :span="6">
                 <el-tag closable>{{ item.authName }}</el-tag>
                 <i class="el-icon-caret-right"></i>
               </el-col>
               <el-col :span="18">
                 <!--二级张开列表-->
                 <el-row v-for="(item2,index2) in item.children" :key="item2.id" :class="[index2 == 0 ? '' : 'bdtop']">
                   <el-col :span="7">
                     <el-tag type="success" closable>{{ item2.authName}}</el-tag>
                     <i class="el-icon-caret-right"></i>
                   </el-col>
                   <el-col :span="17">
                     <el-row>
                       <el-col :span="24">
                         <!--三级张开列表-->
                         <el-tag type="warning"  v-for="item3 in item2.children" :key="item3.id" closable @close="deleteRole(props.row,item3.id)">{{item3.authName}}</el-tag>
                       </el-col>
                     </el-row>
                   </el-col>
                 </el-row>
               </el-col>
             </el-row>
           </template>
         </el-table-column>
         <el-table-column type="index" label="#">
         </el-table-column>
         <el-table-column label="角色名称" prop="roleName"></el-table-column>
         <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
         <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="compile(scope.row)">编辑</el-button>
              <template>
              <el-popconfirm title="确定要删除该用户吗？" @onConfirm="remove(scope.row)">
                <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="grant(scope.row)">分配权限</el-button>
          </template>
         </el-table-column>
       </el-table>
    </el-card>

    <!--分配权限的对话框-->
    <el-dialog :visible.sync="visibleBoolean" width="450px" title="分配权限" @close="closeCallback()">
      <!--树形控件，用来展示权限列表-->
      <el-tree :data="dataTree" :props="defaultProps"  node-key="id" show-checkbox default-expand-all :default-checked-keys="checkedKeys" @check="currentChange()" ref="tree"></el-tree>
      <span slot="footer"></span>
    </el-dialog>

    <!--添加角色-->
    <el-dialog :visible.sync="visibleBoolean2" width="400px" @opened="focus()">
      <el-form :model="form" label-position="left" label-width="90px">
        <el-form-item label="角色名：">
          <el-input v-model="form.roleName" ref="iFocus"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
         <el-button type="info" @click="clearRole()">取消</el-button>
        <el-button type="primary" @click="addRole()">添加</el-button>
      </span>
    </el-dialog>

    <!--编辑角色-->
    <el-dialog :visible.sync="visibleBoolean3" width="400px" @opened="focus()">
      <el-form :model="form2" label-position="left" label-width="90px">
        <el-form-item label="角色名：">
          <el-input v-model="form2.roleName" ref="iiFocus"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="form2.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
         <el-button type="info" @click="visibleBoolean3 = false">取消</el-button>
        <el-button type="primary" @click="replaceRole()">编辑</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
	export default {
      data(){
        return {
          dataTable: [],
          loading: true,
          visibleBoolean: false,
          visibleBoolean2: false,
          visibleBoolean3: false,
          roleId: '', //定义用户ID，为后面添加用户权限做铺垫
          dataTree: [],
          defaultProps: {
            label: 'authName',
            children: 'children'
          },
          checkedKeys: [],
          form: {
            roleName: '',
            roleDesc: ''
          },
          form2: {
            roleName: '',
            roleDesc: ''
          }
        }
      },
      methods: {
        //并发axios请求，对el-table的数据初始化
        async getDataTable(){
          const {data: res} = await this.axios.get('roles')
          if(res.meta.status !== 200) return
          this.dataTable = res.data
          this.loading =false
        },
        //删除角色指定权限
        async deleteRole(row,id){
          const {data: res} = await this.axios.delete('roles/' + row.id + '/rights/' + id)
          if(res.meta.status !== 200) return
          row.children = res.data
        },
        //发送请求获取el-tree的data绑定值并设置默认勾选项
        async grant(row){
         const {data: res} = await this.axios.get('rights/tree')
         if(res.meta.status !== 200) return
          this.dataTree = res.data
          this.idForEach(row,this.checkedKeys)
          this.roleId = row.id
          this.visibleBoolean = true
        },
        //这个方法是给上一个方法调用的，目的是获取第三层数组嵌套中的ID值
        //forEach()更方便遍历嵌套数组，使用递归即可获得想要的值
        idForEach(node,arr){
          //因为第三层数组中是没有children属性，所以可以通过判断来得治是否处在第三层
          if(!node.children){
            return arr.push(node.id)
          }
          node.children.forEach(item=>{
            this.idForEach(item,arr)
          })
        },
        //重置this.checkedKeys的值,防止多次点击不同的分配角色按钮都往this.checkedKeys里添加值
        closeCallback(){
          this.checkedKeys = []
        },
        //勾选复选框触发该事件
       async currentChange(){
          const idstr = [
            ...this.$refs.tree.getCheckedKeys(),
            ...this.$refs.tree.getHalfCheckedKeys()
          ]
          const keys = idstr.join(',')
          const {data: res} = await this.axios.post('roles/' + this.roleId + '/rights', {rids: keys})
          if(res.meta.status !== 200) return
          this.visibleBoolean =false
          this.getDataTable()
        },
        //发起请求，添加用户并重置输入框
         async addRole(){
          const {data: res} = await this.axios.post('roles', this.form)
          if(res.meta.status !== 201) return
          this.visibleBoolean2 = false
          this.form.roleName = this.form.roleDesc = ''
          this.getDataTable()
        },
        //发起请求，删除该用户
       async remove(row){
         const {data: res} = await this.axios.delete('roles/' + row.id)
         if(res.meta.status !== 200) return
          this.getDataTable()
        },
        //关闭dialog，重置输入框
        clearRole(){
          this.visibleBoolean2 =false
          this.form.roleName = this.form.roleDesc = ''
        },
        //el-dialog在展开后获得焦点
        focus(){
          if(this.visibleBoolean2 == true){
            this.$refs.iFocus.focus()
          }
          if(this.visibleBoolean3 == true){
            this.$refs.iiFocus.focus()
          }
        },
        compile(row){
          this.form2.roleName = row.roleName
          this.form2.roleDesc = row.roleDesc
          this.roleId = row.id
          this.visibleBoolean3 = true
        },
       async replaceRole(){
         const {data: res} = await this.axios.put('roles/' + this.roleId, this.form2)
         if(res.meta.status !== 200) return
          this.visibleBoolean3 = false
        this.form2.roleName = this.form2.roleDesc = ''
          this.getDataTable()
       }
      },
      created(){
        this.getDataTable()
      }
  }
</script>

<style scoped>
   .el-card{
    margin-top: 10px;
   }
   .el-tag{
    margin: 7px;
   }
   .bdtop{
    border-top: 1px solid #eee;
   }
   .bdbuttom{
    border-bottom: 1px solid #eee;
   }
   .el-row{
    display: flex;
    align-items: center;
   }
   .el-table{
    margin-top: 10px;
   }
</style>




