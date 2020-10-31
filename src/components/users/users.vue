<template>
	<div>
    <!--面包屑组件-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
    <el-card>
      <el-input clearable  placeholder="请输入搜索内容" v-model="list.query" ref="searchFocus" @clear="userList()">
         <el-button slot="append" icon="el-icon-search" @click="userList()"></el-button>
      </el-input>
      <el-button class="button" type="primary" @click="visibleBoolean = true">添加用户</el-button>
      <!--表格组件-->
      <el-table :data="tableData" border size="mini" stripe v-loading="loading">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="create_time"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
               v-model="scope.row.mg_state"
               @change="updataValue(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyUser(scope.row)" :disabled="scope.row.id == 500 ? true : false"></el-button>
            <template>
              <el-popconfirm title="确定要删除该用户吗？" @onConfirm="remove(scope.row)">
                <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini" :disabled="scope.row.id == 500 ? true : false"></el-button>
              </el-popconfirm>
            </template>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="allotRole(scope.row)" :disabled="scope.row.id == 500 ? true : false"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="list.pagenum"
        :page-sizes="[2, 3, 4]"
        :page-size="list.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户的对话框-->
    <el-dialog :visible.sync="visibleBoolean" width="450px" @opened="focus()" title="添加用户">
      <el-form ref="form" :model="form" label-position="right" label-width="80px" :rules="rules">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="form.username" ref="inputFocus" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="mobile">
          <el-input v-model="form.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="form.password" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="info" @click="clear()">取消</el-button>
        <el-button type="primary" @click="add()">确实</el-button>
      </span>
    </el-dialog>

    <!--修改用户的对话框-->
    <el-dialog :visible.sync="visibleBoolean2" width="450px" @opened="focus()">
      <el-form ref="form2" :model="form2" label-position="right" label-width="80px" :rules="rules2">
        <el-form-item label="用户名">
          <el-input v-model="form2.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form2.email" ref="ifocus"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form2.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="info" @click="visibleBoolean2 = false">取消</el-button>
        <el-button type="primary" @click="compile()">确实</el-button>
      </span>
    </el-dialog>

    <!--分配角色的对话框-->
    <el-dialog :visible.sync="visibleBoolean3" width="450px" title="分配角色" @opened="focus()">
      <div>
        <p>当前的用户： {{ roleName }}</p>
        <p>当前的角色： {{ role }}</p>
        <p>分配新角色：
          <el-select v-model="value" placeholder="请选择" ref="selectOption">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button type="info" @click="clearSelect()">取消</el-button>
        <el-button type="primary" @click="roleAmend()">确实</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	export default {
		data(){
			//对输入的用户名自定义验证
			return {
        tableData: [],
        roleName: '', //定义用户名
        role: '', //定义角色名
        value: '', //定义下拉选择框选中的值
        options: [], //为el-select的下拉菜单接受数据
        id: '', //定义用户ID,为分配角色发送请求提供帮助
        list: {
          query: '',
          pagenum: 1,
          pagesize: 4
        },
        total:0,
        visibleBoolean: false,  //是否展现添加用户对话框的布尔值
        visibleBoolean2: false, //是否展现修改用户对话框的布尔值
        visibleBoolean3: false, //是否展现分配角色对话框的布尔值
        disabled: false, //让第一排拍的用户按钮为禁用
        loading: true, //加载数据时显示动效
        //添加用户的表单model绑定的值
        form: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //修改用户的表单model绑定的值
        form2: {},
        //添加用户的表单项自定义验证
        rules: {
          username: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          email: [
              { required: true, message: '请输入email', trigger: 'blur' }
          ],
          mobile: [
              { required: true, message: '请输入电话', trigger: 'blur' }
          ],
        },
        //修改用户的表单项自定义验证
        rules2: {
          email: [
              { required: true, message: '请输入email', trigger: 'blur' }
          ],
          mobile: [
              { required: true, message: '请输入电话', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      //获取table里的数据
      async userList(){
       const {data:res} = await this.axios.get('users',{ params: this.list})
       if(res.meta.status !== 200) return;
        this.tableData = res.data.users;
        this.loading = false;
        this.total = res.data.total;
        this.$refs.searchFocus.focus();
      },
      //pagesize的值发生改变时调用，根据新的值发送axios请求，来显示页面中有几条数据
      handleSizeChange(newSize){
        this.list.pagesize = newSize;
        this.userList();
      },
      //currentPage 改变时会触发，根据新的值发送axios请求，来显示数据在哪一页
      handleCurrentChange(newCurrent){
        this.list.pagenum = newCurrent;
        this.userList();
      },
      //修改状态值
     async updataValue(value){
        const {data: res} = await this.axios.put(`users/${value.id}/state/${value.mg_state}`);
      },
      //el-dialog组件展开后表单项自动获取焦点
      focus(){
        if(this.visibleBoolean == true){
          this.$refs.inputFocus.focus()
        }
        if(this.visibleBoolean2 == true){
          this.$refs.ifocus.focus()
        }
        if(this.visibleBoolean3 == true){
          this.$refs.selectOption.focus()
        }
      },
      //验证表单，然后发送请求添加用户
      add(){
        this.$refs.form.validate( async (valid)=>{
        if(!valid) return;
        const {data:res} = await this.axios.post('users',this.form)
        if(res.meta.status == 201){
          this.$message.success('添加成功')
          this.visibleBoolean = false
          this.total++
          this.$refs.form.resetFields()
          this.userList()
        }
        })
      },
      //关闭el-dialog,，进行重置
      clear(){
        this.visibleBoolean = false
        this.$refs.form.resetFields()
      },
      //删除用户
     async remove(row){
        const {data: res} = await this.axios.delete('users/' + row.id)
        if(res.meta.status == 200){
          this.$message.success('删除成功')
          this.userList()
        }
      },
      //发送请求获取该用户信息，绑定到修改用户的表单上
     async modifyUser(row){
        this.visibleBoolean2 = true
        const {data: res} =await this.axios.get('users/' + row.id)
        this.form2 = res.data
      },
      //修改用户信息
      compile(){
        this.$refs.form2.validate(async valid=>{
          if(!valid) return;
          const {data: res} = await this.axios.put('users/' + this.form2.id,{email: this.form2.email, mobile: this.form2.mobile})
          if(res.meta.status == 200){
            this.userList()
            this.visibleBoolean2 = false
          }
        })
      },
      //获取分配角色的<el-dialog>中需要的数据
     async allotRole(row){
        this.roleName = row.username
        this.role = row.role_name
        this.id = row.id
        const {data: res} = await this.axios.get('roles')
        if(res.meta.status !== 200) return
        this.options = res.data
        this.visibleBoolean3 = true
      },
      //确定修改分配角色
     async roleAmend(){
       if(this.value === '') return
       const {data: res} = await this.axios.put("users/" + this.id + '/role', { rid: this.role})
       if(res.meta.status !== 200) return
       this.visibleBoolean3 = false
       this.value = ''
       this.userList();

      },
      //关闭分配角色的el-dialog，进行重置
      clearSelect(){
        this.visibleBoolean3 = false
        this.value = ''
      }
    },
    created(){
      this.userList();
    }
  }
</script>

<style scoped>
   .el-input{
    width: 300px;
   }
   .button{
    margin-left: 15px;
   }
   .el-table{
    font-size: 12px;
    margin-top: 10px;
   }
   .el-pagination{
    margin-top: 10px;
   }
   .el-card{
    margin-top: 10px;
   }
</style>
<style>
    .el-dialog__footer{
      margin-top: -50px;
    }
    .el-table .el-button{
    margin-right: 5px;
   }
</style>



