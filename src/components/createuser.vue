<template>
	<el-dialog :title="title" v-model="$store.state.$showuser" width="44%" top="5vh" @close="boxclose">
		<div class="inner-left padding-bottom-40">
			<div class="flex-fixed paddinglr20 self-top">上传头像</div>
			<el-upload class="avatar-uploader" :action="$base_url + $store.$url.uploadimg_url" :headers="{'token':vuex_token}"
				:show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
				<el-image v-if="imageUrl" fit="cover" :src="imageUrl" class="avatar" />
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</div>
		<div class="inner-padding-bottom-40">
			<div class="inner-left inner-paddinglr-20">
				<div class="inner-left">
					<span class="text-color-warning">*</span>
					<div class="flex-fixed padding-right-10">真实姓名</div>
					<el-input placeholder="请输入真实姓名" v-model="formdata.title"></el-input>
				</div>
			</div>
			<div class="inner-left inner-paddinglr-20">
				<div class="inner-left">
					<span class="text-color-warning">*</span>
					<div class="flex-fixed padding-right-10">用户名</div>
					<el-input placeholder="请输入用户名" v-model="formdata.user_name"></el-input>
				</div>
				<div class="inner-left">
					<span class="text-color-warning">*</span>
					<div class="flex-fixed padding-right-10">手机号</div>
					<el-input placeholder="请输入手机号" v-model="formdata.phone"></el-input>
				</div>
				<div class="inner-left">
					<span class="text-color-warning">*</span>
					<div class="flex-fixed padding-right-10">邮箱</div>
					<el-input placeholder="请输入邮箱" v-model="formdata.mail"></el-input>
				</div>
			</div>
			<div class="inner-left inner-paddinglr-20" v-if="!$params">
				<div class="inner-left">
					<span class="text-color-warning">*</span>
					<div class="flex-fixed padding-right-10">设置密码</div>
					<el-input placeholder="请输入密码" v-model="formdata.pass_word"></el-input>
				</div>
				<div class="inner-left">
					<span class="text-color-warning">*</span>
					<div class="flex-fixed padding-right-10">再次输入密码</div>
					<el-input placeholder="请再次输入密码" v-model="formdata.pass_word_confirm"></el-input>
				</div>
			</div>
		</div>
		<div class="inner-padding-bottom-40">
			<div class="inner-left inner-paddinglr-20">
				<div class="inner-left">
					<div class="flex-fixed padding-right-10 self-top">用户说明</div>
					<vue-editor :setting="{...$store.$setting,height:250,placeholder:'请输入用户说明'}" v-model="formdata.content"></vue-editor>
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
	import { ElMessageBox } from 'element-plus'
	//收集表单
	import { ref } from 'vue'
	const content = ref('')
	//对话框的标题
	import {
		computed
	} from 'vue'
	const title = computed(() => {
		if (store.state.$params) {
			return '编辑用户'
		} else {
			return '创建用户'
		}
	})
	// 点击取消
	const cancle = () => {
		store.vuex('$showuser', false)
	}
	// 头像上传
	// imageUrl
	const imageUrl = ref('')
	// 上传前的钩子
	const beforeAvatarUpload = (file)=>{
		// const isJPG = file.type === 'image/jpeg'
		const isLt2M = file.size / 1024 / 1024 < 2
		
		// if (!isJPG) {
		//   this.$message.error('上传头像图片只能是 JPG 格式!')
		// }
		if (!isLt2M) {
		  this.$message.error('上传头像图片大小不能超过 2MB!')
		}
		// return isJPG && isLt2M
		return isLt2M
	}
	// 上传成功的回调
	const handleAvatarSuccess = (res,file)=>{
		console.log(res)
		console.log(file)
		formdata.value.avatar = res.data //这是往数据库写的
		imageUrl.value = URL.createObjectURL(file.raw)
		console.log(imageUrl.value)
	}
	// 表单数据
	const formdata = ref({
		avatar:'',
		title: '',
		user_name: '',
		pass_word: '',
		pass_word_confirm: '',
		phone: '',
		mail: '',
		content: ''
	})
	// 点击创建提交表单
	// 提交表单的方法封装
	function submit(url){
		store.$api.post(url,formdata.value).then(res=>{
			console.log(res)
			//调取manage_user组件的刷新table方法,重新获取table数据
			//发射全局事件
			store.$bus.emit('userRefresh')
			//清空列表
			for (let index in formdata.value) {
				formdata.value[index] = ''
			}
			//关闭对话框
			store.vuex('$showuser', false)
			//手动清空$params的值 重要 因为这种方式不会触发窗口关闭close事件
			store.vuex('$params', null)
		})
	}
	const create = () => {
		//表单验证
		if(!formdata.value.title) return ElMessageBox({
			title:"信息输入不完整",
			message:"请输入真实姓名",
			type:"error"
		})
		if(!formdata.value.user_name) return ElMessageBox({
			title:"信息输入不完整",
			message:"请输入用户名",
			type:"error"
		})
		if(!formdata.value.phone) return ElMessageBox({
			title:"信息输入不完整",
			message:"请输入手机号",
			type:"error"
		})
		if(!formdata.value.mail) return ElMessageBox({
			title:"信息输入不完整",
			message:"请输入邮箱",
			type:"error"
		})
		if(!formdata.value.pass_word) return ElMessageBox({
			title:"信息输入不完整",
			message:"请输入密码",
			type:"error"
		})
		if(!formdata.value.pass_word_confirm) return ElMessageBox({
			title:"信息输入不完整",
			message:"请再次输入密码",
			type:"error"
		})
		// 调创建表单的接口
		const url = store.$url.create_user_url
		submit(url)
	}
	// 如果是编辑用户,则接收事件总线的formdatauser事件
	if(store.state.$params){
		store.$bus.on('formdatauser',res=>{
			console.log(res)
			//表单赋值
			formdata.value = res
			if(res.avatar){
				imageUrl.value = store.state.$base_url + '/static/upload' + res.avatar
				console.log(imageUrl.value)
			}
		})
	}
	// 点击编辑提交表单
	const edit = () => {
		// 调修改表单的接口
		const url = store.$url.edituser_url + store.state.$params
		submit(url)
	}
	//窗口关闭后清除$params里的值
	const boxclose = ()=>{
		store.vuex('$params', null)
	}
	// 组件销毁时取消事件总线监听 避免重复监听
	import { onUnmounted } from "vue"
	onUnmounted(()=>{
		store.$bus.off('formdatauser')
	})
</script>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
