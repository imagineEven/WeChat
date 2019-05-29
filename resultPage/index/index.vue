<template>
	<view class="container" :style="'background-image: url(' + topCoverBg + ')'">
		<!--  -->
    <!-- 上传头像 -->
    <view @click="chooseImage" class="choose-image" :style="'background-image: url(' + tempFilePaths + ')'">
      <view v-if="!tempFilePaths" class="default-wrapper">
        <image mode="scaleToFill" :src="defaultImage" class="default-image" alt="defaultImage" />
      </view>
    </view>
    <!-- 雷达图 -->
		<view class="canvasView" :style="'background-image: url(' + RadarCanvasImg + ')'">
			<mpvue-echarts class="ec-canvas" @getRadarImg="getRadarImg" @onInit="radarInit" canvasId="radar" ref="radarChart" :style="{display: RadarCanvasImg?'none':'inherit' }"/>
		</view>
		<view class="detail-hr-wrap"><hr class="detail-hr" /></view>
    <!-- 详情 -->
		<view class="detailView">
				<block v-for="(item,index) in detailList" :key="index">
					<view class="detailView-wrap" :style="'background-image: url(' + item.detailIconBg + ')'">
						<div class="detailView-title" :style="'background-image: url(' + item.detailIcon + ')'">
							<div>{{item.name}}</div>
						</div>
						<div class="detailView-card" :style="'background:' + item.detailCardBg">{{item.description}}</div>
					</view>
				</block>
		</view>
		<view class="detail-hr-wrap"><hr class="detail-hr bottom" /></view>
    <!-- 底部 -->
		<view class="footer" :style="'background-image: url(' + bottomCoverBg + ')'">
			<div class="footer-default" v-if="!showQRCode">
				<view class="footer-tips" :style="'background-image: url(' + wormInfoImage + ')'" ></view>
				<view class="footer-address">
					<block v-for="(item,index) in addressList" :key="index">
						<view class="footer-address-item" @click="jumpToMini(item)" id="jumpleave">
							<image mode="aspectFit" :src="item.icon" class="item-icon" alt="item-icon" />
							<view class="item-description">
								<div class="title">{{item.name}}</div>
								<div class="count"><span>{{item.count}}</span>人已测</div>
							</view>
						</view>
					</block>
				</view>
				<!-- 保存和分享 -->
				<view class="scrollPosition"></view>
				<!-- <cover-view class="btn-group" :animation="btnAnimationData" style="display: flex" v-if="!absoluteBtn">
					<cover-image mode="aspectFit" :src="saveBtnImage" @click="saveImage" class="save" alt="saveBtnImage" />
					<cover-image mode="aspectFit" :src="shareBtnImage" class="share" alt="shareBtnImage" />
				</cover-view> -->
				<view class="btn-group" :class="absoluteBtn" :animation="btnAnimationData" v-if="showBtnGroup">
					<image mode="aspectFit" :src="saveBtnImage" @click="saveImage" class="save" alt="saveBtnImage" />
					<button open-type="share" class="shareBtn" id="share"></button>
					<image mode="aspectFit" :src="shareBtnImage" class="share" alt="shareBtnImage"/>
				</view>
			</div>
			<!-- 二维码 -->
			<view class="footer-default QRCode" v-show="showQRCode">
				<qrcode :val="qrval" :size="qrsize" ref="qrcode"></qrcode>
				<span class="qrcode-span">长按识别二维码</span>
				<span class="qrcode-span">测宝贝性格优势</span>
			</view>
		</view>
		<canvas canvas-id="savedImage" style="width: 750upx;height: 1334upx;position:fixed;top:3000px"></canvas>
	</view>
</template>

<script>
	import * as echarts from '@/components/echarts/echarts.min.js';
	import mpvueEcharts from '@/components/mpvue-echarts/src/echarts.vue';
	import qrcode from '@/components/qrcode/qrcode.vue';
	import { resultPageImages, EvenSelectPage } from '../../util/imageData';
	import { Tips, Storage } from '../../util/util';
	import { getResultData, getUserInfo, uploadImg } from '../../util/api';
	export default {
		data() {
			let addressList = [{
				name: '开启想象力之旅',
				// icon: resultPageImages.defaultImage,
				count: 11758,
			}, {
				name: '想象力2019新年汇',
				// icon: resultPageImages.defaultImage,
				count: 11888,
			}]
			let tempFilePaths = Storage.getStorageSync('UserImage');
			let detailList = Storage.getStorageSync('DetailList')
			return {
        ...resultPageImages,    
				tempFilePaths,
				detailList: detailList || [],
				detailCardBg: [
					'linear-gradient(270deg,rgba(255,244,190,0) 0%,rgba(255,239,174,0.31) 31%,rgba(255,229,137,1) 100%)',
					'linear-gradient(270deg, rgba(255,196,197,0) 0%, rgba(255,196,197,1) 100%)',
					'linear-gradient(270deg, rgba(187,247,176,0) 0%, rgba(182,248,172,1) 100%)',
					'linear-gradient(270deg, rgba(253,202,177,0) 0%, rgba(255,198,173,1) 100%)',
					'linear-gradient(270deg, rgba(220,254,163,0) 0%, rgba(219,255,161,1) 100%)'
        ],
				radarOption: {},
				addressList,
				absoluteBtn: '',
				btnAnimationData: {},
        showQRCode: false,
        showBtnGroup: false,
				qrval: '二维码内容',
				qrsize: 150,
				RadarCanvasImg: '',
				currentpage: 'resultPage/index/index',
				// 下面是埋点数据，不要动！
				sharename: '',
				jumpleave: ''
			};
		},
		// 监听页面滚动
		onPageScroll(scrollTop) {
      wx.createSelectorQuery().select('.canvasView').boundingClientRect().exec((res)=>{
        const canvasInfo = res[0];
        if(canvasInfo.top + canvasInfo.height/2 < uni.getSystemInfoSync().windowHeight/2) {
          this.showBtnGroup = true;
        }else {
          this.showBtnGroup = false;
        }
      })
			this.showBtnGroup && wx.createSelectorQuery().select('.scrollPosition').boundingClientRect().exec((res) => {
				if(res[0]){
					if (res[0].top <= 650-80 && !this.absoluteBtn) {
						this.absoluteBtn = 'absoluteBtn'
						// this.btnAnimation()
					}
					if (res[0].top > 650-80 && this.absoluteBtn) {
						this.absoluteBtn = ''
						// this.btnAnimation()
					}
				}
			})
    },
    mounted() {
			this.getUserGender();
			this.sharename = Storage.getStorageSync('nickName');
    },
		methods: {
      getUserGender() {
        getUserInfo().then((res) => {
          const { kidGender } = res
          this.defaultImage = res.kidGender === 1 ? this.boyAvatar : this.girlAvatar;
        })
      },
			// 上传头像
			chooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //original 原图，compressed 压缩图，默认二者都有
					sourceType: ['album', 'camera'], //album 从相册选图，camera 使用相机，默认二者都有
					success: (res) => {
						if(res.tempFiles[0].size > 1024*1024*2){
							Tips.showToast('请上传小于2M的图片');
							return
						}
						// 保存头像到服务器
						wx.getFileSystemManager().readFile({
							filePath: res.tempFilePaths[0],
							encoding: 'base64',
							success: (base64) => {
								uploadImg(1, base64.data).then(url => {
									this.tempFilePaths = url
									Storage.setStorage('UserImage', url);
								})
							}
						})
					}
				})
			},
			// 初始化雷达图
			radarInit(e) {
        let exit = Storage.getStorageSync('RadarCanvasImg')
				if(exit){
					this.RadarCanvasImg = exit
				}else{
					let {width, height} = e ;
					let canvas = this.$refs.radarChart.canvas 
					echarts.setCanvasCreator(() => canvas);
					let radarChart = echarts.init(canvas, null, {
						width: width,
						height: height
					})
					let openId = Storage.getStorageSync('OpenId')
					// 获取后台数据
					getResultData().then(res => {
						this.detailList = res.slice(0,5).map((el,index) => ({
							index: index,
							name: el.subjectName,
							totalScore: el.totalScore,
							description: el.conclusion,
							detailIcon: resultPageImages[`detailIcon${index}`],
							detailIconBg: resultPageImages[`detailIconBg${index}`],
							detailCardBg: this.detailCardBg[index],
						}))
						Storage.setStorage('DetailList', this.detailList);
						let indicator = this.detailList.map((el,index) => ({
							name: el.index + '-' + el.name,
							max: 10,
							nameGap: index===0 ? 10 : (index===1 || index===4) ? 5 : 10
						}))
						let dataValue = this.detailList.map(el => el.totalScore)
						this.radarOption = {
							radar: {
								radius: 80, // 雷达图整体大小比例
								nameGap: 10, // 雷达图与name的统一距离
								name: {
									textStyle: { color: 'rgba(102,102,102,1)' },
									// 底图-各个方向的name样式
									formatter: function (value, indicator) {
										let arr = value.split('-')
										if(arr[0]==='0') return `{a|${arr[1]}}`
										else if(arr[0]==='1') return `{b|${arr[1]}}`;
										else if(arr[0]==='2') return `{c|${arr[1]}}`;
										else if(arr[0]==='3') return `{d|${arr[1]}}`;
										else if(arr[0]==='4') return `{e|${arr[1]}}`;
									},
									rich: {
										a: { backgroundColor: 'rgba(255,244,190,1)', borderRadius: 16, padding: [5, 15] },
										b: { backgroundColor: 'rgba(255,196,197,1)', borderRadius: 16, padding: [5, 5] },
										c: { backgroundColor: 'rgba(220,254,163,1)', borderRadius: 16, padding: [5, 15] },
										d: { backgroundColor: 'rgba(253,202,177,1)', borderRadius: 16, padding: [5, 15] },
										e: { backgroundColor: 'rgba(187,247,176,1)', borderRadius: 16, padding: [5, 5] }
									}
								},
								indicator,
								// 底图-区域划分样式
								splitArea: { areaStyle: { color: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent'], } },
							},
							series: [{
								type: 'radar',
								symbol: 'circle', // 拐点的样式，还可以取值'rect','angle'等
								symbolSize: 8, // 拐点的大小
								data : [{
									value : dataValue,
									name : '预算分配',
									// 数据-在拐点处显示数值
									label: {
										normal: {
											show: true,
											color: '#37aab7',
											formatter:function(params) {
												return params.value;
											}
										}
									},
									// 数据-区域边框和区域的颜色（以及拐点marker样式）
									itemStyle: {
										normal: {
											color: '#37aab7',
											borderColor: 'white', // 拐点的描边颜色。[ default: '#000' ]
											borderWidth: 2, // 拐点的描边宽度，默认不描边。[ default: 0 ]
										}
									},
									// 数据-线条样式
									lineStyle: { normal: { color: '#37aab7' } },
									// 数据-区域样式
									areaStyle: { normal: { opacity: 0.1, color: '#37aab7' } },
								}]
							}]
						};
						canvas.setChart(radarChart)
						radarChart.setOption(this.radarOption)
						this.$refs.radarChart.setChart(radarChart)
					})
				}
			},
			// 获取雷达图图片
			getRadarImg(img) {
				// 保存雷达图到服务器
				wx.getFileSystemManager().readFile({
					filePath: img,
					encoding: 'base64',
					success: (base64) => {
						uploadImg(2, base64.data).then(res => {
              this.RadarCanvasImg = res;
							Storage.setStorage('RadarCanvasImg', res);
						})
					}
				})
			},
			// 跳转到其他小程序
			jumpToMini(item) {
				this.jumpleave = item.name;
			},
			btnAnimation() {
				let animation = uni.createAnimation({
					duration: 100,
					timingFunction: 'ease',
				})
				animation.scale(1, 1).opacity(1).step()
				this.btnAnimationData = animation.export()
			},
			createNewImage() {
        return new Promise((resolve, reject) => {
          uni.createSelectorQuery()
            .select('.container')
            .boundingClientRect()
            .exec(([rect]) => {
              const ctx = uni.createCanvasContext('savedImage');
              const screenWidth = rect.width;
              const bg1Height = uni.upx2px(1334);
              const radarHeight = uni.upx2px(470);
              let bg1Path = this.savedBg;
              let bg2Path = this.savedReportImg;
              let avatarPath = Storage.getStorageSync('UserImage') || this.defaultImage;
              let radarImg = Storage.getStorageSync('RadarCanvasImg') || '';
              this.getImageAll([bg1Path, bg2Path, avatarPath, radarImg]).then((res) => {
                bg1Path = res[0].path;
                bg2Path = res[1].path;
                avatarPath = res[2].path;
                radarImg = res[3].path;
                ctx.drawImage(bg1Path, 0, 0, screenWidth, bg1Height);
                ctx.save();
                ctx.beginPath();
                ctx.arc(uni.upx2px(375), uni.upx2px(167), uni.upx2px(120), Math.PI*2, false);
                ctx.setFillStyle('#FFF');
                ctx.fill();
                ctx.clip();
                ctx.drawImage(avatarPath, uni.upx2px(255), uni.upx2px(47), uni.upx2px(240), uni.upx2px(240));
                ctx.restore();
                ctx.drawImage(bg2Path, uni.upx2px(94), uni.upx2px(172), uni.upx2px(562), uni.upx2px(240));
                ctx.drawImage(radarImg, uni.upx2px(80), uni.upx2px(428), screenWidth-uni.upx2px(160), radarHeight);
								ctx.draw(false, resolve);
              })
            })
          });
			},
			// 保存图片
			async saveImage() {
				const _this = this;
				uni.showLoading({
					title: '图片生成中',
					mask: true
				});
				await this.createNewImage();
				uni.hideLoading();
        uni.canvasToTempFilePath({
          canvasId: 'savedImage',
          success: (res) => {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath, // 生成的页面的图片路径
              success:() => {
                // await this.createNewImage();
                Tips.showToast("保存成功", 1500, 'success');
              },
              fail: (err) => {
                if(err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                  this.handleImageErrorAuth();  
                }
              }
            });
            // this.showQRCode = false;
          }
        },this);
			},
			// 分享
			onShareAppMessage(res) {
				return {
					title: '性格优势报告',
          path: 'pages/index/index',
          imageUrl: this.shareCover
				}
      },
      handleImageErrorAuth() {
        uni.showModal({
          title: '提示',
          content: '需要您授权保存至相册',
          showCancel: false,
          success: () => {
            uni.openSetting({
              success: (settingdata) => {
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  console.log("获取权限成功，再次点击图片保存到相册")
                } else {
                  console.log("获取权限失败")
                }
              }
            })
          }
        })
      },
      getImage: function (url) {
        return new Promise((resolve, reject) => {
          uni.getImageInfo({
            src: url,
            success: function (res) {
              resolve(res)
            },
            fail: function () {
              reject("")
            }
          })
        })
      },
      getImageAll(imageArr) {
        return Promise.all(imageArr.map((item)=>{
          return this.getImage(item)
        }))
      }
    },
		components: {
			mpvueEcharts,
			qrcode
		}
	}
</script>

<style lang="less">
	page, view {
		display: flex;
	}
  // 纵向布局
	.flexColumn {
		flex: 1;
		flex-direction: column;
		flex-wrap: wrap;
	}
	// 背景颜色和大小
	.BG(@color:white, @size: 100% auto) {
		background-color: @color;
    background-size: @size;
		background-repeat: no-repeat;
	}
	@BgColor:#d66432; // 大背景边边颜色
	.container, {
		&:extend(.flexColumn);
		.BG(@color:@BgColor);
  }
  
  // 上传头像
	.choose-image{
		flex-direction: column;
    width: 280upx;
    height: 280upx;
    // padding: 40upx;
    margin: 0 auto;
    // border:1upx solid black;
    border-radius: 50%;
    margin-top: 186upx;
    left: 6upx;
    position: relative;
    .BG();
    background-size: 100% 100%;
    .default-wrapper {
      background: url('https://s3.cn-north-1.amazonaws.com.cn/personality-assessment/Images/f0f8c73de21441bf7fcd02002540fe0c.png') no-repeat center/100% 100%;
      background-color: #fff;
      border-radius: 50%;
      opacity: 0.9;
    }
    .default-image{
      z-index: -1;
      margin:auto;
      opacity: 0.2;
      width: 280upx; 
      height: 280upx;
    }
    .default-span{
      span {
        font-size: 24upx;
        line-height: 32upx;
        margin: auto;
        color:rgba(153,153,153,1);
      }
    }
  }
  // 雷达图
  .canvasView {
    &:extend(.flexColumn);
		margin-top: 540upx;
		height: 540upx;
		background-repeat:no-repeat;
		background-size:100% auto;
  }
	.ec-canvas {
		width: 100%;
		height: 540upx;
	}
	.detail-hr-wrap{
		background: white;
    margin: 0 36upx;
		.detail-hr{
			border-top: 1upx dashed #eee;
			margin: 0 40upx 25upx;
			width: 100%;
			&.bottom{
				margin: 60upx 40upx 50upx;
			}
		}
	}
	// 详情解释
	.detailView {
		flex-direction: column;
		color: rgba(102,102,102,1);
		margin: 0 36upx 0;
		background-color: white;
		.detailView-wrap {
			.BG(@size: 140upx);
			flex-direction: column;
			margin: 24upx 30upx 0;
			padding-bottom: 24upx;
			background-position: right bottom;
			.detailView-title {
				.BG(@size: auto 100%);
				background-position: 10upx;
				margin-bottom: 22upx;
				height: 36upx;
				padding-left: 80upx;
				div{
					background: white;
					width:100%;
					font-weight:bold;
					font-size:34upx;
					line-height:34upx;
				}
			}
			.detailView-card {
				font-size: 26upx;
				line-height: 37upx;
				border-radius: 92upx;
				padding: 32upx 56upx;
				background: linear-gradient(270deg,rgba(255,244,190,0) 0%,rgba(255,239,174,0.31) 31%,rgba(255,229,137,1) 100%);
			}
		}
	}
	
	// 底部信息
	.footer{
		.BG(@color:@BgColor, @size: 100% auto);
		flex-direction: column;
		width: 100vw;
		background-position: bottom;
		padding-bottom:650upx;
		.footer-default{
			flex-direction: column;
			&.QRCode{
				align-items:center;
				margin:0 36upx;
				background-color:white;
				qrcode{
					margin:30upx auto 0;
					border:1upx solid #888;
					padding:5upx;
				}
				.qrcode-span{
					font-size: 28upx;
					color: rgba(136,136,136,1);
					line-height: 40upx;
					position:relative;
					bottom:-40upx;
				}
			}
		}
		.footer-tips{
			height: 310upx;
			margin: 0 36upx;
			.BG(@size: 80% auto);
		}
		.footer-address{
			flex-direction: column;
			margin: 0 36upx;
			background:white;
			.footer-address-item{
				margin: 26upx 0 32upx 20upx;
				align-items:center;
				.item-icon{
					width:120upx;
					height:120upx;
					margin-right:20upx;
					background-color: #ddd;
					border-radius: 15upx;
				}
				.item-description{
					font-size: 34upx;
					color:rgba(34,34,34,1);
					line-height:48upx;
					flex-direction:column;
					.count{
						font-size: 20upx;
						color:rgba(153,153,153,1);
						line-height:28upx;
						margin-top:20upx;
						span{
							color:rgba(255,40,66,1);
							padding-right:8upx;
						}
					}
				}
			}
		}
		// 按钮图片
		.btnImage(@w: 280upx, @h: 140upx) {
			width: @w;
			height: @h;
		}
		
		.btn-group{
			position:fixed;
			left:11%;
			bottom:40upx;
			// 滚轮距离底部到达一定值时
			&.absoluteBtn{
				position: relative;
				left:0;
				bottom:0;
				background-color:white;
				margin: 0 36upx;
				justify-content: center;
				.save, .share, .shareBtn{
					bottom:-40upx;
					position:relative;
				}
				.shareBtn{
					right:40upx;
				}
			}
			.save{
				.btnImage();
				margin-right:30upx;
			}
			.share, .shareBtn{
				.btnImage();
			}
			.shareBtn{
				position:absolute!important;
				right:0;
				background:transparent;
				border-radius:100upx;
				z-index:2;
				padding:0;
			}
		}
	}
</style>