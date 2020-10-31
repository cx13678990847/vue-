<template>
	<div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item>首页</el-breadcrumb-item>
         <el-breadcrumb-item>数据统计</el-breadcrumb-item>
         <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
      	 <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
         <div id="main" style="width: 600px;height:400px;"></div>
      </el-card>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import _ from 'lodash'
	export default {
		data(){
			return {
				options: {
                   title: {
                      text: '用户来源'
                   },
                   tooltip: {
                     trigger: 'axis',
                     axisPointer: {
                        type: 'cross',
                        label: {
                          backgroundColor: '#E9EEF3'
                        }
                     }
                   },
                   grid: {
                     left: '3%',
                     right: '4%',
                     bottom: '3%',
                     containLabel: true
                   },
                   xAxis: [
                     {
                       boundaryGap: false
                     }
                   ],
                   yAxis: [
                    {
                      type: 'value'
                    }
                 ]
             }

			}
		},
		 // 指定图表的配置项和数据
	   async mounted(){
	   	  const {data: res} = await this.axios.get('reports/type/1')
	   	  if(res.meta.status !== 200) return
          // 基于准备好的dom，初始化echarts实例
          var myChart = echarts.init(document.getElementById('main'))
          var option = _.merge(res.data,this.options)
           // 使用刚指定的配置项和数据显示图表。
           myChart.setOption(option);
		}
	}
</script>

<style scoped>
	.el-card{
		margin-top: 10px;
	}
</style>