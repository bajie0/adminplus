<template>
	<!-- logo区 -->
	<div class="height70 inner-center homehover" @click="gohome">
		<transition leave-active-class="animate__fadeOutLeft" mode="out-in" enter-active-class="animate__fadeInLeft"
			class="time-2 animate__animated">
			<div v-if="!$isCollapse" class="text-weight font-20 text-space-3">admin后台系统</div>
			<i class="custom-icon custom-icon-aixibao font-30" v-else></i>
		</transition>
	</div>
	<!-- 左侧菜单 -->
	<el-menu :default-active="'/index' + $menu_current" router :collapse="$isCollapse">
		<template v-for="(item,index) in sidedata" :key="index">
			<el-sub-menu v-if="item.children?.length" :index="index + '' + item.path">
				<template #title>
					<i class="custom-icon font-25 padding-right-20" :class="'custom-icon-' + item.icon"></i>
					<span class="text-weight font-15">{{item.name}}</span>
				</template>
				<el-menu-item @click="menuchange(items)" :index="'/index' + items.path"
					v-for="(items,indexs) in item.children" :key="indexs">
					<template #title>
						<i class="custom-icon font-15 padding-right-10" :class="'custom-icon-' + items.icon"></i>
						<span>{{items.name}}</span>
					</template>
				</el-menu-item>
			</el-sub-menu>
			<el-menu-item :index="'/index' + item.path" v-else @click="menuchange(item)">
				<i class="custom-icon font-25 padding-right-20" :class="'custom-icon-' + item.icon"></i>
				<template #title>
					<span class="text-weight font-15">{{item.name}}</span>
				</template>
			</el-menu-item>
		</template>
	</el-menu>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	import {
		defineProps
	} from 'vue'
	const props = defineProps({
		// 菜单栏数据
		sidedata: {
			type: Array,
			default () {
				return []
			}
		}
	})
	// 动态添加tabs
	import {
		useRoute
	} from 'vue-router'
	import {
		store
	} from '@/store/index.js'
	const route = useRoute()
	const addTab = (e) => {
		let newTab = {}
		newTab.title = e.name
		newTab.name = e.path
		let tablist = JSON.parse(JSON.stringify(store.state.$tablist))
		// push之前检查是否已经包含该tab
		let path_key = []
		for (let item of tablist) {
			path_key.push(item.name)
		}
		if (path_key.indexOf(newTab.name) == -1) {
			tablist.push(newTab)
			// 将新增的tab写入vuex
			store.vuex('$tablist', tablist)
		}
		// 将当前点击的menu项写入vuex
		store.vuex('$menu_current', newTab.name)
		// this.editableTabsValue = newTabName
	}
	const menuchange = (e) => {
		addTab(e)
	}
	// 返回首页
	import router from '../router/index.js'
	const gohome = () => {
		router.push('/index')
		store.vuex('$menu_current', '/index')
	}
	// sidebar宽度
	const sidebar_width = computed(() => {
		return store.state.$side_width
	})
</script>
<style scoped lang="scss">
	// 引入全局主题scss变量
	@import '@/libs/theme.scss';
	.el-menu {
		background-color: $assist-color;
	}

	/deep/ .el-sub-menu__title {
		color: $extreme-text-color;
	}

	/deep/ .el-sub-menu__title:hover {
		color: $extreme-text-color;
		background-color: $main-color;
	}

	.el-menu-item {
		color: $extreme-text-color;
		background-color: $assist-color;
	}

	.el-menu-item:hover {
		color: $extreme-fill-color;
		background-color: $main-color;
	}

	.el-menu {
		border-right: none;
	}

	.el-menu-item.is-active {
		background-color: $main-color;
		color: $extreme-text-color;
	}

	.homehover:hover {
		background-color: $main-color;
		transition: .4s;
		color: $extreme-text-color;
		border-right: 1px solid $main-color;
		cursor: pointer;
	}

	.homehover {
		width: v-bind(sidebar_width);
	}
</style>
