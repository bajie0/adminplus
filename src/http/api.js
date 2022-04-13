// api集中管理
export default {
	// ------------登录------------
	// 登录的接口
	login_url:'/api/login/admin-password/',
	// 登录用户的所有权限的接口
	roots_url:'/api/get/login-permissions/',
	
	// ------------侧边栏------------
	sidebar_url:'/api/get/side-tree/',
	
	// ------------用户操作------------
	//用户列表的接口
	userlist_url:'/api/get/admin-array/',
	//上传用户列表excle的接口
	upload_user_url:'/api/upload/admin/',
	//下载用户列表的接口
	download_user_url:'/api/download/admin-active/',
	//角色列表的接口
	rolelist_url:'/api/get/role-tree/',
	//当前用户下的所有角色的接口
	user_role_url:'/api/get/role-active/',
	//审核所选用户的接口
	check_url:'/api/state/admin-on/',
	//反审所选用户的接口
	uncheck_url:'/api/state/admin-off/',
	//删除所选用户的接口
	del_url:'/api/delete/admin-active/',
	//修改用户下角色的列表
	edit_user_role_url:'/api/patch/admin-role/?id=',
	//创建用户信息的接口
	create_user_url:'/api/create/admin/',
	//上传头像的接口
	uploadimg_url:'/api/upload/images/',
	//获取用户信息数据的接口
	formuser_url:'/api/get/admin-data/',
	//编辑用户信息的接口
	edituser_url:'/api/patch/admin/?id=',
	//table内审核用户的接口
	table_check_user:'/api/state/admin/',
	//table内删除用户的接口
	table_del_user:'/api/delete/admin/',
	
	// ------------角色操作------------
	//获取角色列表的接口
	role_list_url:'/api/get/role-array/',
	//获取权限数据的接口
	root_url:'/api/get/power-tree/',
	//当前角色下所有权限的接口
	role_root_url:'/api/get/power-active/',
	//下载所选角色的接口
	download_role_url:'/api/download/role-active/',
	//审核所选角色的接口
	check_role_url:'/api/state/role-on/',
	//反审所选角色的接口
	uncheck_role_url:'/api/state/role-off/',
	//table内审核角色的接口
	table_check_role:'/api/state/role/',
	//table内删除角色的接口
	table_del_role:'/api/delete/role/',
	//删除所选角色的接口
	del_role_url:'/api/delete/role-active/',
	//创建角色的接口
	create_role_url:'/api/create/role/',
	//编辑角色信息的接口
	editrole_url:'/api/patch/role/?id=',
	//获取角色信息数据的接口
	formrole_url:'/api/get/role-data/',
	//更新角色权限的接口
	edit_role_root:'/api/patch/role-power/',
	
	// ------------权限操作------------
	//权限列表的接口
	rootlist_url:'/api/get/power-array/',
	//下载所选权限的接口
	download_power_url:'/api/download/power-active/',
	//审核所选权限的接口
	check_power_url:'/api/state/power-on/',
	//反审所选权限的接口
	uncheck_power_url:'/api/state/power-off/',
	//table内审核权限的接口
	table_check_power:'/api/state/power/',
	//table内删除权限的接口
	table_del_power:'/api/delete/power/',
	//删除所选权限的接口
	del_power_url:'/api/delete/power-active/',
	//创建权限的接口
	create_power_url:'/api/create/power/',
	//编辑权限信息的接口
	editpower_url:'/api/patch/power/?id=',
	//获取权限信息数据的接口
	formpower_url:'/api/get/power-data/',
	//更新权限权限的接口
	edit_power_root:'/api/patch/power-power/',
	
	// ------------字典操作------------
	//字典列表的接口
	dictionary_list_url:'/api/get/basics-array/',
	//下载所选字典的接口
	download_dictionary_url:'/api/download/basics-active/',
	//审核所选字典的接口
	check_dictionary_url:'/api/state/basics-on/',
	//反审所选字典的接口
	uncheck_dictionary_url:'/api/state/basics-off/',
	//table内审核字典的接口
	table_check_dictionary:'/api/state/basics/',
	//table内删除字典的接口
	table_del_dictionary:'/api/delete/basics/',
	//删除所选字典的接口
	del_dictionary_url:'/api/delete/basics-active/',
	//创建字典的接口
	create_dictionary_url:'/api/create/basics/',
	//编辑字典信息的接口
	editdictionary_url:'/api/patch/basics/?id=',
	//获取字典信息数据的接口
	formdictionary_url:'/api/get/basics-data/',
	//更新字典权限的接口
	edit_dictionary_root:'/api/patch/basics-power/',
}