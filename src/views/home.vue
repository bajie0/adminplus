<template>
	<div class="flex-column h100 of-hidden">
		<div class="inner-left gutter20 of-hidden">
			<!-- 用户card -->
			<el-card shadow="hover" class="width-8 animate__animated" :class="$openanimate? 'animate__rotateInDownLeft' : ''">
				<div class="inner-justify border-bottom-light-1 padding-bottom-20">
					<div class="inner-left">
						<div class="custom-icon custom-icon-user font-40"></div>
						<div class="self-bottom">用户</div>
					</div>
					<div class="inner-left">
						<div class="font-35 paddinglr10 text-weight">214</div>
						<el-tag>个</el-tag>
					</div>
				</div>
				<div class="inner-justify">
					<el-button>创建</el-button>
					<div class="inner-paddingtb-10">
						<div class="inner-right move-to-bottom-10">
							<el-tag size="mini" type="success">审核</el-tag>
							<div class="width70 paddinglr10">198</div>
						</div>
						<div class="inner-right">
							<el-tag size="mini" type="warning">待审</el-tag>
							<div class="width70 paddinglr10">2</div>
						</div>
					</div>
				</div>
			</el-card>
			<!-- 角色card -->
			<el-card shadow="hover" class="width-8 animate__animated" :class="$openanimate? 'animate__slideInDown' : ''">
				<div class="inner-justify border-bottom-light-1 padding-bottom-20">
					<div class="inner-left">
						<div class="custom-icon custom-icon-user font-40"></div>
						<div class="self-bottom">角色</div>
					</div>
					<div class="inner-left">
						<div class="font-35 paddinglr10 text-weight">214</div>
						<el-tag>个</el-tag>
					</div>
				</div>
				<div class="inner-justify">
					<el-button>创建</el-button>
					<div class="inner-paddingtb-10">
						<div class="inner-right move-to-bottom-10">
							<el-tag size="mini" type="success">审核</el-tag>
							<div class="width70 paddinglr10">198</div>
						</div>
						<div class="inner-right">
							<el-tag size="mini" type="warning">待审</el-tag>
							<div class="width70 paddinglr10">2</div>
						</div>
					</div>
				</div>
			</el-card>
			<!-- 权限card -->
			<el-card shadow="hover" class="width-8 animate__animated" :class="$openanimate? 'animate__rotateInDownRight' : ''">
				<div class="inner-justify border-bottom-light-1 padding-bottom-20">
					<div class="inner-left">
						<div class="custom-icon custom-icon-user font-40"></div>
						<div class="self-bottom">权限</div>
					</div>
					<div class="inner-left">
						<div class="font-35 paddinglr10 text-weight">214</div>
						<el-tag>个</el-tag>
					</div>
				</div>
				<div class="inner-justify">
					<el-button>创建</el-button>
					<div class="inner-paddingtb-10">
						<div class="inner-right move-to-bottom-10">
							<el-tag size="mini" type="success">审核</el-tag>
							<div class="width70 paddinglr10">198</div>
						</div>
						<div class="inner-right">
							<el-tag size="mini" type="warning">待审</el-tag>
							<div class="width70 paddinglr10">2</div>
						</div>
					</div>
				</div>
			</el-card>
		</div>
		<el-card shadow="hover" class="width-24 margin-top-20 flex1 animate__animated" :class="$openanimate? 'animate__slideInUp' : ''">
			echart
		</el-card>
	</div>
</template>

<script setup>

</script>