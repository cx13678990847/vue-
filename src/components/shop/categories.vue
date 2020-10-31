<template>
	<div>
	  <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item>首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
       <el-button type="primary" @click="addClassify()">添加分类</el-button>
       <el-table size="small" border stripe :data="dataTable" v-loading="loading" row-key="cat_id">
       	  <el-table-column label="#" type="index"></el-table-column>
       	  <el-table-column label="分类名称" prop="cat_name"></el-table-column>
       	  <el-table-column label="是否有效">
       	  	<template slot-scope="scope">
       	  		<i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color: lightgreen;"></i>
       	  		<i class="el-icon-error" v-else style="color: red;"></i>
       	  	</template>
       	  </el-table-column>
       	  <el-table-column label="排序">
       	  	<template slot-scope="scope">
       	  		<el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
       	  		<el-tag v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
       	  		<el-tag v-else type="warning">三级</el-tag>
       	  	</template>
       	  </el-table-column>
       	  <el-table-column label="操作" width="180px">
       	  	 <template slot-scope="scope">
       	  	 	<el-button type="primary" icon="el-icon-edit" size="mini" @click="editCategory(scope.row)">编辑</el-button>
                <template>
                   <el-popconfirm title="确定要删除该项？" @onConfirm="remove(scope.row)">
                   <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini">删除</el-button>
                   </el-popconfirm>
                </template>
       	  	 </template>
       	  </el-table-column>
       </el-table>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="list.pagenum"
        :page-sizes="[2, 3, 4,5]"
        :page-size="list.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      </el-card>

      <!--添加分类-->
      <el-dialog :visible.sync="visibleBoolean" title="添加分类" width="450px"  @opened="focus()">
      	<el-form label-position="right" label-width="110px" :model="form" :rules="rules" ref="form">
      		<el-form-item label="分类名称：" prop="input">
      		   <el-input v-model="form.input" clearable ref="inputFocus"></el-input>
      		</el-form-item>
      		<el-form-item label="父级分类：">
      		   <el-cascader
      		      v-model="form.value"
      		      :options="options"
      		      :props="{expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', checkStrictly: true, children: 'children'}"
      		      clearable
      		   ></el-cascader>
      		</el-form-item>
      	</el-form>
      	<span slot="footer">
      		<el-button>取消</el-button>
      		<el-button type="primary" @click="add()">确定</el-button>
      	</span>
      </el-dialog>

      <!--编辑分类-->
      <el-dialog :visible.sync="visibleBoolean2" title="修改分类名称" width="450px" @opened="focus()">
      	<el-form label-position="right" label-width="110px" :model="form1" :rules="rules1">
      		<el-form-item label="分类名称" prop="name">
      			<el-input v-model="form1.name" ref="inputFocus1"></el-input>
      		</el-form-item>
      	</el-form>
      	<span slot="footer">
      		<el-button @click="visibleBoolean2 = false">取消</el-button>
      		<el-button type="primary" @click="addCatego()">确定</el-button>
      	</span>
      </el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
              list: {
                type: 3,
                pagenum: 1,  //当前页码数
                pagesize: 4 //当前页面显示条数
              },
              total: 0,
              dataTable: [],  //接收el-table的data数据
              loading: true,
              visibleBoolean: false,
              visibleBoolean2: false,
              options: [],  //父级分类
              id: '', //分类ID，为下面提交编辑分类做铺垫
              form: {
              	input: '',
              	value: []
              },
              form1: {
              	name: ''
              },
              formNameCopy: '',
              rules: {
              	input: [
                  { required: true, message: '不能为空', trigger: 'blur' }
              	]
              },
              rules1: {
              	name: [
                  { required: true, message: '不能为空', trigger: 'blur' }
              	]
              }
			}
		},
		methods: {
			//获取页面数据
          async getShopList(){
             const {data: res} = await this.axios.get('categories', { params: this.list })
             if(res.meta.status !== 200) return
             this.total = res.data.total
             this.loading = false
             this.dataTable = res.data.result
           },
           //当页码数发生变化时触发
           handleCurrentChange(newPagenumValue){
              this.list.pagenum = newPagenumValue
              this.getShopList()
           },
           //当页面显示条数发生变化时触发
           handleSizeChange(newPagesizeValue){
           	this.list.pagesize = newPagesizeValue
           	this.getShopList()
           },
           //获取级联选择器需要的数据
          async addClassify(){
            const {data: res} = await this.axios.get('categories', { params: { type: 2}})
            if(res.meta.status !== 200) return
            this.options = res.data
            this.visibleBoolean = true
           },
           //对添加分类的表单进行验证，添加分类
           add(){
           	this.$refs.form.validate(async (value)=>{
              if(!value) return
              //当级联选择器的值为空时，新建一个分类名称
              if(this.form.value.length == 0){
              	const {data: res} = await this.axios.post('categories', {
              		cat_pid: 0, cat_name: this.form.input, cat_level: 0
              	})
              }
              //当级联选择器的值为一个时新，建一个子分类名称
              if(this.form.value.length == 1){
              	const {data: res} = await this.axios.post('categories', {
              		cat_pid: 1, cat_name: this.form.input, cat_level: 1
              	})
              }
              this.visibleBoolean = false
              this.getShopList()
           	})
           },
           //展开编辑分类的el-dialog，绑定它的表单元素
           editCategory(row){
              this.form1.name = this.formNameCopy = row.cat_name
              this.id = row.cat_id
              this.visibleBoolean2 = true
           },
           //当el-table展开触发，让表单获取焦点
           focus(){
           	if(this.visibleBoolean){
           		this.$refs.inputFocus.focus()
           	}
           	if(this.visibleBoolean2){
           		this.$refs.inputFocus1.focus()
           	}
           },
           //提交编辑分类
          async addCatego(){
          	if(this.form1.name === this.formNameCopy){
          	   return this.visibleBoolean2 = false
          	}
             const {data: res} = await this.axios.put('categories/' + this.id, { cat_name: this.form1.name})
             if(res.meta.status !== 200) return
             this.visibleBoolean2 = false
             this.getShopList()
           },
           //删除该分类
          async remove(row){
           	this.id = row.cat_id
            const {data: res} = await this.axios.delete('categories/' + this.id)
            if(res.meta.status !== 200) return
            this.getShopList()
           }
		},
		created(){
           this.getShopList()
		}
	}
</script>

<style scoped>
   .el-pagination, .el-card, .el-table{
     margin-top: 10px;
   }
</style>




