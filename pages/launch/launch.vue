<template>
	<view>
		<view class="one list">{{mate}}</view>
		<!--  #ifdef  MP-WEIXIN -->
		<view class="two list" @click="launch">April</view>
		<!--  #endif -->
		<button class="button" open-type="openSetting">分享给好友</button>
	</view>
</template>

<script>
var variable = 'fined means: 被罚的';
export default {
	data() {
		return {
			mate: '开始支付'
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
			uni.showShareMenu({
				title: 'asd'
			})
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
