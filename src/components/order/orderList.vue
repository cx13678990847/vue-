<template>
	<div>
	   <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
       </el-breadcrumb>
       <el-card>
       	  <el-input clearable placeholder="请输入内容" class="search" v-model="list.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
          </el-input>
          <el-table size="small" border stripe :data="orderList" v-loading="loading">
          	<el-table-column label="#" type="index"></el-table-column>
          	<el-table-column label="订单编号" prop="order_number" width="170px"></el-table-column>
          	<el-table-column label="订单价格" prop="order_price"></el-table-column>
          	<el-table-column label="是否付款">
          		<template slot-scope="scope">
          			<el-tag type="danger" v-if="scope.row.pay_status == 0">未付款</el-tag>
          			<el-tag type="success" v-else>已付款</el-tag>
          		</template>
          	</el-table-column>
          	<el-table-column label="是否发货" prop="is_send"></el-table-column>
          	<el-table-column label="下单时间" width="140px">
          		<template slot-scope="scope">
          			{{ scope.row.create_time | capitalize}}
          		</template>
          	</el-table-column>
          	<el-table-column label="操作" width="130px">
          		<template slot-scope="scope">
          			<el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row)"></el-button>
          			<el-button type="success" icon="el-icon-location-outline" size="mini" @click="outline()"></el-button>
          		</template>
          	</el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="list.pagenum"
            :page-sizes="[8, 16, 24]"
            :page-size="list.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
       </el-card>

       <!--修改地址-->
       <el-dialog :visible.sync="visibleBoolean" title="修改地址" width="450px">
       	 <el-form ref="form" :model="form" label-position="right" label-width="90px" :rules="rules">
       	 	<el-form-item label="省市区/县" prop="address1">
       	 	   <el-cascader
      		   v-model="form.address1"
      		   :options="options"
      		    clearable
      		></el-cascader>
       	 	</el-form-item>
       	 	<el-form-item label="详细地址" prop="address2">
       	 	   <el-input v-model="form.address2"></el-input>
       	 	</el-form-item>
       	 </el-form>
       </el-dialog>

       <!--物流进度-->
       <el-dialog :visible.sync="visibleBoolean2" title="物流进度" width="450px">
       </el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				orderList: [],
				options: [],  //没有素材文件模板，无法获取options数据源
				visibleBoolean: false,
				visibleBoolean2: false,
				loading: true,
				total: 0,
				form: {
					address1: [],
					address2: ''
				},
				list: {
					query: '',
					pagenum: 1,
					pagesize: 8
				},
				rules: {
					address1: [
                      {required: true, message: '请选择省市区县', trigger: 'blur'}
					],
					address2: [
                      {required: true, message: '请填写详细地址', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
		//获取表格信息
		 async getOrderList(){
            const {data:res} = await this.axios.get('orders',{ params: this.list})
            if(res.meta.status !== 200) return
            this.loading = false
            this.orderList = res.data.goods
            this.total = res.data.total
		  },
		  //当页面显示条数发生变化时触发
		  handleSizeChange(newPagesizeValue){
		  	this.list.pagesize = newPagesizeValue
		  	this.getOrderList()
		  },
		  //当页码数发生变化时触发
		  handleCurrentChange(newPagenumValue){
		  	this.list.pagenum = newPagenumValue
		  	this.getOrderList()
		  },
		  editClick(row){
		 	this.visibleBoolean = true

		  },
		  outline(){
		  	this.visibleBoolean2 = true
		  }
		},
		//过滤器，用于将创建时间选项的毫秒数转化为正常的年月日时间
		filters: {
         capitalize: function(value){
          const dt = new Date(value)
          const y = dt.getFullYear()
          const m = (dt.getMonth() + 1 + '').padStart(2, '0')
          const d = (dt.getDate() + '').padStart(2, '0')
          const h = (dt.getHours() + '').padStart(2, '0')
          const f = (dt.getMinutes() + '').padStart(2, '0')
          const s = (dt.getSeconds() + '').padStart(2, '0')
          return `${y}-${m}-${d} ${h}:${f}:${s}`
         }
        },
		created(){
			this.getOrderList()
		}
	}
</script>

<style scoped>
	.el-card, .el-table{
		margin-top: 10px;
	}
	.search{
		width: 300px;
	}
	.el-cascader{
		width: 100%;
	}
</style>

