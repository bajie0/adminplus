<template>
	<router-view :class="$isdark? 'darkmode' : ''" />
</template>

<style lang="scss">
	*{
		font-size: 12px;
	}
	// 引入通用类库
	@import 'libs/common-pc.scss';
	// 引入字体图标
	@import 'libs/icon.css';
	// 复写element主题样式
	@import 'libs/custom-theme.scss';
	// 清除富文本编辑器的标识
	.tox:not([dir=rtl]) .tox-statusbar__branding{
		display: none;
	}
	// 提示富文本编辑器菜单的层级
	.tox-tinymce-aux{
		z-index: 3000!important;
	}
	.leftwatermark{
		display: none!important;
	}
</style>
