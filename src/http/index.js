import axios from "axios"
import qs from "qs"
import {
	store
} from '../store/index.js'
import {
	ElMessageBox
} from 'element-plus'
import {
	ElMessage
} from 'element-plus'
import router from '../router/index.js'

//1.创建axios实例，封装axios全局配置
const instance = axios.create({
	baseURL: 'http://172.18.44.48:8090/',
	// baseURL: 'http://localhost:8083/interface',
	timeout: 5000
})
// 2.封装axios实例的拦截器
// 2.1请求拦截
instance.interceptors.request.use(
	// 请求成功的拦截
	config => {
		const token = store.state.vuex_token
		if (token) {
			config.headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'token': token
			}
		}
		return config
	},
	// 请求失败的拦截
	error => {
		return Promise.reject(error)
	}
)
// 2.2响应拦截
instance.interceptors.response.use(
	// 响应成功的拦截
	response => {
		// 数据获取成功
		if (response.data.code === 200) {
			return Promise.resolve(response)
		}
		// 数据读取或写入或查询失败
		if (response.data.code === 201) {
			ElMessageBox({
				title:'错误',
				type: 'error',
				message: response.data.message
			})
			return Promise.reject(response)
		}
		// 数据更改成功
		if (response.data.code === 202 || response.data.code === 203 || response.data.code === 204 || response.data.code === 206) {
			ElMessage.success(response.data.message)
			return Promise.resolve(response)
		}
		// 请求方法错误
		if (response.data.code === 400) {
			ElMessageBox({
				title:'错误',
				type: 'error',
				message: response.data.message
			})
			return Promise.reject(response.data)
		}
	},
	// 响应失败的拦截
	error => {
		if (!error.response) {
			ElMessage.error('API无响应，请联系系统管理员')
			return Promise.reject(error)
		} else {
			if (error.response.status) {
				if (error.response.status === 401 || error.response.status === 402) {
					router.push('/login')
					return Promise.reject(error)
				} else {
					ElMessageBox({
						title:'错误',
						type: 'error',
						message: '响应失败'
					})
					return Promise.reject(error)
				}
			}
		}
	}
)
// 3.封装全局网络请求的方法
const post = (url, data) => {
	return instance.post(url, qs.stringify(data, {
		arrayFormat: 'brackets'
	})).then(res => {
		return Promise.resolve(res.data)
	}).catch(err => {
		return Promise.reject(err)
	})
}
const get = (url, data) => {
	return instance.get(url, {
		params: data,
	}).then(res => {
		return Promise.resolve(res.data) 
	}).catch(err => {
		return Promise.reject(err)
	})
}
// 4.导出封装完成的请求方法
export { post,get }