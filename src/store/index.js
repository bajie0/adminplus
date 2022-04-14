import {
	createStore,mapState
} from 'vuex'
import config from '../config/config.js'

let lifeData = {};
try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = localStorage.getItem('lifeData') ? JSON.parse(localStorage.getItem('lifeData')) : {};
} catch (e) {

}
// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user','$userRoots', 'vuex_token', '$menu_current', '$tablist', '$side_width', '$isCollapse', '$isdark','$openanimate'];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = lifeData;
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// // 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		localStorage.setItem('lifeData', JSON.stringify(tmp));
	}
}

// 主题scss变量转js变量
import theme from '../libs/theme.scss'
const $theme = theme
console.log($theme)


const store = createStore({
	// 下面这些值仅为示例，使用过程中请删除
	state: {
		//登录头像
		$headimg:lifeData.$headimg ? lifeData.$headimg : null,
		//编辑时rootId
		$rootId:'',
		//编辑时roleId
		$roleId:'',
		//编辑时userId
		$userId:'',
		//root表单的状态是创建还是编辑
		$rootOperateState:'',
		//role表单的状态是创建还是编辑
		$roleOperateState:'',
		//user表单的状态是创建还是编辑
		$userOperateState:'',
		//权限表单的表单状态
		$formdata_root:{},
		//角色表单的表单状态
		$formdata_role:{},
		//用户表单的表单状态
		$formdata_user:{},
		//params存储变量，有值则证明是编辑操作，为null则证明是创建操作
		$params:null,
		// 创建用户的弹窗
		$showuser:false,
		// 创建角色的弹窗
		$showrole:false,
		// 创建用户的弹窗
		$showroot:false,
		// 创建字典的弹窗
		$showdictionary:false,
		// 是否开启暗黑模式
		$isdark: lifeData.$isdark ? lifeData.$isdark : false,
		// 是否展开sidebar
		$isCollapse: lifeData.$isCollapse ? lifeData.$isCollapse : false,
		// sidebar的宽度
		$side_width: lifeData.$side_width ? lifeData.$side_width : '300px',
		// tabbar
		$tablist: lifeData.$tablist ? lifeData.$tablist : [],
		//所有的权限数据
		$roots:[],
		// sidebar当前选中的菜单项
		$menu_current: lifeData.$menu_current ? lifeData.$menu_current : '/index',
		// 用户的权限数组
		$userRoots:lifeData.$userRoots ? lifeData.$userRoots : [],
		// token
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '',
		// 开启路由动画效果
		$openanimate: lifeData.$openanimate != null ? lifeData.$openanimate : true,
		// 请求域名
		$base_url: config.baseURL,
		//全局主题 这样做的目的是保证模板上可以直接使用
		...$theme
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	}
})

// 尝试将用户在根目录中的store/index.js的vuex的state变量，全部加载到全局变量中
let $uStoreKey = [];
try {
	$uStoreKey = store.state ? Object.keys(store.state) : [];
} catch (e) {

}
const storeMixin = {
	computed: {
			// 将vuex的state中的所有变量，解构到全局混入的mixin中
			...mapState($uStoreKey)
		}
}
export {
	store,storeMixin
}
