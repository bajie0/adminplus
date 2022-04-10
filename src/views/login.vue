<template>
	<div class="padding200 fill-color-main height-24">
		<div class="positionbox inner-padding-70 inner-paddingtb-20 min-width700 paddingtb40 boxshadow-dark-20 fix margin200 fill-color-white">
			<div class="font-30 text-weight">系统登录</div>
			<el-input placeholder="输入账号" v-model="user_name" @keydown.enter="login"></el-input>
			<el-input placeholder="输入密码" v-model="pass_word" type="password" @keydown.enter="login"></el-input>
			<div class="inner-center">
				<el-button @click="login">登录</el-button>
			</div>
			<div class="scale-sm-1 ptop">
				<div class="circle-box-140  Move-to-top-90 border-around-middle-10">
					<img src="../assets/logo.png" class="width-24 fill-color-matchA">
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue"
	import { ElMessageBox } from 'element-plus'
	import { ElMessage } from 'element-plus'
	import router from "../router/index.js"
	import { store } from "../store/index.js"
	// 登录的逻辑
	const user_name = ref('zhaopeng')
	const pass_word = ref('123')
	const login = ()=>{
		if(!user_name.value) return ElMessageBox.alert('还没输入账号呢',{
			type:'error'
		})
		if(!pass_word.value) return ElMessageBox.alert('还没输入密码呢',{
			type:'error'
		})
		// 调登录的接口
		let url = store.$url.login_url
		store.$api.post(url,{
			user_name:user_name.value,
			pass_word:pass_word.value
		}).then(res=>{
			console.log(res)
			if(store.state.$menu_current == '/index'){
				router.replace(store.state.$menu_current)
			}
			else{
				router.replace('/index' + store.state.$menu_current)
			}
			ElMessage({
				type:'success',
				message:'登录成功'
			})
			//将token写入至vuex
			store.vuex('vuex_token',res.token)
			//调获取登录用户的权限的接口
			let url = store.$url.roots_url
			store.$api.get(url).then(res=>{
				console.log(res)
				//将该用户下的所有权限写入至vuex
				store.vuex('$userRoots',res.data)
			})
		})
	}
</script>
<style scoped>
	@media screen and (max-width:1920px) {
		.fix{
			margin: 100px 300px;
		}
	}
</style>