<template>
	<div>
	   <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>分类参数</el-breadcrumb-item>
       </el-breadcrumb>
       <el-card>
       	 <el-alert
            type="warning"
            show-icon
            :closable = 'false'
            title="注意: 只允许为第三级分类设置相关参数！"
       	 ></el-alert>
       	 <p>选择商品分类:
       	 	<el-cascader
      		   v-model="value"
      		   :options="options"
      		   :props="{expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children'}"
      		    clearable
      		    @change="upOptions"
      		></el-cascader>
       	 </p>
       	 <!--Tabs标签页-->
       	 <el-tabs v-model="activeName">
       	 	<el-tab-pane label="动态参数" name="first">
       	 	  <template v-if="tabShow">
       	 		<el-button type="primary" @click="visibleBoolean = true">添加参数</el-button>
       	 		<el-table size="small" border stripe :data="dataTableDynamic">
       	 			<el-table-column type="expand">
       	 			   <template slot-scope="scope">
       	 			   	  <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="closeTag(scope.row,index)">{{item}}</el-tag>
       	 			   	  <!--动态编辑标签-->
       	 			   	  <!--这里有一个bug需要注意：像这样编写动态标签，当同时展开两项参数时，标签的添加会同步执行，原因：每项参数添加的标签都共享了inputVisible和inputValue。 解决思路：在获取参数数据时为每项手动添加inputVisible和inputValue属性-->
       	 			   	  <el-input
                             class="input-new-tag"
                             v-if="scope.row.inputVisible"
                             v-model="scope.row.inputValue"
                             ref="saveTagInput"
                             size="small"
                             @keyup.enter.native="handleInputConfirm(scope.row)"
                             @blur="handleInputConfirm(scope.row)"
                          >
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
       	 			   </template>
       	 			</el-table-column>
       	 			<el-table-column type="index" label="#"></el-table-column>
       	 			<el-table-column label="参数名称" prop="attr_name"></el-table-column>
       	 			<el-table-column label="操作">
       	 				<template slot-scope="scope">
       	 				   <el-button type="primary" icon="el-icon-edit" size="mini" @click="amend(scope.row)">修改</el-button>
       	 				   <el-popconfirm title="确定要删除该用户吗？" @onConfirm="remove(scope.row)">
                              <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini">删除</el-button>
                           </el-popconfirm>
       	 				</template>
       	 			</el-table-column>
       	 		</el-table>
       	 	  </template>
       	 	  <p v-else>暂无数据，请选择</p>
       	 	</el-tab-pane>
       	 	<el-tab-pane label="静态属性" name="second">
       	 	  <template v-if="tabShow">
       	 		<el-button type="primary" @click="visibleBoolean = true">添加属性</el-button>
       	 		<el-table size="small" border stripe :data="dataTableStatic">
       	 			<el-table-column type="expand">
       	 			   <template slot-scope="scope">
       	 			   	  <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="closeTag(scope.row,index)">{{item}}</el-tag>
       	 			   	  <!--动态编辑标签-->
       	 			   	  <!--这里有一个bug需要注意：像这样编写动态标签，当同时展开两项参数时，标签的添加会同步执行，原因：每项参数添加的标签都共享了inputVisible和inputValue。 解决思路：在获取参数数据时为每项手动添加inputVisible和inputValue属性-->
       	 			   	  <el-input
                             class="input-new-tag"
                             v-if="scope.row.inputVisible"
                             v-model="scope.row.inputValue"
                             ref="saveTagInput"
                             size="small"
                             @keyup.enter.native="handleInputConfirm(scope.row)"
                             @blur="handleInputConfirm(scope.row)"
                          >
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
       	 			   </template>
       	 			</el-table-column>
       	 			<el-table-column type="index" label="#"></el-table-column>
       	 			<el-table-column label="属性名称" prop="attr_name"></el-table-column>
       	 			<el-table-column label="操作">
       	 				<template slot-scope="scope">
       	 				  <el-button type="primary" icon="el-icon-edit" size="mini" @click="amend(scope.row)">修改</el-button>
                          <el-popconfirm title="确定要删除该用户吗？" @onConfirm="remove(scope.row)">
                             <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini">删除</el-button>
                          </el-popconfirm>
       	 				</template>
       	 			</el-table-column>
       	 	    </el-table>
       	 	  </template>
       	 	  <p v-else>暂无数据，请选择</p>
       	 	</el-tab-pane>
       	 </el-tabs>
       </el-card>

       <!--添加参数和添加属性的el-dialog组件-->
       <el-dialog :visible.sync="visibleBoolean" :title="message" width="450px" @opened="focus()">
       	  <el-form label-position="right" label-width="110px" :model="form" :rules="rules" ref="form">
       	  	<el-form-item :label="messageLabel" prop="value" ref="formItem">
       	  		<el-input v-model="form.value" ref="inputFocus"></el-input>
       	  	</el-form-item>
       	  </el-form>
       	  <span slot="footer">
       	  	 <el-button @click="clear()">取消</el-button>
       	  	 <el-button type="primary" @click="addParameter()">确定</el-button>
       	  </span>
       </el-dialog>

       <!--修改参数和修改属性的el-dialog组件-->
       <el-dialog :visible.sync="visibleBoolean2" :title="text" width="450px" @opened="focus()">
          <el-form label-position="right" label-width="110px" :model="formTow" :rules="rules" ref="form2">
       	  	<el-form-item :label="messageLabel" prop="value">
       	  		<el-input v-model="formTow.value" ref="inputFocusTow"></el-input>
       	  	</el-form-item>
       	  </el-form>
       	  <span slot="footer">
       	  	<el-button @click="visibleBoolean2 = false">取消</el-button>
       	  	<el-button type="primary" @click="confirmAmend()">确定</el-button>
       	  </span>
       </el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
              value: [],
              options: [], //级联选择器接收数据
              dataTableDynamic: [], //动态参数的el-table的data绑定数据
              dataTableStatic: [], //静态属性的el-table的data绑定数据
              activeName: 'first',
              valueId: '', //第三列表的ID值
              attrId: '', //属性ID
              tabShow: false,
              visibleBoolean: false,
              visibleBoolean2: false,
              form2Value: '', //这是formTow.value值的一个副本，目的是为了下面修改做帮助
              form: {
              	value: ''
              },
              formTow: {
              	value: ''
              },
              rules: {
              	value: [
                   { required: true, message: '不能为空', trigger: 'blur' }
              	]
              },
			}
		},
		methods: {
		  //获取级联选择器数据赋值
          async getOptions(){
             const {data: res} = await this.axios.get('categories', {params: { type: 3}})
             if(res.meta.status !== 200) return
             this.options = res.data
	      },
	     //级联选择器的值发生变化时调用
	      upOptions(){
	      	this.dynamic()
	      	this.staticAttribute()
	      },
	      //获取动态参数的数据
	     async dynamic(){
	      	if(this.value.length !== 3 || this.value.length == 0){
	      		this.value = []
	      		this.tabShow = false
	      	}
	      	this.valueId = this.value[this.value.length-1]
	      	this.tabShow = true
            const {data: res} = await this.axios.get(`categories/${this.valueId}/attributes`, {params: {sel: 'many'}})
            if(res.meta.status !== 200) return
            //这里是为参数展开添加标签做辅助
            res.data.forEach((item)=>{
               //当item.attr_vals有值时，字符串变数组，当空值时，赋予空数组，目的是防止空值时也会渲染标签
               item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
               //手动添加inputVisible和inputValue，为动态添加标签做辅助
               item.inputVisible = false
               item.inputValue = ''
            })
            this.dataTableDynamic = res.data
	      },
	      //获取静态属性的数据
	      async staticAttribute(){
	      	if(this.value.length !== 3 || this.value.length == 0){
	      		this.value = []
	      		this.tabShow = false
	      	}
	      	this.valueId = this.value[this.value.length-1]
            const {data: res} = await this.axios.get(`categories/${this.valueId}/attributes`, {params: {sel: 'only'}})
            if(res.meta.status !== 200) return
            //这里是为属性展开添加标签做辅助
            res.data.forEach((item)=>{
               //当item.attr_vals有值时，字符串变数组，当空值时，赋予空数组，目的是防止空值时也会渲染标签
               item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
               //手动添加inputVisible和inputValue，为动态添加标签做辅助
               item.inputVisible = false
               item.inputValue = ''
            })
            this.dataTableStatic = res.data
	      },
	      //动态参数和静态属性添加
	      addParameter(){
	      	 this.$refs.form.validate(async valid=>{
	      	 	if(!valid) return
	      	 	if(this.activeName == 'first'){
	      	 	  const {data: res} = await this.axios.post(`categories/${this.valueId}/attributes`, {attr_name: this.form.value, attr_sel: 'many'})
	      	      if(res.meta.status !== 201) return
	      	    }else{
	      	       const {data: res} = await this.axios.post(`categories/${this.valueId}/attributes`, {attr_name: this.form.value, attr_sel: 'only'})
	      	       if(res.meta.status !== 201) return
	      	    }
	      	    this.visibleBoolean = false
	      	    this.form.value = ''
	      	    this.upOptions()
	      	 })
	      },
	      //获取焦点
	      focus(){
	      	if(this.visibleBoolean){
	      	  this.$refs.inputFocus.focus()
	      	}
	      	if(this.visibleBoolean2){
	      	  this.$refs.inputFocusTow.focus()
	      	}
	      },
	      //清空并重置
	      clear(){
	      	this.$refs.form.resetFields()
	      	this.visibleBoolean = false
	      },
	      //将参数名称或属性名称导入到修改的dialog中的表单
	      amend(row){
	      	this.formTow.value = this.form2Value = row.attr_name
	      	this.attrId = row.attr_id
	      	this.visibleBoolean2 = true
	      },
	      //对修改按钮弹出的dialog里的表单验证修改值
	      confirmAmend(){
	      	if(this.formTow.value == this.form2Value){
	      		return this.visibleBoolean2 = false
	      	}
	      	this.$refs.form2.validate(async valid=>{
	      		if(!valid) return
	      		//如果el-tabs处在动态参数处就发送这个请求其次就发送另外个请求
	      		if(this.activeName == 'first'){
	      		   const {data: res} = await this.axios.put(`categories/${this.valueId}/attributes/${this.attrId}`, {attr_name: this.formTow.value, attr_sel: 'many'})
	      	       if(res.meta.status !== 200) return
	      	    }else{
	      	       const {data: res} = await this.axios.put(`categories/${this.valueId}/attributes/${this.attrId}`, {attr_name: this.formTow.value, attr_sel: 'only'})
	      	       if(res.meta.status !== 200) return
	      	    }
	      	    this.visibleBoolean2 = false
	      	    this.upOptions()
	      	})
          },
         async remove(row){
             const {data: res} = await this.axios.delete(`categories/${this.valueId}/attributes/${row.attr_id}`)
             if(res.meta.status !== 200) return
             this.upOptions()
          },
          //以下事件都是动态编辑标签中需要的
           showInput(row){
           	   row.inputVisible = true
           	   this.$nextTick(_ => {
                 this.$refs.saveTagInput.$refs.input.focus()
               })

           },
           handleInputConfirm(rowValue){
           	 let inputValue = rowValue.inputValue.trim()
             if (inputValue) {
             	rowValue.attr_vals.push(inputValue)
             	if(this.activeName === 'first'){
                   this.axios.put(`categories/${this.valueId}/attributes/${rowValue.attr_id}`, {attr_name: rowValue.attr_name, attr_sel: 'many', attr_vals: rowValue.attr_vals.join(',')})
             	}else{
             	   this.axios.put(`categories/${this.valueId}/attributes/${rowValue.attr_id}`, {attr_name: rowValue.attr_name, attr_sel: 'only', attr_vals: rowValue.attr_vals.join(',')})
             	}
             }
             rowValue.inputVisible = false
             rowValue.inputValue = ''
           },
           closeTag(row,index){
               row.attr_vals.splice(index,1)
               if(this.activeName === 'first'){
                 this.axios.put(`categories/${this.valueId}/attributes/${row.attr_id}`, {attr_name: row.attr_name, attr_sel: 'many', attr_vals: row.attr_vals.join(',')}
                 )
               }else{
               	 this.axios.put(`categories/${this.valueId}/attributes/${row.attr_id}`, {attr_name: row.attr_name, attr_sel: 'only', attr_vals: row.attr_vals.join(',')}
                 )
               }
           }
	    },
	    computed: {
	    	message(){
	    		if(this.activeName == 'first'){
	    			return '添加动态参数'
	    		}else{
	    			return '添加静态属性'
	    		}
	    	},
	    	messageLabel(){
	    		if(this.activeName == 'first'){
	    			return '动态参数'
	    		}else{
	    			return '静态属性'
	    		}
	    	},
	    	text(){
	    		if(this.activeName == 'first'){
	    			return '修改动态参数'
	    		}else{
	    			return '修改静态属性'
	    		}
	    	},
	    },
	    created(){
	    	this.getOptions()
	    }
	}
</script>

<style scoped>
   .el-card{
      margin-top: 10px;
   }
   .el-table{
   	margin-top: 10px;
   }
    .el-tabs p{
      color: gray;
   }
   .el-tag{
   	margin: 3px;
   }
   .input-new-tag{
   	width: 6em;
   }
</style>




