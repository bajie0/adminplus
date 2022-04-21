// 引入createApp
import {
	createApp
} from 'vue'
// 引入根组件
import App from './App.vue'
// 引入路由
import router from './router'
// 接口地址
import url from './http/api.js'
// 导入mitt事件总线
import mitt from 'mitt';
// 引入第三方组件库element-plus
import ElementPlus from 'element-plus'
// 引入组件汉化包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入组件样式
import 'element-plus/dist/index.css'
// 引入vuex
import {
	store,
	storeMixin
} from '@/store/index.js'
// 在store上挂载一个vuex方法用来统一commit
store.vuex = (name, value) => {
	store.commit('$uStore', {
		name,
		value
	})
}
// 引入汉字转拼音包 用于生成简码
import pinyin from 'js-pinyin'
// 引入网络请求
import * as api from './http/index.js'

// ----非响应式全局数据的挂载----
// 将网络请求挂载在store上
store.$api = api
// 将接口地址挂载在store上
store.$url = url
// 将websocket地址挂载在store上
store.$ws = 'ws://172.18.44.48:8090/ws/chat/30/'
// 将事件总线挂载至store
store.$bus = mitt();
// 将pinyin挂载在store上
store.$pinyin = pinyin

// 引入富文本编辑器并注册全局组件 http://jsdawn.gitee.io/vue3-tinymce/
import Vue3Tinymce from '@jsdawn/vue3-tinymce';
// 创建根组件的实例
const app = createApp(App)
// 权限管理
import permission from '@/permissions/index.js'
app.directive('has', permission)
// 原生XMLHttpRequest 配置图片上传token
let req = XMLHttpRequest;
(function(open, send) {
	XMLHttpRequest.prototype.open = function() {
		open.apply(this, arguments);
	}
	XMLHttpRequest.prototype.send = function() {
		this.setRequestHeader('token', store.state.vuex_token)
		send.apply(this, arguments);
	}
})(req.prototype.open, XMLHttpRequest.prototype.send)

// --------编辑器设置--------
const setting = {
	height: 190,
	toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
	toolbar_drawer: 'sliding',
	quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
	plugins: 'link image media table lists fullscreen quickbars',
	// plugins: 'link image media table lists fullscreen',
	fontsize_formats: '12px 14px 16px 18px',
	default_link_target: '_blank',
	link_title: false,
	nonbreaking_force_tab: true,
	// 以中文简体为例
	language: 'zh_CN',
	language_url: '/tinymce/langs/zh_CN.js',
	custom_images_upload: true,
	// 复用 图片上传 api 地址
	images_upload_url: store.state.$base_url + store.$url.uploadimg_url,
	// 上传成功回调函数，return 图片地址。默认 response.location
	custom_images_upload_callback: response => store.state.$base_url + '/static/upload' + response.data,
	// 上传 api 额外的参数。图片默认 file
	custom_images_upload_param: {
		token: store.state.vuex_token
	}
};
// 将设置挂载在store上
store.$setting = setting
app.component('vueEditor', Vue3Tinymce)
// 引入动画库
import 'animate.css';
// 装载所有插件并将app实例挂载至#app元素
app.mixin(storeMixin).use(ElementPlus, {
	locale: zhCn
}).use(store).use(router).mount('#app')
