<template>
	<div class="golble_cont">
	   <div class="centetn_border">
	   	 <div class="border_img">
	   	 	<img src="./assets/logo.png">
	   	 </div>
	     <el-form :model="form" ref="form" :rules="rules">
         <el-form-item prop="username">
           <el-input v-model="form.username" prefix-icon="el-icon-user-solid" clearable ref="input"></el-input>
         </el-form-item>
          <el-form-item prop="password">
           <el-input v-model="form.password" prefix-icon="el-icon-s-goods" clearable show-password></el-input>
         </el-form-item>
          <el-form-item class="formButton">
           <el-button type="primary" @click="login()">登录</el-button>
           <el-button type="info" @click="setle()">重置</el-button>
         </el-form-item>
       </el-form>
	   </div>
	</div>
</template>

<script>
	export default {
    data(){
      return {
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    mounted(){
      //表单项自动获取焦点
      this.$refs.input.focus();
    },
    methods: {
      //验证用户名是否存在服务器中
       login(){
       this.$refs.form.validate(async value=>{
          if(value){
          const {data: res} = await this.axios.post('login', this.form)
          if(res.meta.status == 200){
            window.sessionStorage.setItem('token',res.data.token)
            this.$message.success('登录成功')
            this.$router.push('/home')
          }else{
            this.$message.error('登录失败')
          }
          }
        })
      },
      //表单重置
      setle(){
        this.$refs.form.resetFields();
      }
    }
  }
</script>

<style scoped>
	.golble_cont{
		background-color: #2b4b6b;
		display: flex;
		justify-content: center;
		align-items: center;
    height: 100%;
	}
	.centetn_border{
		background-color: #fff;
		width: 500px;
		height: 300px;
		border-radius: 5px;
		position: relative;
	}
 	.border_img{
		width: 130px;
		height: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		transform: translate(-50%,-50%);
		background: #fff;
    position: absolute;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
	}
	.border_img img{
    width: 125px;
    height: 125px;
		border-radius: 50%;
		background-color: #eee;
	}
    .el-form{
      width: 400px;
      position: absolute;
      left: 50px;
      top: 100px;
    }
</style>

<style>
	.el-message{
		height: 50px;
	}
  .formButton{
    display: flex;
    justify-content: flex-end;
  }
</style>



