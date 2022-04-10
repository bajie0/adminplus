export default [{
		icon: 'custom-icon-calendar-check',
		title: '大夫管理',
		path: '',
		children: [{
				title: '新增大夫',
				path: '/index/add_doctor'
			},
			{
				title: '管理大夫',
				path: '/index/manage_doctor'
			}
		]
	},
	{
		icon: 'custom-icon-calendar-check',
		title: '订单管理',
		path: '/index/manage_order'
	},
	{
		icon: 'custom-icon-calendar-check',
		title: '权限管理',
		path: '',
		children: [{
				title: '用户列表',
				path: '/index/manage_user'
			},
			{
				title: '角色列表',
				path: '/index/manage_role'
			},
			{
				title: '权限列表',
				path: '/index/manage_root'
			}
		]
	},
]
