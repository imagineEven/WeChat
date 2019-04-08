<template>
	<view>
		<view class="one list">{{mate}}</view>
		<!--  #ifdef  MP-WEIXIN -->
		<view class="two list">April</view>
		<!--  #endif -->
	</view>
</template>

<script>
var variable = 'fined means: 被罚的';
export default {
	data() {
		return {
			mate: 'has to win the argument'
		}
	},
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
		console.log('mounted', variable);
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
