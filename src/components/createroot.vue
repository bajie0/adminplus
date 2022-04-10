<template>
	<el-dialog :title="title" v-model="$store.state.$showroot" width="44%" @close="boxclose">
		<div class="inner-padding-bottom-40 positionbox">
			<i class="custom-icon custom-icon-export prt positionfix hover-sm" @click="scale"></i>
			<div class="inner-left inner-paddinglr-20">
				<div class="inner-left gutter10 width-11">
					<div class="inner-left flex-fixed">
						<span class="text-color-warning">*</span>
						<div>权限名称</div>
					</div>
					<el-input placeholder="请输入权限名称" v-model="formdata.title"></el-input>
				</div>
				<div class="inner-left gutter10 width-11">
					<div class="inner-left flex-fixed">
						<span class="text-color-warning">*</span>
						<div>权限编码</div>
					</div>
					<el-input placeholder="请输入权限编码" v-model="formdata.code"></el-input>
				</div>
			</div>
			<div class="inner-left inner-paddinglr-20">
				<div class="inner-left gutter10 width-11">
					<div class="inner-left flex-fixed">
						<span class="text-color-warning">*</span>
						<div>权限分类</div>
					</div>
					<el-radio-group v-model="formdata.power_class">
						<el-radio-button :label="1">系统级</el-radio-button>
						<el-radio-button :label="2">页面级</el-radio-button>
						<el-radio-button :label="3">功能级</el-radio-button>
					</el-radio-group>
				</div>
				<div class="inner-left gutter10 width-11">
					<div class="inner-left flex-fixed">
						<span class="text-color-warning">*</span>
						<div>上级权限</div>
					</div>
					<el-select filterable v-model="formdata.parent" placeholder="请选择上级权限" class="flex1 of-hidden">
						<el-option v-for="item in tree_data" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="inner-left inner-paddinglr-20" v-if="formdata.power_class == 2">
				<div class="inner-left gutter10 width-11">
					<div class="inner-left flex-fixed">
						<span class="text-color-warning">*</span>
						<div>页面路径</div>
					</div>
					<el-select filterable v-model="formdata.path" placeholder="请选择页面路径" class="flex1 of-hidden">
						<el-option v-for="(item,index) in pathlist" :key="index" :label="item" :value="item">
						</el-option>
					</el-select>
				</div>
				<div class="inner-left gutter10 width-11">
					<div class="inner-left flex-fixed">
						<span class="text-color-warning">*</span>
						<div>页面图标</div>
					</div>
					<el-select filterable v-model="formdata.icon" placeholder="请选择菜单图标" class="flex1 of-hidden"
						@visible-change="iconclick">
						<el-option v-for="(item,index) in iconlist" :key="index" :value="item.value">
							<div class="inner-left">
								<i :class="item.label" class="font-20 padding-right-10"></i>
								<div class="font-10">{{item.value}}</div>
							</div>
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="inner-left inner-paddinglr-20">
				<div class="inner-left">
					<div class="inner-left gutter10">
						<div class="inner-left flex-fixed self-top">
							<div>权限描述</div>
						</div>
						<vue-editor :setting="{...$store.$setting,height:500,placeholder:'请输入权限说明'}"
							v-model="formdata.content"></vue-editor>
					</div>
				</div>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancle">取 消</el-button>
				<el-button type="primary" :style="{background:mainColor}" @click="create" v-if="!$params">创 建
				</el-button>
				<el-button type="primary" :style="{background:mainColor}" @click="edit" v-else>编 辑</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
	import {
		store
	} from '../store/index.js'
	import {
		ElMessageBox
	} from 'element-plus'
	import {
		ref,
		computed
	} from 'vue'
	// 图标集
	import iconlist_ from '../libs/iconfont.js'
	// 定义图标数组
	const iconlist = ref([])

	// 选择图标
	const iconclick = (e) => {
		if (e) {
			// push图标之前清空数组
			iconlist.value = []
			for (let item of iconlist_) {
				iconlist.value.push({
					label: 'custom-icon custom-icon-' + item.font_class,
					value: item.font_class
				})
			}
		}
	}
	// 定义权限列表变量 用于选择上级权限
	const tree_data = ref([])
	//定义获取权限tree数据的方法
	function getrootTree() {
		const url = store.$url.root_url
		store.$api.get(url).then(res => {
			console.log(res)
			if (res.data.length) {
				// 循环push之前先清空数组以免重复push
				tree_data.value = []
				for (let item of res.data) {
					tree_data.value.push({
						value: item.id,
						label: item.label
					})
					if (item.children?.length) {
						for (let items of item.children) {
							tree_data.value.push({
								value: items.id,
								label: items.label
							})
							if (items.children?.length) {
								for (let itemss of items.children) {
									tree_data.value.push({
										value: itemss.id,
										label: itemss.label
									})
								}
							}
						}
					}
				}
			}
		})
	}
	//选择上级权限 组件加载完毕时请求所有权限数据而非点击选择时再请求 防止数据回传时因为数组为空导致value作为label值展示
	getrootTree()
	//对话框的标题
	const title = computed(() => {
		if (store.state.$params) {
			return '编辑权限'
		} else {
			return '创建权限'
		}
	})
	// 页面路径选择
	// 定义路由里所有页面组成的数组 用于选择页面路径
	const pathlist = ref([])
	import router from '../router/index.js'
	// push之前清空数组
	pathlist.value = []
	for (let item of router.options.routes) {
		pathlist.value.push(item.path)
		if (item.children?.length) {
			for (let items of item.children) {
				pathlist.value.push(items.path)
			}
		}
	}
	//格式化路径
	for (let i in pathlist.value) {
		if(pathlist.value[i].indexOf('/') == -1){
			pathlist.value[i] = '/' + pathlist.value[i]
		}
	}
	// 点击取消
	const cancle = () => {
		store.vuex('$showroot', false)
	}
	// 表单数据
	const formdata = ref({
		// 权限类别
		power_class: null,
		// 上级权限
		parent: '',
		// 权限标题
		title: '',
		// 权限编码
		code: '',
		// 权限描述
		content: '',
		// 权限路径
		path: '',
		// 权限图标
		icon: '',
		// 权限排序
		sort: 0
	})
	// 权限名称转拼音简码
	import {
		watch
	} from "vue"
	watch(() => formdata.value.title, () => {
		formdata.value.code = store.$pinyin.getFullChars(formdata.value.title)
	})
	// 点击创建提交表单
	// 提交表单的方法封装
	function submit(url) {
		store.$api.post(url, formdata.value).then(res => {
			console.log(res)
			//调取manage_root组件的刷新table方法,重新获取table数据
			//发射全局事件
			store.$bus.emit('rootRefresh')
			store.$bus.emit('refreshSide')
			//更新$tablist数组为修改后的tab
			for (let i in store.state.$tablist) {
				if(store.state.$tablist[i].name == pathname){
					store.state.$tablist[i].title = formdata.value.title
					store.vuex('$tablist', store.state.$tablist)
					break
				}
			}
			//清空列表
			for (let index in formdata.value) {
				formdata.value[index] = ''
			}
			//关闭对话框
			store.vuex('$showroot', false)
			//手动清空$params的值 重要 因为这种方式不会触发窗口关闭close事件
			store.vuex('$params', null)
		})
	}
	//封装表单验证的方法
	function checkform() {
		if (!formdata.value.title) return ElMessageBox({
			title: "信息输入不完整",
			message: "请输入权限名称",
			type: "error"
		})
		if (!formdata.value.code) return ElMessageBox({
			title: "信息输入不完整",
			message: "请输入权限简码",
			type: "error"
		})
		if (!formdata.value.power_class) return ElMessageBox({
			title: "信息输入不完整",
			message: "请选择权限分类",
			type: "error"
		})
		if (!formdata.value.parent) return ElMessageBox({
			title: "信息输入不完整",
			message: "请选择上级权限",
			type: "error"
		})
		if (formdata.value.power_class == 2) {
			if (!formdata.value.path) return ElMessageBox({
				title: "信息输入不完整",
				message: "请输入页面路径",
				type: "error"
			})
			if (!formdata.value.icon) return ElMessageBox({
				title: "信息输入不完整",
				message: "请选择页面图标",
				type: "error"
			})
		}
		return Promise.resolve(true)
	}
	//确认创建
	const create = () => {
		//表单验证
		checkform().then(res => {
			if (res === true) {
				// 调创建表单的接口
				const url = store.$url.create_power_url
				submit(url)
			}
		})
	}
	// 如果是编辑权限,则接收事件总线的formdataroot事件
	let pathname = ''
	if (store.state.$params) {
		store.$bus.on('formdataroot', res => {
			console.log(res)
			pathname = res.path
			//表单赋值
			formdata.value.title = res.title
			setTimeout(() => {
				formdata.value.code = res.code
			});
			formdata.value.power_class = res.power_class
			formdata.value.parent = res.parent
			formdata.value.path = res.path
			formdata.value.icon = res.icon
			formdata.value.content = res.content
			formdata.value.sort = res.sort
		})
	}
	// 点击编辑提交表单
	const edit = () => {
		//表单验证
		checkform().then(res => {
			if (res === true) {
				// 调创建表单的接口
				const url = store.$url.editpower_url + store.state.$params
				submit(url)
			}
		})
	}
	//窗口关闭后清除$params里的值
	const boxclose = () => {
		store.vuex('$params', null)
	}
	// 放大显示弹窗，并挂载至tabs
	const scale = () => {
		//先关闭弹窗
		store.vuex('$showroot', false)
		//挂载至tab
		// 如果存在这个tab就停止push 防止频繁写入tab数组
		let arr = []
		for (let item of store.state.$tablist) {
			arr.push(item.name)
		}
		if(arr.indexOf('/operate_root') == -1){
			store.state.$tablist.push({
				title:'权限操作',
				name: '/operate_root'
			})
		}
		store.vuex('$tablist', store.state.$tablist)
		store.vuex('$menu_current', '/operate_root')
		// 将当前的表单状态写入vuex
		store.vuex('$formdata_root', formdata.value)
		if(store.state.$params){
			store.vuex('$rootOperateState', 'edit')
			// 将当前的id写入vuex
			store.vuex('$rootId', store.state.$params)
		}
		else{
			store.vuex('$rootOperateState', 'create')
		}
		//手动清空$params里的值
		store.vuex('$params', null)
	}
	// 组件销毁时取消事件总线监听 避免重复监听
	import {
		onUnmounted
	} from "vue"
	onUnmounted(() => {
		store.$bus.off('formdataroot')
	})
</script>

<script>
	export default {}
</script>


<style scoped>
	.positionfix {
		transform: translateX(-20px) translateY(-73px);
		padding-bottom: 0;
		padding: 5px;
		margin: 5px;
	}
</style>
