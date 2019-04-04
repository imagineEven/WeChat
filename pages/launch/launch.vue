<template>
	<div>
		<div class="one list">launch</div>
		<div class="two list">April</div>
	</div>
</template>

<script>
export default {
	// 监听页面加载；
	onLoad() {
		console.log('onload');
	},
	onShow() {
		console.log('onShow');
	},
	created() {
		console.log('我会执行吗？')
	},
	mounted() {
		console.log('mounted');
	},
	methods: {
		launch() {
			console.log('launch')
		}
	}
}
</script>

<style>
	.list {
		margin: 10upx 0;
		border: #007AFF 1px solid;
		width: 750upx;
	}
</style>
