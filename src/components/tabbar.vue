<template>
	<div class="inner-justify stretch">
		<el-tabs class="fill-color-white flex1" v-model="store.state.$menu_current" type="card" closable
			@tab-remove="removeTab" @tab-click="tabclick">
			<el-tab-pane v-for="item in $tablist" :key="item.name" :label="item.title" :name="item.name">
			</el-tab-pane>
		</el-tabs>
		<!-- tabbar操作菜单 -->
		<el-dropdown class="fill-color-white positionbox" @command="itemclick" placement="bottom">
			<span class="el-dropdown-link inner-center height40">
				<i class="el-icon-arrow-down el-icon--right width110 tr padding-right-30"></i>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="all">关闭全部</el-dropdown-item>
					<el-dropdown-item command="other">关闭其它</el-dropdown-item>
					<el-dropdown-item command="home">去首页</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script>
	import {store} from '../store/index.js'
	export default {
		// 监视当前选中菜单项的变化从而更新路由组件
		watch: {
			$menu_current(e) {
				if(e == '/index'){
					return this.$router.push(e)
				}
				this.$router.push('/index' + e)
			}
		},
		data() {
			return {
				tabIndex: 2,
				store
			}
		},
		methods: {
			// tabs操作
			itemclick(e) {
				// 关闭全部tabs
				if (e == 'all') {
					store.vuex('$tablist', [])
					store.vuex('$menu_current', '/index')
				}
				// 关闭其它
				else if (e == 'other') {
					let now_tab = this.$tablist.filter(item => '/index' + item.name == this.$route.path)
					store.vuex('$tablist', now_tab)
				}
				// 去首页
				else if (e == 'home') {
					this.$router.replace('/index')
					store.vuex('$menu_current', '/index')
				}
			},
			removeTab(targetName) {
				let tabs = this.$tablist
				let activeName = this.$menu_current
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1]
							if (nextTab) {
								store.vuex('$menu_current', nextTab.name)
							}
						}
					})
				}
				let editableTabs = tabs.filter((tab) => tab.name !== targetName)
				store.vuex('$tablist', editableTabs)
				// 当全部删除标签页时,让路由跳转index
				if (this.$tablist.length === 0) {
					store.vuex('$menu_current', '/index')
				}
			},
			// 切换tabs
			tabclick(e) {
				store.vuex('$menu_current', e.props.name)
			}
		},
	}
</script>

<style scoped lang="scss">
	/* 引入全局主题scss变量 */
	@import '@/libs/theme.scss';

	/deep/ .el-tabs__header {
		/* margin-top: 5px; */
		margin-bottom: 0;
	}

	.fill-color-white /deep/ .el-tabs__nav {
		border-top: none;
	}

	/deep/ .el-tabs__item.is-active {
		border-bottom: none;
		border-top: 1px solid main-color;
		background-color: $page-color;
		color: $main-color;
	}

	.el-dropdown-link:hover {
		cursor: pointer;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #409eff;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}
	.el-tabs--card> /deep/ .el-tabs__header{
		border-bottom: none;
	}
</style>
