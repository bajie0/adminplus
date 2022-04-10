<template>
	<el-dialog :title="title" v-model="$store.state.$showrole" width="44%" @close="boxclose">
		<div class="inner-padding-bottom-20">
			<div class="inner-left gutter20">
				<div class="inner-left gutter10 width-8">
					<div class="inner-left flex-fixed">
						<span class="text-color-warning">*</span>
						<div>角色名称</div>
					</div>
					<el-input placeholder="请输入校色名称" v-model="formdata.title"></el-input>
				</div>
				<div class="inner-left gutter10 width-8">
					<div class="inner-left flex-fixed">
						<span class="text-color-warning">*</span>
						<div>角色编码</div>
					</div>
					<el-input placeholder="请输入校色编码" v-model="formdata.code"></el-input>
				</div>
			</div>
			<div class="inner-left">
				<div class="inner-left gutter10">
					<div class="inner-left flex-fixed self-top">
						<div>角色说明</div>
					</div>
					<vue-editor :setting="{...$store.$setting,height:500,placeholder:'请输入角色说明'}" v-model="formdata.content"></vue-editor>
				</div>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancle">取 消</el-button>
				<el-button type="primary" :style="{background:mainColor}" @click="create" v-if="!$params">创 建</el-button>
				<el-button type="primary" :style="{background:mainColor}" @click="edit" v-else>编 辑</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
	import {
		store
	} from '../store/index.js'
	import { ElMessageBox } from 'element-plus'
	//收集表单
	import { ref } from 'vue'
	const content = ref('')
	//对话框的标题
	import {
		computed,watch
	} from 'vue'
	const title = computed(() => {
		if (store.state.$params) {
			return '编辑角色'
		} else {
			return '创建角色'
		}
	})
	// 点击取消
	const cancle = () => {
		store.vuex('$showrole', false)
	}
	// 表单数据
	const formdata = ref({
		title: '',
		code:'',
		content: ''
	})
	// 角色名称转拼音简码
	watch(()=>formdata.value.title,()=>{
		formdata.value.code = store.$pinyin.getFullChars(formdata.value.title)
	})
	// 点击创建提交表单
	// 提交表单的方法封装
	function submit(url){
		store.$api.post(url,formdata.value).then(res=>{
			console.log(res)
			//调取manage_role组件的刷新table方法,重新获取table数据
			//发射全局事件
			store.$bus.emit('roleRefresh')
			//清空列表
			for (let index in formdata.value) {
				formdata.value[index] = ''
			}
			//关闭对话框
			store.vuex('$showrole', false)
			//手动清空$params的值 重要 因为这种方式不会触发窗口关闭close事件
			store.vuex('$params', null)
		})
	}
	const create = () => {
		//表单验证
		if(!formdata.value.title) return ElMessageBox({
			title:"信息输入不完整",
			message:"请输入角色名称",
			type:"error"
		})
		if(!formdata.value.code) return ElMessageBox({
			title:"信息输入不完整",
			message:"请输入角色简码",
			type:"error"
		})
		// 调创建表单的接口
		const url = store.$url.create_role_url
		submit(url)
	}
	// 如果是编辑角色,则接收事件总线的formdatarole事件
	if(store.state.$params){
		store.$bus.on('formdatarole',res=>{
			console.log(res)
			//表单赋值
			formdata.value.title = res.title
			setTimeout(()=>{
				formdata.value.code = res.code
			});
			formdata.value.content = res.content
		})
	}
	// 点击编辑提交表单
	const edit = () => {
		// 调修改表单的接口
		const url = store.$url.editrole_url + store.state.$params
		submit(url)
	}
	//窗口关闭后清除$params里的值
	const boxclose = ()=>{
		store.vuex('$params', null)
	}
	// 组件销毁时取消事件总线监听 避免重复监听
	import { onUnmounted } from "vue"
	onUnmounted(()=>{
		store.$bus.off('formdatarole')
	})
</script>

<style>
</style>
