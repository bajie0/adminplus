<template>
	<div class="flex1 flex-column">
		<div class="fill-color-white flex1">
			<div class="border-left-middle-5 border-color-main paddingtb10 font-17 paddinglr20">{{$rootOperateState == 'edit'? '编辑权限' : '创建权限'}}</div>
			<div class="padding20 paddingtb40">
				<div class="inner-padding-bottom-40">
					<div class="inner-left inner-paddinglr-20">
						<div class="inner-left gutter10 width-11">
							<div class="inner-left flex-fixed">
								<span class="text-color-warning">*</span>
								<div class="font-15">权限名称</div>
							</div>
							<el-input placeholder="请输入权限名称" v-model="$formdata_root.title"></el-input>
						</div>
						<div class="inner-left gutter10 width-11">
							<div class="inner-left flex-fixed">
								<span class="text-color-warning">*</span>
								<div class="font-15">权限编码</div>
							</div>
							<el-input placeholder="请输入权限编码" v-model="$formdata_root.code"></el-input>
						</div>
					</div>
					<div class="inner-left inner-paddinglr-20">
						<div class="inner-left gutter10 width-11">
							<div class="inner-left flex-fixed">
								<span class="text-color-warning">*</span>
								<div class="font-15">权限分类</div>
							</div>
							<el-radio-group v-model="$formdata_root.power_class">
								<el-radio-button :label="1">系统级</el-radio-button>
								<el-radio-button :label="2">页面级</el-radio-button>
								<el-radio-button :label="3">功能级</el-radio-button>
							</el-radio-group>
						</div>
						<div class="inner-left gutter10 width-11">
							<div class="inner-left flex-fixed">
								<span class="text-color-warning">*</span>
								<div class="font-15">上级权限</div>
							</div>
							<el-select filterable v-model="$formdata_root.parent" placeholder="请选择上级权限" class="flex1 of-hidden">
								<el-option v-for="item in tree_data" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<div class="inner-left inner-paddinglr-20" v-if="$formdata_root.power_class == 2">
						<div class="inner-left gutter10 width-11">
							<div class="inner-left flex-fixed">
								<span class="text-color-warning">*</span>
								<div class="font-15">页面路径</div>
							</div>
							<el-select filterable v-model="$formdata_root.path" placeholder="请选择页面路径" class="flex1 of-hidden">
								<el-option v-for="(item,index) in pathlist" :key="index" :label="item" :value="item">
								</el-option>
							</el-select>
						</div>
						<div class="inner-left gutter10 width-11">
							<div class="inner-left flex-fixed">
								<span class="text-color-warning">*</span>
								<div class="font-15">页面图标</div>
							</div>
							<el-select filterable v-model="$formdata_root.icon" placeholder="请选择菜单图标" class="flex1 of-hidden"
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
						<div class="inner-left flex1">
							<div class="inner-left gutter10 width-20">
								<div class="inner-left flex-fixed self-top">
									<div class="font-15">权限描述</div>
								</div>
								<div class="flex1">
									<el-input v-if="!mode" v-model="$formdata_root.content" :rows="10" type="textarea"
										placeholder='请输入权限说明'></el-input>
									<vue-editor v-if="mode" :setting="{...$store.$setting,height:500,placeholder:'请输入权限说明'}"
										v-model="$formdata_root.content"></vue-editor>
									<div class="inner-right">
										<el-button size="mini" @click="changemode">{{mode? '切换为精简模式' : '切换为编辑器模式'}}</el-button>
									</div>
								</div>
		
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="height100 fill-color-white margin-top-10 inner-center">
			<div class="inner-center">
				<el-button>重置</el-button>
				<el-button type="primary" :style="{background:mainColor}" @click="create" v-if="$rootOperateState !== 'edit'">创 建
				</el-button>
				<el-button type="primary" :style="{background:mainColor}" @click="edit" v-else>编 辑</el-button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onDeactivated,
		onActivated
	} from 'vue'
	import {
		store
	} from '../store/index.js'
	import {
		ElMessageBox
	} from 'element-plus'
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
	// 权限名称转拼音简码
	import {
		watch
	} from "vue"
	watch(() => store.state.$formdata_root.title, () => {
		store.state.$formdata_root.code = store.$pinyin.getFullChars(store.state.$formdata_root.title)
		store.vuex('$formdata_root',store.state.$formdata_root)
	})
	// 点击创建提交表单
	// 提交表单的方法封装
	function submit(url) {
		store.$api.post(url, store.state.$formdata_root).then(res => {
			console.log(res)
			//调取manage_root组件的刷新table方法,重新获取table数据
			//发射全局事件
			store.$bus.emit('rootRefresh')
			//清空列表
			for (let index in store.state.$formdata_root) {
				store.state.$formdata_root[index] = ''
			}
		})
	}
	//封装表单验证的方法
	function checkform() {
		if (!store.state.$formdata_root.title) return ElMessageBox({
			title: "信息输入不完整",
			message: "请输入权限名称",
			type: "error"
		})
		if (!store.state.$formdata_root.code) return ElMessageBox({
			title: "信息输入不完整",
			message: "请输入权限简码",
			type: "error"
		})
		if (!store.state.$formdata_root.power_class) return ElMessageBox({
			title: "信息输入不完整",
			message: "请选择权限分类",
			type: "error"
		})
		if (!store.state.$formdata_root.parent) return ElMessageBox({
			title: "信息输入不完整",
			message: "请选择上级权限",
			type: "error"
		})
		if (store.state.$formdata_root.power_class == 2) {
			if (!store.state.$formdata_root.path) return ElMessageBox({
				title: "信息输入不完整",
				message: "请输入页面路径",
				type: "error"
			})
			if (!store.state.$formdata_root.icon) return ElMessageBox({
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
	// 点击编辑提交表单
	const edit = () => {
		//表单验证
		checkform().then(res => {
			if (res === true) {
				// 调编辑表单的接口
				const url = store.$url.editpower_url + store.state.$rootId
				submit(url)
			}
		})
	}
	//切换模式
	const mode = ref(false)
	const changemode = () => {
		mode.value = !mode.value
	}
	onDeactivated(() => {
		mode.value = false
	})
</script>

<style>
</style>
