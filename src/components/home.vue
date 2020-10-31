<template>
	<el-container>
		<el-header>
			<p>电商后台系统</p>
			<el-button type="info" @click="out()">退出</el-button>
		</el-header>
		<el-container>
			<el-aside :width="isCollapse ? '80px' : '200px'">
				<div class="icon">
					<i class="el-icon-s-unfold" @click="isCollapse=!isCollapse"></i>
				</div>
				<el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" :default-active="active" router>
					<el-submenu :index="item.id + ''" v-for="item in navData" :key="item.id">
						<template slot="title">
                          <i :class="iconObject[item.id]"></i>
						  <span>{{item.authName}}</span>
						</template>
						<el-menu-item v-for="item2 in item.children" :key="item2.id" :index="'/' + item2.path">
						  	<template slot="title">
                               <i class="el-icon-menu"></i>
						  	   <span>{{item2.authName}}</span>
						  	</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		data(){
			return {
				isCollapse: false,
                navData: [],
                active: '',
                //保存图标类名
                iconObject: {
                	125: 'el-icon-s-custom',
                	103: 'el-icon-s-tools',
                	101: 'el-icon-s-shop',
                	102: 'el-icon-s-order',
                	145: 'el-icon-s-marketing'
                }
			}
		},
		methods: {
		//获取左侧列表数据
		 async navList(){
			 const {data:res} = await this.axios.get('menus');
			 if(res.meta.status !== 200) return;
			 this.navData = res.data;
			 //这里时因为商品列表中添加商品按钮可以导航到其他页面上，所以需要保证即使在商品列表中导航到其他页面时，默认高亮的导航列表组件依旧是商品列表上
			 if(this.$route.path == '/goods/add'){
			 	this.active = '/goods'
			 }else{
			 	this.active = this.$route.path
			 }
			},
			//回到登录页面
			out(){
				window.sessionStorage.clear();
				this.$router.push('/login');
			}
		},
		created(){
			this.navList();
		}
	}
</script>

<style scoped>
    .home_style{
    	height: 100%;
    }
	.el-header{
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.el-aside{
		background-color: #333744;
	}
    .el-main{
    	background-color: #EAEDF1;
    }
    .el-header p{
    	font-size: 30px;
    	color: #fff;
    	height: 40px;
    }
    .el-icon-s-unfold{
    	font-size: 20px;
    	color: #EAEDF1;
    	cursor: pointer;

    }
    .el-menu{
    	border: none;
    }
  .icon{
  	background-color: #4A5064;
  	display: flex;
  	justify-content: center;
  	align-items: center;
  }
  .el-container{
  	height: 100%;
  }
</style>

<style>
  .el-menu--popup {
  	min-width: 150px;
  }
</style>




