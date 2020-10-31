 <template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-table :data="dataTable" stripe size="small" border v-loading="loading">
			  <el-table-column type="index" label="#"></el-table-column>
			  <el-table-column label="权限名称" prop="authName"></el-table-column>
			  <el-table-column label="路径" prop="path"></el-table-column>
			  <el-table-column label="权限等级">
			  	<template slot-scope="scope">
			  		<el-tag v-if="scope.row.level == 0">一级</el-tag>
			  		<el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
			  		<el-tag v-else type="warning">三级</el-tag>
			  	</template>
			  </el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
       data(){
       	return {
          dataTable: [],
          loading: true
       	}
       },
       methods: {
       	//发送请求，获取表格数据
       	async getDataTable(){
          const {data: res} = await this.axios.get('rights/list')
          if(res.meta.status !== 200) return
          this.loading = false
          this.dataTable = res.data
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
</style>
