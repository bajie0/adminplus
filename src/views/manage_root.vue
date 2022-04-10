<template>
	<div class="flex-column h100">
		<!-- 查询和功能键 -->
		<div class="fill-color-white">
			<div class="height70 inner-justify border-bottom-light-1 zindex-up-2 fill-color-white">
				<div class="inner-left width500 scale-sm-1 ol zindex-up-2">
					<div class="flex-fixed paddinglr20">标题</div>
					<el-input @input="QuickSearch" placeholder="请输入要查询的内容" v-model="condition.quick_search"
						class="width250 margin-right-10">
						<template #suffix>
							<el-icon class="el-input__icon">
								<Search />
							</el-icon>
						</template>
					</el-input>
					<el-button @click="showmore">{{isshowmore? '收起更多条件' : '查询更多条件'}}</el-button>
				</div>
				<div class="flex1 inner-right paddinglr20 or scale-lg-1 zindex-up-1">
					<el-button-group>
						<el-button type="primary" size="mini" plain @click="createroot" icon="el-icon-plus">创建权限
						</el-button>
						<el-button type="primary" size="mini" plain>
							<el-upload :action="$base_url + $store.$url.flie_user_url" @on-progress="onprogress"
								@on-success="onsuccess" @on-error="onerror" :show-file-list="false"
								:headers="{'token':vuex_token}">
								上传
							</el-upload>
						</el-button>
						<el-button type="primary" size="mini" plain @click="download">下载</el-button>
						<el-button type="primary" size="mini" plain @click="check">审核</el-button>
						<el-button type="primary" size="mini" plain @click="uncheck">反审</el-button>
						<el-button type="primary" size="mini" plain @click="del">删除</el-button>
					</el-button-group>
				</div>
			</div>
			<!-- 更多条件查询 -->
			<transition name="moreinput">
				<div class="inner-left paddingtb20 height70 zindex-up-1" v-if="isshowmore">
					<div class="inner-left gutter20 flex1 scale-sm-1 ol">
						<div class="inner-left width350">
							<div class="flex-fixed paddinglr20">更多标题</div>
							<el-input placeholder="请输入要查询的内容"></el-input>
						</div>
						<div class="inner-left width350">
							<div class="flex-fixed paddinglr20">更多标题</div>
							<el-input placeholder="请输入要查询的内容"></el-input>
						</div>
						<div class="inner-left width350">
							<div class="flex-fixed paddinglr20">更多标题</div>
							<el-input placeholder="请输入要查询的内容"></el-input>
						</div>
						<div class="inner-left width350">
							<div class="flex-fixed paddinglr20">更多标题</div>
							<el-input placeholder="请输入要查询的内容"></el-input>
						</div>
					</div>
					<div class="paddinglr20">
						<el-button size="small">查询</el-button>
					</div>
				</div>
			</transition>
		</div>
		<!-- table区 -->
		<div class="flex1 fill-color-white margintb10 paddinglr10">
			<el-table ref="tableref" :data="tableData" stripe height="100%" class="width-24" @row-click="sortclick"
				@selection-change="operateSelection">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="title" label="权限名称"></el-table-column>
				<el-table-column prop="code" label="权限编码"></el-table-column>
				<!-- <el-table-column prop="level" label="权限等级" :filters="levelfilters" :filter-method="levelfilterHandler">
				</el-table-column> -->
				<el-table-column prop="parent" label="上级权限"> </el-table-column>
				<el-table-column prop="power_class" label="权限分类" :filters="typefilters"
					:filter-method="levelfilterHandler">
					<template v-slot="data">
						<el-tag v-if="data.row.power_class === 1" type="warning">系统级</el-tag>
						<el-tag v-if="data.row.power_class === 2" type="success">页面级</el-tag>
						<el-tag v-if="data.row.power_class === 3">功能级</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="path" label="页面路径"></el-table-column>
				<el-table-column label="菜单图标">
					<template v-slot="data">
						<div class="inner-left gutter10">
							<i :class="'font-20 custom-icon custom-icon-' + data.row.icon" class="text-color-main"></i>
							<span>{{data.row.icon}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="排序">
					<template v-slot="data">
						<div class="inner-left">
							<el-input-number size="mini" v-model="data.row.sort" @change="sortchange" :min="0"
								:max="250">
							</el-input-number>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="审核状态">
					<template v-slot="data">
						<el-switch v-model="data.row.state" @click.stop @change="tablecheck(data.row,$event)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template v-slot="data">
						<el-button-group>
							<el-button type="primary" size="mini" plain @click.stop="edit(data.row)">编辑</el-button>
							<el-button type="primary" size="mini" plain @click.stop="tabledel(data.row)">删除</el-button>
						</el-button-group>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页区 -->
		<div class="height70 fill-color-white inner-left paddinglr20 ">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="condition.table_page" :page-sizes="[20, 50, 100, 200 ,tableTotal]"
				:page-size="condition.page_size" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal">
			</el-pagination>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onActivated
	} from 'vue'
	import {
		store
	} from '../store/index.js'
	import {
		Search
	} from '@element-plus/icons'
	import {
		ElMessageBox,
		ElMessage
	} from 'element-plus';
	// 页面展示时清空$parmas的状态
	// onActivated(()=>{
	// 	store.vuex('$params', null)
	// })
	//table默认显示正在加载的动画图标
	const tableLoading = ref(true)
	//限制table搜索的条件
	const condition = ref({
		// 当前页
		table_page: 1,
		// 每页显示多少条数据
		page_size: 20,
		// 快捷检索框
		quick_search: '',
		// 更多搜索条件...

	})
	//监听全局事件,更新列表
	store.$bus.on('rootRefresh', getTableJson)
	//table的数据总量
	const tableTotal = ref(null)
	//table的数据源
	const tableData = ref([])
	//定义获取table数据的方法
	function getTableJson() {
		let url = store.$url.rootlist_url
		store.$api.get(url, condition.value).then(res => {
			console.log(res)
			tableData.value = res.data
			condition.value.table_page = res.table_page
			condition.value.page_size = res.page_size
			tableTotal.value = res.table_total
			tableLoading.value = false
		})
	}
	//页面展示时，从服务器获取table数据
	onActivated(() => {
		getTableJson()
	})
	//分页功能
	const handleSizeChange = (val) => {
		condition.value.page_size = val
		getTableJson()
	};
	const handleCurrentChange = (val) => {
		condition.value.table_page = val
		getTableJson()
	};
	//搜索框快捷搜索
	const QuickSearch = () => {
		getTableJson()
	}
	// 打开查询更多条件
	const isshowmore = ref(false)
	const showmore = () => {
		isshowmore.value = !isshowmore.value
	}
	//获取表格的数据(模拟)
	// import tableData_ from '../interface/userdata.js'
	// tableData.value = tableData_
	//按等级或分类筛选
	// const levelfilters = [{
	// 		text: '一级权限',
	// 		value: 1
	// 	},
	// 	{
	// 		text: '二级权限',
	// 		value: 2
	// 	},
	// 	{
	// 		text: '三级权限',
	// 		value: 3
	// 	}
	// ]
	const typefilters = [{
			text: '系统级',
			value: 1
		},
		{
			text: '页面级',
			value: 2
		},
		{
			text: '功能级',
			value: 3
		}
	]
	const levelfilterHandler = (value, row, column) => {
		const property = column['property']
		return row[property] === value
	}
	//获取table的引用
	const tableref = ref('')

	//checkbox框选择数据
	let multipleTable = [] //选择的checkbox
	const operateSelection = (e) => {
		// push之前清空数组
		multipleTable = []
		for (let item of e) {
			multipleTable.push(item.id)
		}
		console.log(multipleTable)
	}
	//上传进程中
	const onprogress = () => {
		console.log(1)
	}
	//上传成功回调
	const onsuccess = () => {
		console.log('上传成功')
	}
	//上传失败回调
	const onerror = (err) => {
		console.log('上传失败')
	}
	//下载
	const download = () => {
		if (!multipleTable.length) return ElMessageBox({
			title: '错误',
			message: '未选择任何权限',
			type: 'error'
		})
		// 调下载权限列表的接口
		let url = store.$url.download_power_url
		store.$api.get(url, {
			id: multipleTable
		}).then(res => {
			console.log(res)
			window.open(store.state.$base_url + res.path)
		})
	}
	//审核所选
	const check = () => {
		if (!multipleTable.length) return ElMessageBox({
			title: '错误',
			message: '未选择任何权限',
			type: 'error'
		})
		// 调审核所选的接口
		const url = store.$url.check_power_url
		store.$api.get(url, {
			id: multipleTable
		}).then(res => {
			getTableJson()
		})
	}
	//反审所选
	const uncheck = () => {
		if (!multipleTable.length) return ElMessageBox({
			title: '错误',
			message: '未选择任何权限',
			type: 'error'
		})
		// 调审核所选的接口
		const url = store.$url.uncheck_power_url
		store.$api.get(url, {
			id: multipleTable
		}).then(res => {
			getTableJson()
		})
	}
	// table内审核
	const tree = ref('')
	const tablecheck = (row, e) => {
		console.log(e)
		console.log(row)
		// 调table内审核数据的接口
		const url = store.$url.table_check_power
		store.$api.get(url, {
			'id': row.id,
			'state': e
		}).then(res => {
			getTableJson()
		})
	}
	//删除所选
	const del = () => {
		if (!multipleTable.length) return ElMessageBox({
			title: '错误',
			message: '未选择任何权限',
			type: 'error'
		})
		ElMessageBox.confirm('删除后将无法恢复，确认删除？', {
			type: 'warning'
		}).then(res => {
			// 调删除所选的接口
			const url = store.$url.del_power_url
			store.$api.get(url, {
				id: multipleTable
			}).then(res => {
				getTableJson()
			})
		})
	}
	// table内删除数据
	const tabledel = (row) => {
		ElMessageBox.confirm('删除后将无法恢复，确认删除？', {
			type: 'warning'
		}).then(res => {
			// 调table内删除数据的接口
			const url = store.$url.table_del_power
			store.$api.get(url, {
				'id': row.id,
			}).then(res => {
				getTableJson()
				// 通过事件总线传递一个refreshSide事件到侧边栏 重新或许侧边栏数据
				store.$bus.emit('refreshSide')
			})
		})
	}
	//创建权限
	const createroot = () => {
		store.vuex('$showroot', true)
	}
	//编辑权限(table内操作)
	const edit = (row) => {
		console.log(row)
		//将要操作的条目的id写入vuex中
		store.vuex('$params', row.id)
		//打开编辑权限弹窗
		store.vuex('$showroot', true)
		//请求表单内数据
		const url = store.$url.formpower_url
		store.$api.get(url, {
			id: store.state.$params
		}).then(res => {
			console.log(res)
			//通过事件总线传递一个formdatarole事件到弹窗组件
			store.$bus.emit('formdataroot', res.data[0])
		})
	}
	// 权限排序 实际是页面级权限 也就是侧边栏菜单排顺序
	//先拿到点击的当前行的数据
	let formdata_sort = {}
	const sortclick = (e) => {
		formdata_sort = e
	}
	const sortchange = (value) => {
		// 定义权限列表变量 用于后面循环筛选出权限名称对应的id值
		let tree_data = []
		//定义获取权限tree数据的方法
		function getrootTree() {
			const url = store.$url.root_url
			return store.$api.get(url).then(res => {
				console.log(res)
				if (res.data.length) {
					// 循环push之前先清空数组以免重复push
					tree_data = []
					for (let item of res.data) {
						tree_data.push({
							value: item.id,
							label: item.label
						})
						if (item.children?.length) {
							for (let items of item.children) {
								tree_data.push({
									value: items.id,
									label: items.label
								})
								if (items.children?.length) {
									for (let itemss of items.children) {
										tree_data.push({
											value: itemss.id,
											label: itemss.label
										})
										if (itemss.children?.length) {
											for (let itemsss of itemss.children) {
												tree_data.push({
													value: itemsss.id,
													label: itemsss.label
												})
											}
										}
									}
								}
							}
						}
					}
					return tree_data
				}
				else{
					return Promise.reject(false)
				}
			})
		}
		getrootTree().then(res => {
			console.log(res)
			let pid = ''
			for (let item of res) {
				if(item.label == formdata_sort.parent){
					pid = item.value
					break
				}
			}
			console.log(value)
			console.log(pid)
			// 调修改表单的接口 放在一个延时器里 保证formdata_sort已经被附上值
			setTimeout(() => {
				console.log(formdata_sort)
				const url = store.$url.editpower_url + formdata_sort.id
				console.log(formdata_sort.id)
				formdata_sort.parent = pid
				store.$api.post(url, formdata_sort).then(res => {
					console.log(res)
					// 通过事件总线传递一个refreshSide事件到侧边栏 重新或许侧边栏数据
					store.$bus.emit('refreshSide')
					getTableJson()
				})
			});
		})
	}
	// 页面卸载时取消全局事件的监听
	import { onUnmounted } from "vue"
	onUnmounted(()=>{
		store.$bus.off('rootRefresh')
	})
</script>

<style scoped>
	.moreinput-enter-from,
	.moreinput-leave-to {
		margin-top: -70px;
	}

	.moreinput-enter-to,
	.moreinput-leave-from {
		margin-top: 0;
	}

	.moreinput-enter-active,
	.moreinput-leave-active {
		transition: .5s;
	}

	.rolefix {
		padding: 2px 4px;
		font-size: 12px;
	}

	>>>.el-input-number__decrease,
	>>>.el-input-number__increase {
		top: 2px
	}
</style>
