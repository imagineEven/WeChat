<template>
	<view class="content">
    <image class="logo" src="/static/logo.png"></image>
		<view>
      <!-- <text class="title">{{title}}</text> -->
			<text>this is a first page of the uniapp</text>
    </view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello"
    };
  },
  onLoad(option) {
    // 页面加载；
    // console.log(option);
    // console.log('scrollTop', scrollTop);
  },
  methods: {}
  // onShareAppMessage(res) {
  // 	console.log('分享的res', res);
  //   if (res.from === "button") {
  //     // 来自页面内分享按钮
  //     console.log(res.target);
  //   }
  //   return {
  //     title: "自定义分享标题",
  //     path: "/pages/index/index?id=123"
  //   };
  // }
};
</script>

<style>
.content {
  text-align: center;
  height: 400upx;
}
.logo {
  height: 200upx;
  width: 200upx;
  margin-top: 200upx;
}
.title {
  font-size: 36upx;
  color: #8f8f94;
}
</style>
