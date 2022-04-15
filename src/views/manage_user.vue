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
						<el-button type="primary" size="mini" plain @click="createuser" icon="el-icon-plus">创建用户
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
			<el-table ref="tableref" :data="tableData" stripe height="100%" class="width-24" @row-click="rowclick"
				v-loading="tableLoading" @selection-change="operateSelection">
				<el-table-column type="expand">
					<template v-slot="data">
						<div class="inner-left paddinglr40" :class="data.row.role.length? 'inner-margin-20' : ''">
							<template v-if="data.row.role?.length">
								<div class="width140 hover-sm height90 hover border-around-dark-1 borderfix positionbox inner-center"
									v-for="(item,index) in data.row.role" :key="index" @click="roleclick(item)">
									<div class="fill-color-main prt text-color-white rolefix">角色{{index + 1}}</div>
									<div>{{item.title}}</div>
									<div class="slfd-in-br custom-icon custom-icon-close text-color-warning text-weight"
										@click.stop="delrole(item,data.row)"></div>
								</div>
							</template>
							<div v-else class="inner-center width-24">
								<el-empty description="无角色信息" image-size="70"></el-empty>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="user_name" label="用户名"></el-table-column>
				<el-table-column prop="title" label="姓名"></el-table-column>
				<el-table-column label="头像">
					<template v-slot="data">
						<div class="circle-box-40 inner-center">
							<el-image class="circle-box-50" fit="cover" :src="$base_url + '/static/upload' + data.row.avatar">
								<template #error>
									<div
										class="custom-icon custom-icon-weibiaoti1 text-color-black-lighter font-35 inner-left square-box-50">
									</div>
								</template>
							</el-image>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="phone" label="手机号"></el-table-column>
				<el-table-column prop="mail" label="邮箱"> </el-table-column>
				<el-table-column prop="count" label="登录次数" width="100"> </el-table-column>
				<el-table-column prop="last_time" label="上次登录时间"> </el-table-column>
				<el-table-column label="审核状态" width="100">
					<template v-slot="data">
						<el-switch v-model="data.row.state" @click.stop @change="tablecheck(data.row,$event)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template v-slot="data">
						<el-button-group>
							<el-button type="primary" size="mini" plain @click.stop="edit(data.row)">编辑</el-button>
							<el-button type="primary" size="mini" plain @click.stop="distribution(data.row)">分配角色
							</el-button>
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
		<!-- 分配角色的对话框 -->
		<el-dialog title="分配角色" v-model="dialogVisible" width="44%">
			<div class="padding-left-20 inner-justify padding-bottom-20">
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
				</el-checkbox>
				<!-- 搜索框 -->
				<div class="width-15 paddinglr20 inner-left">
					<div class="flex-fixed paddinglr10">角色过滤:</div>
					<el-input @input="fillterrole" size="small" placeholder="请输入角色名称" prefix-icon="el-icon-search"
						v-model="searchinput">
					</el-input>
				</div>
			</div>
			<!-- 角色选择区 -->
			<el-checkbox-group v-model="checkedroles" size="medium" @change="handleCheckedChange">
				<div class="inner-left wrap inner-padding-20">
					<template v-if="rolelist.length">
						<div v-for="(item,index) in rolelist" :key="index">
							<el-tooltip effect="dark" :content="item.content" placement="top-end" :offset="-1">
								<el-checkbox border :label="item.id">{{item.label}}</el-checkbox>
							</el-tooltip>
						</div>
					</template>
					<el-empty v-else description="数据为空" class="center"></el-empty>
				</div>
			</el-checkbox-group>
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
	store.$bus.on('userRefresh', getTableJson)
	//table的数据总量
	const tableTotal = ref(null)
	//table的数据源
	const tableData = ref([])
	//定义获取table数据的方法
	function getTableJson() {
		let url = store.$url.userlist_url
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
	//点击某一行打开这一行的展开项
	//获取table的引用
	const tableref = ref('')
	//定义某一个用户展开后获取当前用户的所有角色数据的方法
	function getRole(row) {
		let url = store.$url.user_role_url
		return store.$api.get(url, {
			id: row.id
		}).then(res => {
			console.log(res)
			return res
		})
	}
	//展开某一行
	const rowclick = (row) => {
		tableref.value.toggleRowExpansion(row)
		// 获取用户展开后的角色数据
		// getRole(row).then(res=>{

		// })
	}
	//展开某一行的用户以后查看其下的角色(编辑角色)
	const roleclick = (item) => {
		//将要操作的条目的id写入vuex中
		store.vuex('$params', item.id)
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
	//展开某一行以后删除行内的角色数据
	const delrole = (item,row) => {
		ElMessageBox.confirm('删除后将无法恢复，确认删除？', {
			type: 'warning'
		}).then(res=>{
			const index = row.role.findIndex(items => items.id == item.id)
			row.role.splice(index,1)
			let arr = []
			for (let item of row.role) {
				arr.push(item.id)
			}
			//调修改用户下绑定角色的接口
			const url = store.$url.edit_user_role_url
			store.$api.post(url, {
				id:row.id,
				role: arr
			})
		})
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
			message: '未选择任何用户',
			type: 'error'
		})
		// 调下载用户列表的接口
		let url = store.$url.download_user_url
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
			message: '未选择任何用户',
			type: 'error'
		})
		// 调审核所选的接口
		const url = store.$url.check_url
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
			message: '未选择任何用户',
			type: 'error'
		})
		// 调审核所选的接口
		const url = store.$url.uncheck_url
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
		const url = store.$url.table_check_user
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
			message: '未选择任何用户',
			type: 'error'
		})
		ElMessageBox.confirm('删除后将无法恢复，确认删除？', {
			type: 'warning'
		}).then(res => {
			// 调删除所选的接口
			const url = store.$url.del_url
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
			const url = store.$url.table_del_user
			store.$api.get(url, {
				'id': row.id,
			}).then(res => {
				getTableJson()
			})
		})
	}
	//创建用户
	const createuser = () => {
		store.vuex('$showuser', true)
	}
	//编辑用户(table内操作)
	const edit = (row) => {
		console.log(row)
		//将要操作的条目的id写入vuex中
		store.vuex('$params', row.id)
		//打开编辑角色弹窗
		store.vuex('$showuser', true)
		//请求表单内数据
		const url = store.$url.formuser_url
		store.$api.get(url, {
			id: store.state.$params
		}).then(res => {
			console.log(res)
			//通过事件总线传递一个formdatauser事件到弹窗组件
			store.$bus.emit('formdatauser', res.data[0])
		})
	}
	//定义一个全局变量，把当前分配角色的这个用户id存入
	let tree_id = ''
	// 分配角色(table内操作)
	const dialogVisible = ref(false);
	const distribution = (row) => {
		// 唤起弹窗
		dialogVisible.value = true
		// 存入用户id
		tree_id = row.id
		// 请求所有角色的数据
		getrolelist().then(res => {
			rolelist.value = res.data
			// 请求所选角色的数据
			getRole(row).then(res1 => {
				console.log(res1)
				checkedroles.value = []
				for (let item of res.data) {
					for (let items of res1.data) {
						if (item.id === items) {
							checkedroles.value.push(items)
						}
					}
				}
				handleCheckedChange(checkedroles.value)
			})
		})
	}

	// --------分配角色弹出框内操作--------	
	//选中的角色列表
	const checkedroles = ref([])
	//全部角色列表
	const rolelist = ref([])
	// 定义请求所有角色的方法
	function getrolelist(obj) {
		const url = store.$url.rolelist_url
		return store.$api.get(url, obj).then(res => {
			console.log(res)
			return res
		})
	}
	// 全选、部分选和取消全选角色
	const checkAll = ref(false)
	const isIndeterminate = ref(false)
	const handleCheckAllChange = (val) => {
		console.log(val)
		let arr = []
		for (let item of rolelist.value) {
			arr.push(item.id)
		}
		checkedroles.value = val ? arr : [];
		isIndeterminate.value = false;
	}
	const handleCheckedChange = (val) => {
		console.log(val)
		checkAll.value = val.length === rolelist.value.length;
		isIndeterminate.value = val.length > 0 && val.length < rolelist.value.length;
	}
	//过滤角色
	const searchinput = ref('')
	const fillterrole = () => {
		getrolelist({
			"value": searchinput.value
		}).then(res => {
			console.log(res)
			rolelist.value = res.data
		})
	}
	//分配角色对话框点击确定
	const confirm = () => {
		//调修改用户下绑定角色的接口
		const url = store.$url.edit_user_role_url
		store.$api.post(url, {
			id:tree_id,
			role: checkedroles.value
		}).then(res => {
			getTableJson()
			dialogVisible.value = false
		})
	}
	// 页面卸载时取消全局事件的监听
	import { onUnmounted } from "vue"
	onUnmounted(()=>{
		store.$bus.off('userRefresh')
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

	.borderfix {
		border-style: dashed;
	}
</style>
