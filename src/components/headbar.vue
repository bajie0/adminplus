<template>
	<div class="inner-justify border-bottom-light-1 height70 text-color-black-middle fill-color-white">
		<div class="inner-left height70">
			<i class="custom-icon iconfix custom-icon-unie700 font-30 self-top hover-sm fill-color-assist text-color-white" @click="changebar"></i>
		</div>
		<div class="inner-left inner-paddinglr-10">
			<transition enter-active-class="animate__fadeInLeft time-3" leave-active-class="animate__fadeOutLeft" class="animate__animated">
				<div class="paddinglr50 scale-lg-2 or" v-if="$tablist.length">
					<el-button-group>
					  <el-button type="primary" size="mini" plain @click="createuser">创建用户</el-button>
					  <el-button type="primary" size="mini" plain @click="createrole">创建角色</el-button>
					  <el-button type="primary" size="mini" plain @click="createroot">创建权限</el-button>
					  <el-button type="primary" size="mini" plain @click="createdictionary">创建字典</el-button>
					</el-button-group>
				</div>
			</transition>
			<div class="inner-left gutter20 marginlr20">
				<i class="custom-icon-fullscreen custom-icon font-25" @click="isScreenFull"></i>
				<i class="custom-icon custom-icon-sound font-25"></i>
				<div class="inner-left">
					<el-image class="circle-box-30 boxshadow-light-10 margin-right-10fix"
						src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201712%2F15%2F20171215221023_KiYWM.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638365310&t=24358d08ec4346327c4c19dab1213278">
					</el-image>
					<el-dropdown @command="changemode">
						<span class="el-dropdown-link text-color-black-middle font-10">
							小戒<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="darkmode">{{$isdark? '明亮模式' : '暗黑模式'}}</el-dropdown-item>
								<el-dropdown-item command="changeanimate">{{$openanimate? '关闭动画' : '开启动画'}}</el-dropdown-item>
								<el-dropdown-item command="exit">退出</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</div>
		</div>
	</div>
	<!-- 创建用户的弹窗 -->
	<create-user v-if="$showuser"></create-user>
	<!-- 创建角色的弹窗 -->
	<create-role v-if="$showrole"></create-role>
	<!-- 创建权限的弹窗 -->
	<create-root v-if="$showroot"></create-root>
	<!-- 创建字典的弹窗 -->
	<create-dictionary v-if="$showdictionary"></create-dictionary>
</template>

<script setup>
	import {store} from '../store/index.js'
	// sidebar宽度切换
	const changebar = () => {
		if (store.state.$side_width == '300px') {
			store.vuex('$isCollapse', true)
			store.vuex('$side_width', '70px')
		} else {
			store.vuex('$isCollapse', false)
			store.vuex('$side_width', '300px')
		}
	}
	// 切换到暗黑模式
	import {
		ElMessageBox
	} from 'element-plus';
	import {
		ElMessage
	} from 'element-plus';
	import router from "../router/index.js"
	const changemode = (e) => {
		if (e == 'darkmode') {
			if (store.state.$isdark == false) {
				store.vuex('$isdark', true)
			} else {
				store.vuex('$isdark', false)
			}
		} 
		// 开启或关闭路由动画
		else if(e == 'changeanimate'){
			if(store.state.$openanimate){
				store.vuex('$openanimate',false)
				ElMessage({
					type:'success',
					message:'动画已关闭'
				})
			}
			else{
				store.vuex('$openanimate',true)
				ElMessage({
					type:'success',
					message:'动画已开启'
				})
			}
		}
		else if (e == 'exit') {
			ElMessageBox.confirm('是否退出系统?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					router.replace('/login')
					ElMessage({
						type: 'success',
						message: '退出系统成功!',
					});
					store.vuex('vuex_token','')
					//清除上一次登录的缓存
					store.vuex('$tablist',[])
					store.vuex('$menu_current',"/index")
					store.vuex('$userRoots',[])
				})
				.catch(() => {});
		}
	}
	// 全屏
	//引入全屏插件
	import screenfull from "screenfull";
	import {
		ref
	} from 'vue';
	const isScreenFull = () => {
		// 需要注意的是 如果判断!screenfull.enabled 显示的是不支持全屏的话 是因为谷歌的版本问题  判断改为 !screenfull.isEnabled  就可以了
		if (!screenfull.isEnabled) {
			// 如果不支持进入全屏，发出不支持提示
			ElMessage({
				message: "您的浏览器版本过低不支持全屏显示！",
				type: "warning"
			});
			return false;
		}
		screenfull.toggle()
	}
	// 创建用户
	import createUser from '@/components/createuser.vue'
	const createuser = ()=>{
		store.vuex('$showuser',true)
	}
	// 创建角色
	import createRole from '@/components/createrole.vue'
	const createrole = ()=>{
		store.vuex('$showrole',true)
	}
	// 创建权限
	import createRoot from '@/components/createroot.vue'
	const createroot = ()=>{
		store.vuex('$showroot',true)
	}
	// 创建权限
	import createDictionary from '@/components/createdictionary.vue'
	const createdictionary = ()=>{
		store.vuex('$showdictionary',true)
	}
</script>

<style scoped>
	.margin-right-10fix{
		margin-right: 5px;
	}
	.el-dropdown-link {
		cursor: pointer;
		color: #409eff;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}
	.radiusfix{
		border-radius: 3px;
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
		border-style: dashed;
	}
	.iconfix{
		padding: 3px 0;
		padding-right: 5px;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}
</style>
