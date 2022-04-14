import {
	createRouter,
	createWebHistory
} from 'vue-router'
import {
	store
} from "../store/index.js"

const routes = [
	// 登录页
	{
		path: '/login',
		component: () => import('../views/login'),
		meta: {
		}
	},
	// 系统首页
	{
		path: '/',
		redirect: '/index',
		meta: {
		}
	},
	{
		path: '/index',
		component: () => import('../views/index'),
		children: [
			{
				path:'',
				redirect: '/index/home',
			},
			// 首页
			{
				path: 'home',
				component: () => import('../views/home'),
				meta: {
				}
			},
			{
				path: 'add_doctor',
				component: () => import('../views/add_doctor'),
				meta: {
					title: '新增大夫',
				}
			},
			{
				path: 'manage_doctor',
				component: () => import('../views/manage_doctor'),
				meta: {
					title: '管理大夫',
				}
			},
			{
				path: 'manage_order',
				component: () => import('../views/manage_order'),
				meta: {
					title: '订单管理',
				}
			},
			{
				path: 'data-admin',
				component: () => import('../views/manage_user'),
				meta: {
					title: '用户列表',
				}
			},
			{
				path: 'data-role',
				component: () => import('../views/manage_role'),
				meta: {
					title: '角色列表',
				}
			},
			{
				path: 'data-power',
				component: () => import('../views/manage_root'),
				meta: {
					title: '权限列表',
				}
			},
			{
				path: 'data-dictionary',
				component: () => import('../views/manage_dictionary'),
				meta: {
					title: '字典列表',
				}
			},
			{
				path: 'operate_root',
				component: () => import('../views/operate_root'),
				meta: {
					title: '权限操作',
				}
			},
			// {
			// 	path: 'operate_user',
			// 	component: () => import('../views/operate_user'),
			// 	meta: {
			// 		title: '用户操作',
			// 	}
			// },
			// {
			// 	path: 'operate_role',
			// 	component: () => import('../views/operate_role'),
			// 	meta: {
			// 		title: '角色操作',
			// 	}
			// },
			// {
			// 	path: 'operate_dictionary',
			// 	component: () => import('../views/operate_dictionary'),
			// 	meta: {
			// 		title: '字典操作',
			// 	}
			// }
		]
	},

]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})
// 前置路由守卫，在路由跳转之前会执行
router.beforeEach((to, from) => {
	if (to.path !== '/login') {
		const token = JSON.parse(localStorage.getItem('lifeData'))?.vuex_token
		if (!token) {
			router.replace('/login')
		}
	}
})
// 后置路由守卫，在路由跳转之后会执行
// 手动点击浏览器前进后退键，使左侧菜单和顶部tab也能切换到对应的选中项
router.afterEach((to, from) => {
	for (let item of store.state.$tablist) {
		// console.log(to.path)
		// console.log(item.name)
		if(to.path == '/index' + item.name){
			return store.vuex('$menu_current',item.name)
		}
	}
	if(to.path == '/index/home'){
		return store.vuex('$menu_current','/index')
	}
})
export default router

