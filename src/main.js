import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from './router/router.js'
import './style/globle.css'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
//导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器组件的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//导入nprogress进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(ElementUI);
Vue.use(VueAxios,axios);
Vue.use(VueQuillEditor)


axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
axios.interceptors.request.use(config=>{
	config.headers.Authorization = window.sessionStorage.getItem('token');
	return config;
})
axios.interceptors.response.use(config=> {
	NProgress.done()
	return config
})

const vm=new Vue({
	el: "#app",
	router,
	components: {
		App
	},
	template: '<App></APP>'
})




