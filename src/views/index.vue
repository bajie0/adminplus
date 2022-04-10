<template>
	<div class="inner-left stretch height-24 page-color">
		<!-- 侧边导航 -->
		<div class="fill-color-assist text-color-white transition-2 of-hidden cleardark"
			:class="$isCollapse? 'width70' : 'width300'">
			<side-bar :sidedata="menulist"></side-bar>
		</div>
		<div class="flex1 flex-column">
			<!-- 顶部条 -->
			<div class="height70 border-bottom-lighter-3">
				<head-bar></head-bar>
			</div>
			<!-- tabs切换条 -->
			<div>
				<transition name="tabs">
					<tab-bar v-if="$tablist.length !== 0"></tab-bar>
				</transition>
			</div>
			<!-- 路由组件展示区 -->
			<div class="flex1 fix flex-column">
				<router-view v-slot="{ Component }">
					<!-- 加入状态缓存的路由 -->
					<transition :name="$openanimate? 'route' : ''" mode="out-in">
						<keep-alive>
							<component :is="Component" />
						</keep-alive>
					</transition>
				</router-view>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue"
	import { store } from '../store/index.js'
	// 引入侧边栏组件
	import sideBar from '../components/sidebar.vue'
	// 引入头部组件
	import headBar from '../components/headbar.vue'
	// 引入路由tab切换tabbar组件
	import tabBar from '../components/tabbar.vue'
	// 引入首页组件
	import home from '../views/home.vue'
	// 侧边栏数据
	const menulist = ref([])
	// 调取获取左侧菜单栏数据的接口
	function getside () {
		let url = store.$url.sidebar_url
		store.$api.get(url,{'code': 'Central'}).then(res => {
			console.log(res)
			menulist.value = res.data
		})
	}
	getside()
	// 接收事件总线refreshSide事件 重新或许侧边栏数据
	store.$bus.on('refreshSide',getside)
</script>

<style scoped lang="scss">
	.height-24 {
		min-height: 700px;
	}
	
	// tabs进出场动画
	.tabs-enter-from,
	.tabs-leave-to {
		height: 0;
		transition: .4s;
	}

	.tabs-enter-to,
	.tabs-leave-from {
		height: 40px;
		transition: .4s;
	}

	.fix {
		margin: 15px;
	}

	// 路由动画
	.route-enter-from,
	.route-leave-to {
		opacity: 0;
	}
	.route-enter-to,
	.route-leave-from {
		opacity: 1;
	}
	.route-leave-to{
		transform: translateX(25%);
	}
	.route-leave-active{
		transition: .25s;
	}
	.route-enter-active{
		transition: .5s;
	}
</style>
