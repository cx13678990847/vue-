<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item>首页</el-breadcrumb-item>
       <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <el-input clearable placeholder="请输入搜索内容" v-model="list.query" @clear="getShopList()">
         <el-button slot="append" icon="el-icon-search" @click="getShopList()"></el-button>
      </el-input>
      <el-button class="button" type="primary" @click="addShop()">添加商品</el-button>
      <el-table size="small" border stripe :data="shopListData" v-loading="loading">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="400px"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number"></el-table-column>
        <el-table-column label="创建时间" width="140px">
           <template slot-scope="scope">
              {{scope.row.add_time | capitalize}}
           </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
           <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row)"></el-button>
              <el-popconfirm title="确定要删除该项？" @onConfirm="remove(scope.row)">
                <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
           </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="list.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="list.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--编辑商品信息-->
    <el-dialog :visible.sync="visibleBoolean" title="编辑商品信息" width="500px">
      <el-form label-position="left" :model="form">
        <el-form-item label="名称:">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格:">
          <el-input v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量:">
          <el-input v-model="form.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量:">
          <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
             <el-button @click="visibleBoolean = false">取消</el-button>
             <el-button type="primary">确定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
     data(){
       return {
         list: {
            query: '',
            pagenum: 1,
            pagesize: 10
         },
         form: {},
         total: 0,
         shopListData: [],
         loading: true,
         visibleBoolean: false
       }
     },
     methods: {
      //获取商品列表的table数据
       async getShopList(){
         const {data: res} = await this.axios.get('goods', { params: this.list})
         if(res.meta.status !== 200) return
         this.loading = false
         this.shopListData = res.data.goods
         this.total = res.data.total
       },
       //当页码数发生变化时获取相应的数据
       handleCurrentChange(newPagenumValue){
         this.list.pagenum = newPagenumValue
         this.getShopList()
       },
       //当每页显示条数发生变化时获取相应的数据
       handleSizeChange(newPagesizeValue){
         this.list.pagesize = newPagesizeValue
         this.getShopList()
       },
       //删除列表项
      async remove(row){
        const {data: res} = await this.axios.delete('goods/' + row.goods_id)
        if(res.meta.status !== 200) return
        this.getShopList()
       },
       addShop(){
         this.$router.push('goods/add')
       },
       //
       editClick(row){
         this.visibleBoolean = true
         this.form = row
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
       this.getShopList()
     }
  }
</script>

<style scoped>
  .el-input{
    width: 400px;
  }
  .button{
    margin-left: 10px;
  }
  .el-card{
    margin-top: 10px;
  }
  .el-table{
    margin-top: 10px;
  }
</style>