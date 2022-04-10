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
					<div class="paddinglr20">
						<el-button-group>
							<el-button type="primary" size="mini" plain @click="allopen">全部展开</el-button>
							<el-button type="primary" size="mini" plain @click="allclose">全部折起</el-button>
						</el-button-group>
					</div>
					<el-button-group>
						<el-button type="primary" size="mini" plain @click="createrole" icon="el-icon-plus">创建角色
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
			<el-table ref="tableref" :data="tableData" stripe height="100%" class="width-24" @row-click="rowclick" @selection-change="operateSelection">
				<el-table-column type="expand">
					<template v-slot="data">
						<div class="inner-left paddinglr50 tc paddingtb20 text-weight">
							<div class="width150">系统级</div>
							<div class="separateline-light-1 height20"></div>
							<div class="width200">页面级</div>
							<div class="separateline-light-1 height20"></div>
							<div class="flex1">功能级</div>
						</div>
						<div v-if="data.row.root?.length">
							<div :class="data.row.root.length !== index + 1? 'border-bottom-light-1' :''"
								class="marginlr40 inner-left inner-margin-10 paddinglr40"
								v-for="(item,index) in data.row.root" :key="index" @click="rootclick(item)">
								<div class="width150 inner-paddingtb-10">
									<div>
										<el-tag class="hover-sm">{{item.title}}</el-tag>
									</div>
								</div>
								<div class="flex1">
									<div v-for="(items,indexs) in item.children" :key="indexs"
										:class="item.children.length !== indexs + 1? 'border-bottom-lighter-1' : ''"
										class="inner-left" @click="rootclick(items)">
										<div class="width200">
											<el-tag class="hover-sm" type="success">{{items.title}}</el-tag>
										</div>
										<div class="flex1 inner-left gutter20 height60">
											<div v-for="(itemss,indexss) in items.children" :key="indexss"
												@click="rootclick(itemss)">
												<el-tag class="hover-sm" type="warning">{{itemss.title}}</el-tag>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-else>
							<el-empty description="无权限信息"></el-empty>
						</div>
					</template>
				</el-table-column>
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="title" label="角色名"></el-table-column>
				<el-table-column prop="code" label="角色简码"></el-table-column>
				<el-table-column label="审核状态">
					<template v-slot="data">
						<el-switch v-model="data.row.state" @click.stop @change="tablecheck(data.row,$event)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template v-slot="data">
						<el-button-group>
							<el-button type="primary" size="mini" plain @click.stop="edit(data.row)">编辑</el-button>
							<el-button type="primary" size="mini" plain @click.stop="distribution(data.row)">分配权限</el-button>
							<el-button type="primary" size="mini" plain @click.stop="tabledel(data.row)">删除</el-button>
						</el-button-group>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页区 -->
		<div class="height70 fill-color-white inner-left paddinglr20">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="condition.table_page" :page-sizes="[20, 50, 100, 200 ,tableTotal]"
				:page-size="condition.page_size" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal">
			</el-pagination>
		</div>
		<!-- 分配权限的对话框 -->
		<el-dialog title="分配权限" v-model="dialogVisible" width="44%" destroy-on-close>
			<div class="padding-bottom-30 paddinglr10">
				<el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
			</div>
			<el-tree :filter-node-method="filterNode" :data="rootdata" show-checkbox default-expand-all node-key="id" ref="tree" :default-checked-keys="part_tree_data" :props="defaultProps">
			</el-tree>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="confirm" :style="{backgroud:mainColor}">确 定</el-button>
				</span>
			</template>
		</el-dialog>
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
	store.$bus.on('roleRefresh', getTableJson)
	//table的数据总量
	const tableTotal = ref(null)
	//table的数据源
	const tableData = ref([])
	//定义获取table数据的方法
	function getTableJson() {
		let url = store.$url.role_list_url
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
	//定于获取权限数据的方法
	function getrootdata(){
		let url = store.$url.root_url
		return store.$api.get(url).then(res => {
			console.log(res);
			return res
		})
	}
	//页面展示的时候请求所有权限的数据，并写入vuex
	onActivated(() => {
		getrootdata().then(res=>{
			store.vuex('$roots',res.data)
			//给权限树赋值
			rootdata.value = res.data
		})
	})
	//获取table的引用
	const tableref = ref('')
	//定义某一个角色展开后获取当前角色的所有权限数据的方法
	function getRoot(row) {
		let url = store.$url.role_root_url
		return store.$api.get(url, {
			id: row.id
		}).then(res => {
			return res
		})
	}
	//展开某一行
	const rowclick = (row) => {
		console.log(row)
		tableref.value.toggleRowExpansion(row)
		// 获取角色展开后的权限数据
		getRoot(row).then(res => {
			console.log(res)
		})
	}
	//展开某一行的用户以后查看其下的角色(编辑角色)
	const roleclick = (item) => {
		console.log(item)
		store.vuex('$showrole', true)
		// 调回传表单信息的接口

	}
	//全部展开
	const allopen = () => {
		for (let item of tableData.value) {
			tableref.value.toggleRowExpansion(item, true)
		}
	}
	//全部折起
	const allclose = () => {
		for (let item of tableData.value) {
			tableref.value.toggleRowExpansion(item, false)
		}
	}
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
			message: '未选择任何角色',
			type: 'error'
		})
		// 调下载角色列表的接口
		let url = store.$url.download_role_url
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
			message: '未选择任何角色',
			type: 'error'
		})
		// 调审核所选的接口
		const url = store.$url.check_role_url
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
			message: '未选择任何角色',
			type: 'error'
		})
		// 调审核所选的接口
		const url = store.$url.uncheck_role_url
		store.$api.get(url, {
			id: multipleTable
		}).then(res => {
			getTableJson()
		})
	}
	// table内审核
	const tablecheck = (row, e) => {
		console.log(e)
		console.log(row)
		// 调table内审核数据的接口
		const url = store.$url.table_check_role
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
			message: '未选择任何角色',
			type: 'error'
		})
		ElMessageBox.confirm('删除后将无法恢复，确认删除？', {
			type: 'warning'
		}).then(res => {
			// 调删除所选的接口
			const url = store.$url.del_role_url
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
			const url = store.$url.table_del_role
			store.$api.get(url, {
				'id': row.id,
			}).then(res => {
				getTableJson()
			})
		})
	}
	//创建角色
	const createrole = () => {
		store.vuex('$showrole', true)
	}
	//编辑角色(table内操作)
	const edit = (row) => {
		console.log(row)
		//将要操作的条目的id写入vuex中
		store.vuex('$params', row.id)
		//打开编辑角色弹窗
		store.vuex('$showrole', true)
		//请求表单内数据
		const url = store.$url.formrole_url
		store.$api.get(url, {
			id: store.state.$params
		}).then(res => {
			console.log(res)
			//通过事件总线传递一个formdatarole事件到弹窗组件
			store.$bus.emit('formdatarole', res.data[0])
		})
	}
	//分配权限(table内操作)
	//权限数组
	const rootdata = ref([])
	//所选权限数组
	const part_tree_data = ref([])
	//配置
	const defaultProps = {
		children: 'children',
		label: 'label',
	}
	//定义一个全局变量，把当前分配权限的这个角色id存入
	let tree_id = ''
	const dialogVisible = ref(false);
	const distribution = (row) => {
		// 唤起弹窗
		dialogVisible.value = true
		// 存入角色id
		tree_id = row.id
		// 请求所选权限之前先将上一次赋值的所选权限数组清空
		part_tree_data.value = []
		// 请求所选权限的数据
		const url = store.$url.role_root_url
		store.$api.get(url,{
			id:row.id
		}).then(res => {
			console.log(res)
			part_tree_data.value = res.data
		})
	}

	// --------分配权限弹出框内操作--------	
	// 权限过滤
	import { onMounted,watch } from "vue"
	const filterText = ref('')
	//获取权限树组件的引用
	const tree = ref('')
	onMounted(()=>{
		watch(filterText,(val)=>{
			tree.value.filter(val)
		})
	})
	const filterNode = (value, data) => {
		if (!value) return true
		return data.label.indexOf(value) !== -1
	}
	//分配权限对话框点击确定
	const confirm = () => {
		// 所选权限
		const allPower = tree.value.getCheckedKeys()
		// 半选权限
		const halfPower = tree.value.getHalfCheckedKeys()
		// 合并权限数组
		const wholePower = allPower.concat(halfPower)
		// 修改所属角色权限
		const url = store.$url.edit_role_root
		store.$api.post(url,{
			id:tree_id,
			power: wholePower
		}).then(res => {
			console.log(res)
			getTableJson()
			dialogVisible.value = false
			// 通过事件总线发射全局事件 让侧边栏刷新
			store.$bus.emit('refreshSide')
		})
	}
	// 页面卸载时取消全局事件的监听
	import { onUnmounted } from "vue"
	onUnmounted(()=>{
		store.$bus.off('roleRefresh')
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
</style>
