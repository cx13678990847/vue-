<template>
	<div>
	   <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
       </el-breadcrumb>
       <el-card>
       	 <el-alert
       	    title="添加商品信息"
       	    type="info"
       	    center
       	    show-icon
       	    :closable = "false"
       	 ></el-alert>
       	 <el-steps :active="parseInt(active)" finish-status="success">
       	 	 <el-step title="基本信息"></el-step>
       	 	 <el-step title="商品参数"></el-step>
       	 	 <el-step title="商品属性"></el-step>
       	 	 <el-step title="商品图片"></el-step>
       	 	 <el-step title="商品内容"></el-step>
       	 	 <el-step title="完成"></el-step>
       	 </el-steps>
         <el-form :model="addShopMessage" :rules="rules" ref="ruleForm" label-position="top">
       	   <el-tabs tab-position="left" v-model="active" :before-leave="selectTab" @tab-click="tabClick()">
       	 	<el-tab-pane label="基本信息" name="0">
       	 	   <el-form-item label="商品名称" prop="goods_name">
       	 	   	 <el-input v-model="addShopMessage.goods_name"></el-input>
       	 	   </el-form-item>
       	 	   <el-form-item label="商品价格" prop="goods_price">
       	 	   	 <el-input v-model="addShopMessage.goods_price"></el-input>
       	 	   </el-form-item>
       	 	   <el-form-item label="商品重量" prop="goods_weight">
       	 	   	 <el-input v-model="addShopMessage.goods_weight"></el-input>
       	 	   </el-form-item>
       	 	   <el-form-item label="商品数量" prop="goods_number">
       	 	   	 <el-input v-model="addShopMessage.goods_number"></el-input>
       	 	   </el-form-item>
       	 	   <el-form-item label="商品分类" prop="goods_cat">
       	 	   	<el-cascader
      		      v-model="addShopMessage.goods_cat"
      		      :options="options"
      		      :props="{expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children'}"
      		      clearable
      		      @change="upOptions"
      		    ></el-cascader>
      		    <el-alert
       	          title="注意:只能选择第三类商品"
       	          type="warning"
       	          show-icon
       	          :closable = "false"
       	        ></el-alert>
       	 	   </el-form-item>
       	 	</el-tab-pane>
       	 	<el-tab-pane label="商品参数" name="1">
       	 	   <el-form-item :label="item.attr_name" v-for="item in items" :key="item.attr_id">
       	 	    <el-checkbox-group v-model="item.attr_vals">
       	 	   	 <el-checkbox :label="item2" v-for="(item2,index) in item.attr_vals" :key="index" border></el-checkbox>
       	 	   	</el-checkbox-group>
       	 	   </el-form-item>
       	 	</el-tab-pane>
       	 	<el-tab-pane label="商品属性" name="2">
       	 		<el-form-item :label="todo.attr_name" v-for="todo in staticShop" :key="todo.attr_id">
       	 			<el-input v-model="todo.attr_vals"></el-input>
       	 		</el-form-item>
       	 	</el-tab-pane>
       	 	<el-tab-pane label="商品图片" name="3">
       	 		<el-upload
       	 		  action="https://www.liulongbin.top:8888/api/private/v1/upload"
       	 		  list-type="picture"
       	 		  :headers="headersToken"
       	 		  :on-success="successImage"
       	 		  :on-remove="removeImage"
       	 		  :on-preview="previewImage"
       	 		>
       	 	      <el-button size="small" type="primary">点击上传</el-button>
       	 		</el-upload>
       	 	</el-tab-pane>
       	 	<el-tab-pane label="商品内容" name="4">
       	 		<quill-editor v-model="addShopMessage.goods_introduce"></quill-editor>
       	 		<el-button type="primary" @click="addShop()">添加商品</el-button>
       	 	</el-tab-pane>
       	   </el-tabs>
       	 </el-form>
       </el-card>

       <!--图片预览-->
       <el-dialog :visible.sync="visibleBoolean" title="图片预览">
          <el-image
            :src="url"
            fit="scale-down"
          ></el-image>
       </el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return{
              active: "0",
              options: [],
              items: [], //接收商品参数的数据
              staticShop: [], //接收商品属性的数据
              visibleBoolean: false,
              url: '',
              headersToken: {
                 Authorization: window.sessionStorage.getItem('token')
              },
              addShopMessage: {
                 goods_name: '',
                 goods_price: 1,
                 goods_weight: 1,
                 goods_number: 1,
                 goods_cat: [],
                 pics: [],
                 goods_introduce: '',
                 attrs: []
              },
              rules: {
              	goods_name: [
                  { required: true, message: '请输入名称', trigger: 'blur'}
              	],
              	goods_price: [
                  { required: true, message: '请输入价格', trigger: 'blur'}
              	],
              	goods_weight: [
                  { required: true, message: '请输入重量', trigger: 'blur'}
              	],
              	goods_number: [
                  { required: true, message: '请输入数量', trigger: 'blur'}
              	],
              	goods_cat: [
                  { required: true, message: '请输入数量', trigger: 'blur'}
              	]
              }
			}
		},
		methods: {
		 //获取商品分类的层级链式数据
          async getOptions(){
             const {data: res} = await this.axios.get('categories', {params: { type: 3}})
             if(res.meta.status !== 200) return
             this.options = res.data
	      },
	      //只能选择第三级商品
	     async upOptions(){
	      	if(this.addShopMessage.goods_cat.length !==3){
	      		this.addShopMessage.goods_cat = []
	      	}
	      },
	      //通过el-tabs的before-leave属性绑定函数，当用户没有选择商品分类时禁止切换
	      selectTab(activeName, oldActiveName){
	      	if(oldActiveName === '0' && this.addShopMessage.goods_cat.length !==3){
	      		this.$message.error('请选择商品分类')
	      		return false
	      	}
	      },
	      //选择不同的el-tabs选项获取不同的数据
	     async tabClick(){
	     	const valueId = this.addShopMessage.goods_cat[this.addShopMessage.goods_cat.length - 1]
	      	if(this.active === '1'){
	      		const {data: res} = await this.axios.get(`categories/${valueId}/attributes`, {params: { sel: 'many'}})
	      		if(res.meta.status !== 200) return
	      		res.data.forEach(ite=>{
                   ite.attr_vals = ite.attr_vals.length == 0 ? [] : ite.attr_vals.split(',')
	      		})
	      	    this.items = res.data
              console.log(this.items)
	      	}
	      	if(this.active === '2'){
	      		const {data: res} = await this.axios.get(`categories/${valueId}/attributes`, {params: { sel: 'only'}})
	      		if(res.meta.status !== 200) return
	      		this.staticShop = res.data

	      	}
	      },
	      //图片上传成功后触发，在this.addShopMessage.pics中保存图片的临时路径，为后面添加商品信息做铺垫
	      //以下三个方法都是上传el-upload上的
	      successImage(response){
	      	const picInfo = {
	      		pic: response.data.tmp_path
	      	}
	      	this.addShopMessage.pics.push(picInfo)
	      },
	      //图片移除后触发，在this.addShopMessage.pics中删除相应的临时路径
	      removeImage(file){
            const tmp=file.response.data.tmp_path
            this.addShopMessage.pics.forEach((item,index)=>{
            	if(item.pic == tmp){
            		this.addShopMessage.pics.splice(index,1)
            	}
            })
	      },
	      //预览图片
	      previewImage(file){
	      	this.url = file.response.data.url
            this.visibleBoolean = true
	      },
        //对整个添加商品的表单信息验证
	      addShop(){
	      	this.$refs.ruleForm.validate(async valid=>{
	      		if(!valid){
	      			this.$message.error('请填写必要的表单项')
	      		}
	      		//在这里使用JSON的两个方法目的是将this.addShopMessage对象进行深复制
	      		//再将它里面的goods_cat属性值转换为字符串，便于添加商品发送请求体
	      	    const concatAdd = JSON.stringify(this.addShopMessage)
	      	    const concatShop = JSON.parse(concatAdd)
	      	    concatShop.goods_cat = concatShop.goods_cat.join(',')
              //添加参数
              this.items.forEach(ite=>{
                concatShop.attrs.push({
                  attr_id: ite.attr_id,
                  attr_value: ite.attr_vals.join(',')
                })
              })
              //添加属性
              this.staticShop.forEach(ite=>{
                concatShop.attrs.push({
                  attr_id: ite.attr_id,
                  attr_value: ite.attr_vals
                })
              })
              const {data: res} = await this.axios.post('goods',concatShop)
              if(res.meta.status !== 201) return
              this.active = parseInt(this.active) + 1
              this.$router.push('/goods')
	      	})
	      }
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
	.el-steps{
		width: 80%;
		margin: 10px auto;
	}
	.el-form .el-alert{
		width: 220px;
		height: 20px;
		margin-top: 5px;
	}
	.el-checkbox{
      margin: 0 10px 0 0 !important;
	}
	.el-button{
		margin-top: 10px;
	}
</style>










