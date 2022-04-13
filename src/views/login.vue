<template>
	<div class="fill-color-main height-24 positionbox">
		<div class="width500 height370 pcenter padding40 fill-color-white positionbox border-radius-20">
			<div class="font-30 text-weight paddingtb20">系统登录</div>
			<div class="inner-paddingtb-10">
				<div class="inner-left">
					<div class="width50">账号:</div>
					<el-input placeholder="输入账号" v-model="user_name" @keydown.enter="login"></el-input>
				</div>
				<div class="inner-left">
					<div class="width50">密码:</div>
					<el-input placeholder="输入密码" v-model="pass_word" type="password" @keydown.enter="login"></el-input>
				</div>
			</div>
			<div class="padding-top-40">
				<el-button @click="login" class="width-24" type="primary">登录</el-button>
			</div>
			<div class="circle-box-140 border-around-middle-10 ptop Move-to-top-70">
				<img src="../assets/logo.png" class="width-24 fill-color-matchA">
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref
	} from "vue"
	import {
		ElMessageBox
	} from 'element-plus'
	import {
		ElMessage
	} from 'element-plus'
	import router from "../router/index.js"
	import {
		store
	} from "../store/index.js"
	// 登录的逻辑
	const user_name = ref('admin')
	const pass_word = ref('admin')
	const login = () => {
		if (!user_name.value) return ElMessageBox.alert('还没输入账号呢', {
			type: 'error'
		})
		if (!pass_word.value) return ElMessageBox.alert('还没输入密码呢', {
			type: 'error'
		})
		// 调登录的接口
		let url = store.$url.login_url
		store.$api.post(url, {
			user_name: user_name.value,
			pass_word: pass_word.value
		}).then(res => {
			console.log(res)
			if (store.state.$menu_current == '/index') {
				router.replace(store.state.$menu_current)
			} else {
				router.replace('/index' + store.state.$menu_current)
			}
			ElMessage({
				type: 'success',
				message: '登录成功'
			})
			//将token写入至vuex
			store.vuex('vuex_token', res.token)
			//调获取登录用户的权限的接口
			let url = store.$url.roots_url
			store.$api.get(url).then(res => {
				console.log(res)
				//将该用户下的所有权限写入至vuex
				store.vuex('$userRoots', res.data)
			})
		})
	}
</script>
<style scoped>
	.border-radius-20{
		overflow: unset;
	}
</style>
