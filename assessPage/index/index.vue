<template>
	<div class="assessPage">
		<div class="guide" v-if="needGuide">
			<div class="wrapper" :animation="wrapperAnimation"></div>
			<img class="direction" :src="directionImg" :animation="directionAnimation" alt="">
			<img class="hand" :src="handImg" :animation="handAnimation" alt="">
			<img @tap="handleStartAssess" class="btn-ok" :src="btnImg" :animation="btnAnimation" alt="">
		</div>
		<div v-if="dataReady" class="content-wrapper" @touchstart="handleTonchStart" @touchmove="handleTouchMove">
			<div v-for="(item, index) in listData" :key="index" class="item-subject-card" :class="{
				'card-leaved': index < currentCardIndex,
				'card-current': index === currentCardIndex,
				'card-prev1': index === currentCardIndex + 1,
				'card-prev2': index === currentCardIndex + 2, 
				'card-prev3': index === currentCardIndex + 3,
				'card-rest': index > currentCardIndex + 3,
				}"
			 :animation="item.animation">
				<div class="assess-num">
					<span>{{index + 1}}</span>
					<span>/</span>
					<span>{{listData.length}}</span>
				</div>
				<div class="assess-content">
					{{item.subject}}
				</div>
			</div>
			<div class="btn-wrapper" v-if="listData.length !== 0">
				<div
					v-for="(btn, index) in 5"
					:key="index"
					@tap="handleChoose(index)"
					class="btn-option"
					:class="{
						current: currentChoose === index,
						btn0: index === 0,
						btn1: index === 1,
						btn2: index === 2,
						btn3: index === 3,
						btn4: index === 4
					}" >
				</div>
		<img class="arrow" :animation="arrowAnimation" :src="arrowImg" alt="">
				<div
					v-for="(btn, index) in 5"
					:key="index"
					style="{display: 'none';}"
					class="current"
					:class="{
						btn0: index === 0,
						btn1: index === 1,
						btn2: index === 2,
						btn3: index === 3,
						btn4: index === 4
					}">
				</div>
			</div>
		</div>
		<div class="submit-area" :animation="infoAnimation">			
			<div class="info">向上滑动提交</div>
		</div>
	</div>
</template>

<script>
	import { assessPageImgMap } from '../../util/imageData.js';
	import {
		getAllQuestions,
		getCurrentQuestions,
		updateProgress
	} from '../../util/api.js';
	import { Storage, afterHandle } from '../../util/util';
	const POSITION_CONFIG = [{
			width: '582rpx',
			height: '536rpx',
			leftWidth: 291,
			zIndex: 8,
			top: '118rpx',
			opacity: 1
		},
		{
			width: '523rpx',
			height: '488rpx',
			leftWidth: 262,
			zIndex: 6,
			top: '88rpx',
			opacity: 0.8
		},
		{
			width: '466rpx',
			height: '444rpx',
			leftWidth: 233,
			zIndex: 4,
			top: '64rpx',
			opacity: 0.3
		},
		{
			width: '407rpx',
			height: '375rpx',
			leftWidth: 204,
			zIndex: 2,
			top: '40rpx',
			opacity: 0
		},
	]
	export default {
		data() {
			return {
				...assessPageImgMap,
				needGuide: false,
				currentCardIndex: null,
				// currentChoose: null,
				wrapperAnimation: null,
				directionAnimation: null,
				handAnimation: null,
				btnAnimation: null,
				infoAnimation: null,
				arrowAnimation: null,
				listData: [],
				canMove: true,
				dataReady: false, // 预防渲染时错乱
				currentpage: 'assessPage/index/index'
			}
		},
		methods: {
			handleTouchMove(e) {
				if(this.needGuide || !this.canMove) return;
				const nowMoveX = e.touches[0].clientX;
				const nowMoveY = e.touches[0].clientY;
				const offsetX = nowMoveX - this.touchStartX;
				const offsetY = nowMoveY - this.touchStartY;
				const absX = Math.abs(offsetX);
				const absY = Math.abs(offsetY);
				const delta = Math.sqrt(Math.pow(absX, 2) + Math.pow(absY, 2));
				if(delta > 60) {
					if(absX > absY) {
						if(offsetX < 0) {
							if ( this.currentCardIndex === this.listData.length - 1) return;
							this.canMove = false;
							this.handleLeftMove();
						}else{
							if ( this.currentCardIndex === 0 ) return;
							this.canMove = false;
							this.handleRightMove();
						}
					}else {
						if(offsetY < 0) {
              console.log(this.currentCardIndex, this.listData.length)
              if(this.currentCardIndex !== this.listData.length - 1) return;
							this.handleSubmit();
						}
					}
				}
			},
			handleTonchStart(e) {
				this.touchStartX = e.touches[0].clientX;
				this.touchStartY = e.touches[0].clientY;
      },
      handleChoose(index) {
        if(!this.canMove) return;
        afterHandle(this._updateProgress, this._handleChoose)(index);
      },
			_updateProgress(res) {
				updateProgress(res);
			},
			async _handleChoose(index) {
        let currentDataSource = this.listData[this.currentCardIndex];
        currentDataSource.score = currentDataSource.scoreSortList[index];
				if(this.currentCardIndex !== this.listData.length- 1) {
					this.canMove = false;
					this.handleLeftMove();
				}else {
					this.infoAnimation = this.createInfoAnimation();
					await this.delay(200);
					this.arrowAnimation = this.createArrowAnimation();
        }
        return Promise.resolve(this.listData)
			},
			// 点击ok按钮的动画
			async handleStartAssess() {
				let animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease'
				});
				animation.scale(0.8).step();
				animation.scale(1).step();
				this.btnAnimation = animation.export();
				await this.delay(800);
				this.btnAnimation = this.hiddenAnimation();
				this.directionAnimation = this.hiddenAnimation();
				this.handAnimation = this.hiddenAnimation();
				await this.delay(200);
				this.wrapperAnimation = this.hiddenAnimation();
				this.needGuide = false;
			},
			// 左滑
			async handleLeftMove() {
				let {
					listData,
					currentCardIndex,
					leavingAnimation,
					cardMidAnimation,
					warningAnimation,
					delay,
					currentChoose
				} = this;
				if ( currentCardIndex === listData.length - 1) return;
				if ( currentChoose === null ) {
					listData[currentCardIndex].animation = warningAnimation();
					await this.delay(1600);
					const _this = this;
					uni.showModal({
						title: '提示',
						content: '选择选项后才能做下一题哦',
						showCancel: false,
						confirmColor: '#02bb00',
						confirmText: '知道了',
						success() {
							_this.canMove = true;
							listData[currentCardIndex].animation = null;
						}
					});
					return;
				}
				listData[currentCardIndex].animation = leavingAnimation();
				await delay(300);
				listData[currentCardIndex + 1].animation = cardMidAnimation(POSITION_CONFIG[0]);
				if (listData[currentCardIndex + 2]) {
					listData[currentCardIndex + 2].animation = cardMidAnimation(POSITION_CONFIG[1]);
				}
				if (listData[currentCardIndex + 3]) {
					listData[currentCardIndex + 3].animation = cardMidAnimation(POSITION_CONFIG[2]);
				}
				this.currentCardIndex++;
			},
			// 右滑
			async handleRightMove() {
				let {
					listData,
					cardMidAnimation,
					backAnimation,
					delay,
					currentCardIndex
				} = this;
				if ( currentCardIndex === 0) return;
				listData[currentCardIndex].animation = cardMidAnimation(POSITION_CONFIG[1]);
				if (listData[currentCardIndex + 1]) {
					listData[currentCardIndex + 1].animation = cardMidAnimation(POSITION_CONFIG[2]);
				}
				if (listData[currentCardIndex + 2]) {
					listData[currentCardIndex + 2].animation = cardMidAnimation(POSITION_CONFIG[3]);
				}
				listData[currentCardIndex - 1].animation = backAnimation();
				this.currentCardIndex--;
			},
			// 测评数据获取
			handleFullDone(status) {
				let pro;
				if(+status === 0) {
					pro = getAllQuestions();
				}else {
					pro = getCurrentQuestions();
				}
				pro.then(async (res) => {
					if(res) {
						this.listData = res.subjectList;
						this.currentCardIndex = this.listData.findIndex(x => x.score === 0);
						this.listData[this.currentCardIndex].animation = null;
						await this.delay(1000);
						this.dataReady = true;
						if(+status === 0) {
							this.needGuide = true;
							this.guideAnimation();
						}
					}
				}, err => {
					this.needGuide = false;
					const _this = this;
					uni.showModal({
						title: '提示',
						content: '数据请求错误, 请刷新重试',
						showCancel: false,
						confirmColor: '#02bb00',
						confirmText: '刷新',
						success() {
							// _this.handleFullDone();
							_this.handleFullDone.apply(_this, [].concat(status));
						}
					})
				});
			},
			handleSubmit() {
				uni.redirectTo({
					url: '../../resultPage/index/index'
				})
			},
			// 生成中间卡片位移动画
			cardMidAnimation({
				width,
				height,
				leftWidth,
				zIndex,
				top,
				opacity
			}) {
				let animation = uni.createAnimation({
					duration: 800,
					timingFunction: 'ease',
				})
				animation.width(width).height(height).top(top).left(`${(this.screenWidth - leftWidth)/2}prx`).opacity(opacity).step();
				return animation.export();
			},
			// 当前卡片离开动画
			leavingAnimation() {
				let animation = uni.createAnimation({
					duration: 800,
					timingFunction: 'ease-out',
					transformOrigin: "20vw 80vh"
				});
				animation.rotate(-90).top('118rpx').step();
				return animation.export();
			},
			// 上一张卡片返回动画
			backAnimation() {
				let animation = uni.createAnimation({
					duration: 600,
					timingFunction: 'ease-out',
					transformOrigin: "20vw 80vh"
				});
				animation.rotate(0).top('118rpx').step();
				return animation.export();
			},
			// 弹性动画
			elasticAnimation() {
				let animation = uni.createAnimation({
					duration: 250,
					timingFunction: 'ease-out'
				});
				animation.scale(1.2).opacity(1).step();
				animation.scale(1).step();
				return animation.export();
			},
			// 未选择选项警告动画
			warningAnimation() {
				let animation = uni.createAnimation({
					duration: 600,
					timingFunction: 'ease-out',
					transformOrigin: '20vw 80vh',
				})
				animation.rotate(-20).step();
				animation.rotate(0).step({
					duration: 400,
					timingFunction: 'ease-in-out'
				});
				let count = 0;
				const shakeConfig = {
					duration: 40,
					timingFunction: 'ease',
					transformOrigin: '50% 50%',
				}
				while (count <= 6) {
					if (count % 2 === 0) {
						animation.rotate(3).step(shakeConfig);
					} else {
						animation.rotate(-3).step(shakeConfig);
					}
					count++;
				}
				animation.rotate(0).step(shakeConfig);
				return animation.export();
			},
			// 指导动画消失动画
			hiddenAnimation() {
				let hiddenAnimation = uni.createAnimation({
					duration: 150,
					timingFunction: 'linear'
				});
				return hiddenAnimation.opacity(0).step();
			},
			async guideAnimation() {
				await this.delay(400);
				this.directionAnimation = this.elasticAnimation();
				await this.delay(200);
				this.handAnimation = this.elasticAnimation();
				await this.delay(800);
				let transfromAnimation = uni.createAnimation({
					duration: 800,
					timingFunction: 'ease-out'
				});
				transfromAnimation.rotate(100).step();
				transfromAnimation.rotate(0).step();
				this.handAnimation = transfromAnimation;
				await this.delay(1000);
				this.btnAnimation = this.elasticAnimation();
			},
			createInfoAnimation() {
				let animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease'
				});
				animation.translateY(0).step();
				return animation;
			},
			createArrowAnimation() {
				let animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease'
				});
				animation.translateY(0).opacity(1).step();
				return animation;
			},
			delay(time) {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve();
					}, time);
				})
			}
		},
		onReady() {
			this.screenWidth = uni.getSystemInfoSync().screenWidth;
		},
		onLoad({status}) {
			this.handleFullDone(status);
    },
    computed: {
      currentChoose() {
        const { listData, currentCardIndex } = this;
        return listData.length > 0 && listData[currentCardIndex].score !== 0
          ? listData[currentCardIndex].scoreSortList.indexOf(listData[currentCardIndex].score)
          : null
      }
    },
		watch:{
			async currentCardIndex(newVal) {
				await this.delay(500);
				this.canMove = true;
      },
		}
	}
</script>
<style lang="less">
	@import "~static/style/mixin.less";
	@remoteUrl: 'https://s3.cn-north-1.amazonaws.com.cn/personality-assessment/Images/';
	.assessPage {
		position: fixed;
		.wh(100vw, 100vh);
		background: url('@{remoteUrl}2de2786228bd1690cf3cf788e59a528b.png') no-repeat center/100% 100%;
	}
	.guide {
		// .lr();
		position: absolute;
		left: 0;
		.wh(100%, 100%);
		display: flex;
		justify-content: center;
		z-index: 20;
		.wrapper {
			left: 0;
			position: absolute;
			.wh(100%, 100%);
			z-index: -1;
			background-color: rgba(0, 0, 0, 1);
			opacity: 0.7;
		}
		.direction, .hand, .btn-ok {
			// display: inline-block;
			position: absolute;
			
			// .lr();
			transform: scale(0);
			opacity: 0;
		}
		.direction {
			top: 350rpx;
			left: calc(50vw - 343rpx/2);
			.wh(343rpx, 66rpx);
		} 
		.hand {
			top: 418rpx;
			.wh(118rpx, 98rpx);
			left: calc(50vw - 118rpx/2);

		}
		.btn-ok {
			bottom: 318rpx;
			.wh(405rpx, 290rpx);
			left: calc(50vw - 405rpx/2);
		}
	}
	.content-wrapper {
		.lr();
		.wh(100%, 100%);
		display: flex;
		justify-content: center;
		.item-subject-card {
			position: absolute;
			box-sizing: border-box;
			.wh(582rpx, 536rpx);
			left: calc(50vw - 582rpx/2);
			padding: 148rpx 71rpx 0;
			background: url('https://s3.cn-north-1.amazonaws.com.cn/personality-assessment/Images/0c7599180ee7cf8c02ce20510af53e9e.png') no-repeat center/100% 100%;
			.assess-num {
				position: absolute;
				top: 57rpx;
				left: 71rpx;
				.sc(26rpx, rgba(5, 193, 96, 1));
				span:first-child {
					margin-right: 8rpx;
				}
				span:last-child {
					margin-left: 8rpx;
					color: rgba(205, 205, 205, 1);
				}
			}
			.assess-content {
				line-height: 50rpx;
				.sc(34rpx, rgba(51, 51, 51, 1), 'left');
				font-weight: 400;
			}
		}
		
		.card-leaved {
			z-index: 10;
			.wh(582rpx, 536rpx);
			// left: calc(50vw - 530rpx/2);
			transform-origin: 20vw 80vh;
			transform: rotate(-90deg);
		}
		
		.card-current {
			z-index: 8;
			top: 118rpx;
			.wh(582rpx, 536rpx);
		}
		
		.card-prev1 {
			top: 88rpx;
			.wh(530rpx, 490rpx);
			left: calc(50vw - 530rpx/2);
			z-index: 6;
			opacity: 0.8;
		}
		
		.card-prev2 {
			top: 64rpx;
			.wh(482rpx, 446rpx);
			left: calc(50vw - 482rpx/2);
			z-index: 4;
			opacity: 0.3;
		}
		
		.card-prev3 {
			top: 40rpx;
			.wh(407rpx, 375rpx);
			left: calc(50vw - 407rpx/2);
			z-index: 2;
			opacity: 0;
		}
		.card-rest {
			display: none;
			background: unset;
		}
	}
	.btn-wrapper {
		display: flex;
		align-content: flex-start;
		flex-wrap: wrap;
		margin-top: 698rpx;
		.wh(100%, 508rpx);
		padding-left: 90rpx;
		.btn-option {
			background-color: blue;
			.wh(305rpx, 118rpx);
			margin-bottom: 26rpx;
			&:nth-of-type(odd) {
				margin-right: 14rpx;
			}
		}
		.btn0 {
			background: url("@{remoteUrl}3f4d5dcb86795655698ec4a723eb212f.png") no-repeat center/100% 100%;
			&.current {
				background-image: url("@{remoteUrl}e82dae68aebcd8837986b2f19cf48275.png")
			}
		}
		.btn1 {
			background: url("@{remoteUrl}8a689e690d57f1f0217d100500920fe0.png") no-repeat center/100% 100%;
			&.current {
				background-image: url("@{remoteUrl}89a5c9fb007d14028f2b69a6f353dd9f.png")
			}
		}
		.btn2 {
			background: url("@{remoteUrl}97bf2a27bd8089a57c6dc62be3331d78.png") no-repeat center/100% 100%;
			&.current {
				background-image: url("@{remoteUrl}ba0a67032ae461126952bacf972bc4e1.png")
			}
		}
		.btn3 {
			background: url("@{remoteUrl}449e8bcb2278e2c1e22cbac89850f8a2.png") no-repeat center/100% 100%;
			&.current {
				background-image: url("@{remoteUrl}16c256a9fc889661865e686b6886f777.png")
			}
		}
		.btn4 {
			background: url("@{remoteUrl}668a9fb4c54d040bad0fe08050480301.png") no-repeat center/100% 100%;
			&.current {
				background-image: url("@{remoteUrl}0859434c3ca6cc8ff266657d56f60ba8.png")
			}
		}
	}
	.arrow {
		position: absolute;
		left: calc(50vw - 29rpx/2);
		bottom: 58rpx;
		transform: translateY(20rpx);
		.wh(29rpx, 22rpx);
		opacity: 0;
	}
	.submit-area {
		position: absolute;
		left: 0;
		bottom: 0;
		transform: translateY(100%);
		.wh(100%, 50rpx);
		line-height: 50rpx;
		.info {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			.sc(26rpx, #fff);
		}
		&::before {
			content: '';
			posiiton: absolute;
			top: 0;
			left: 0;
			.wh(100%, 100%);
			display: block;
			opacity: 0.9;
			background-color: #f99a02;
		}
	}
	button:nth-of-type(1) {
		position: absolute;
		bottom: 100rpx;
		left: 40rpx;
	}

	button:nth-of-type(2) {
		position: absolute;
		bottom: 100rpx;
		left: 200rpx;
	}
</style>
