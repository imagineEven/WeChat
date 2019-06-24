<template>
  <view class="begin_wrap" :style="{backgroundImage:'url('+bgImage+')'}">
    <view class="begin_tip" v-if="iamgeVisiable">
      <view class="tip_box" :animation="boxAnimationData">111本测试旨在为孩子个性化学习提供解决方案。美国想象力英语根据美国著名心理学家、美国耶鲁大学博士提出阿尔法多元智能测评，选取全球1400万个学生样本及人工智能分析，协助家长全面了解孩子的潜能天赋，科学启发天赋潜能，实现因材施教。</view>
	    <img @click="getIntro" id="intoPage" class="tip_btn" :src="introImage" v-if="testStatus === 1" alt="" :animation="btnAnimationData">
			<view class="continueIntro" v-else-if="testStatus === 2">
				<img @click="continueIntro" id="intoPage" :animation="btnAnimationData"  class="btnOne" :src="continueImage" alt="">
				<img @click="resetIntro" id="intoPage" :animation="btnAnimationData" class="resetIntro" :src="resetImage" alt="">
			</view>
			<view class="continueIntro" v-else-if="testStatus === 3">
				<img @click="resetIntro" :animation="btnAnimationData" id="intoPage" class="resetIntroBtn" :src="resetImageBtn" alt="">
				<view @click="lookResult" :animation="lookResultAnimationData" id="intoPage" class="lookResult" :style="{backgroundImage: 'url('+ lookResultImage +')'}"></view>
			</view>
    </view>
    <img :src="peopleImage" class="begin_people" :animation="peopleAnimationData" v-show="iamgeVisiable"></img>
    <view class="begin_grass" :animation="grassAnimationData" v-show="iamgeVisiable" :style="'background-image:url('+grassImage+')'"></view>
  </view>
</template>

<script>
import { EvenPagesIdnex } from "../../util/imageData";
import { SoundBasic } from "../../util/sound";
import { Tips, Storage } from "../../util/util";
import { getOpenId } from "../../util/api";
import { GetOpenId } from "../../util/request";
import { getProvider, login } from "../../util/init";
export default {
  data() {
    return {
      ...EvenPagesIdnex,
      isFirst: 0,
      iamgeVisiable: false,
      grassAnimationData: {},
      peopleAnimationData: {},
      boxAnimationData: {},
      lookResultAnimationData: {},
      btnAnimationData: {},
      testStatus: 1,
      buttonname: "点击进入",
      currentprogram: "性格优势测试",
      isfirstvisit: "是",
      currentpage: "pages/index/index"
    };
  },
  onLoad() {},
  onShow(options) {
    getProvider()
      .then(providerArr => {
        let provider = providerArr[0];
        return login(provider);
      })
      .then(code => {
				// 这里还是需要改动的；
        return GetOpenId(code);
      })
      .then(data => {
				console.log('data', data);
      })
      .catch(err => {
        console.warn(err);
      });
    let pro;
    if (!this.isFirst) {
      pro = this.awaitByPormise(1000);
    } else {
      pro = this.awaitByPormise(100);
      this.initSound();
    }
    pro
      .then(() => {
        this.iamgeVisiable = true;
        return this.initPosition();
      })
      .then(() => {
        return this.createGrassAnimation();
      })
      .then(() => {
        return this.createPeopleAnimation();
      })
      .then(() => {
        this.createBoxAnimation();
        return this.createBtnAnimation();
      })
      .then(() => {
        this.shakeBoxAnimation();
      });
  },
  mounted() {
    this.isFirst = 1;
    this.initSound();
  },
  methods: {
    initSound() {
      let clickBtnSound = this.clickBtnSound;
      let introPepleSound = this.introPepleSound;
      this.clickBtnSoundObj = new SoundBasic(clickBtnSound);
      this.introPepleSound = new SoundBasic(introPepleSound);
    },
    initPosition() {
      let allTransition = uni.createAnimation({
        duration: 100,
        timingFunction: "ease"
      });
      // 草消失
      allTransition.translate(0, 400).step();
      this.grassAnimationData = allTransition.export();
      // 人物消失
      allTransition.translate(0, 400).step();
      this.peopleAnimationData = allTransition.export();

      let scaleTransition = uni.createAnimation({
        duration: 100,
        timingFunction: "ease"
      });
      // 话框消失
      scaleTransition
        .scale(0.1)
        .opacity(0)
        .step();
      this.boxAnimationData = scaleTransition.export();
      // 按钮消失
      scaleTransition
        .scale(0.1)
        .opacity(0)
        .step();
      this.btnAnimationData = scaleTransition.export();

      // 查看结果消失
      let lookResultAnimation = uni.createAnimation({
        duration: 100,
        timingFunction: "ease"
      });
      lookResultAnimation
        .scale(0.01)
        .opacity(0)
        .step();
      this.lookResultAnimationData = lookResultAnimation.export();
      return this.awaitByPormise(150);
    },

    createGrassAnimation() {
      let grassAnimation = uni.createAnimation({
        duration: 300,
        timingFunction: "ease"
      });
      grassAnimation.translate(0, 0).step();
      this.grassAnimationData = grassAnimation.export();
      return this.awaitByPormise(500);
    },
    createPeopleAnimation() {
      let peopleAnimation = uni.createAnimation({
        duration: 400,
        timingFunction: "ease"
      });
      this.awaitByPormise(200).then(() => {
        this.introPepleSound.playSound();
      });
      peopleAnimation.translate(0, 0).step();
      this.peopleAnimationData = peopleAnimation.export();
      return this.awaitByPormise(400);
    },
    createBoxAnimation() {
      let boxAnimation = uni.createAnimation({
        duration: 200,
        timingFunction: "linear"
      });
      boxAnimation
        .scale(1, 1)
        .opacity(1)
        .step();
      this.boxAnimationData = boxAnimation.export();
      return this.awaitByPormise(250);
    },
    createBtnAnimation() {
      let btnAnimation = uni.createAnimation({
        duration: 200,
        timingFunction: "linear"
      });
      btnAnimation
        .scale(1, 1)
        .opacity(1)
        .step();
      this.btnAnimationData = btnAnimation.export();

      // 创建查看结果动画
      let lookResultAnimation = uni.createAnimation({
        duration: 500,
        timingFunction: "ease"
      });
      lookResultAnimation
        .scale(1, 1)
        .opacity(1)
        .step();
      this.lookResultAnimationData = lookResultAnimation.export();
      return this.awaitByPormise(250);
    },
    shakeBtnAnimation(time = 400) {
      let shakeBigAnimation = uni.createAnimation({
        duration: 300,
        timingFunction: "ease"
      });
      shakeBigAnimation.scale(1.3).step();
      shakeBigAnimation.scale(1).step({
        duration: 200,
        timingFunction: "ease"
      });
      this.btnAnimationData = shakeBigAnimation.export();
      return this.awaitByPormise(time);
    },
    shakeBoxAnimation() {
      let shakeBigAnimation = uni.createAnimation({
        duration: 200,
        timingFunction: "ease"
      });
      shakeBigAnimation.scale(1.1).step();
      shakeBigAnimation.scale(1).step({
        duration: 100,
        timingFunction: "ease"
      });
      this.boxAnimationData = shakeBigAnimation.export();
      return this.awaitByPormise(200);
    },
    awaitByPormise(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
    getOut() {
      // 退出动画;
      this.shakeBtnAnimation().then(() => {
        let outTransition = uni.createAnimation({
          duration: 500,
          timingFunction: "ease"
        });
        outTransition
          .scale(0.1, 0.1)
          .opacity(0)
          .step();
        this.boxAnimationData = outTransition;
        this.btnAnimationData = outTransition;

        let peopleTransition = uni.createAnimation({
          duration: 500,
          timingFunction: "ease"
        });
        peopleTransition.translate(0, 400).step();
        this.peopleAnimationData = peopleTransition.export();
      });
    },
    getIntro() {
      this.buttonname = "点击进入";
      this.getOut();
      this.clickBtnSoundObj.playSound().then(() => {
        uni.navigateTo({
          url: "../selectPage/index"
        });
      });
    },
    continueIntro() {
      this.buttonname = "继续测评";
      uni.redirectTo({
        url: `../../assessPage/index/index?status=1`
      });
    },
    resetIntro() {
      this.buttonname = "从新测评";
      Tips.showModal(
        {
          title: "提示",
          tontent: "确定从新测评吗？"
        },
        function() {
          uni.redirectTo({
            url: `../../assessPage/index/index?status=0`
          });
          // 移除结果页测试数据
          Storage.removeStorage("DetailList");
          Storage.removeStorage("RadarCanvasImg");
        }
      );
    },
    lookResult() {
      this.buttonname = "从新测评";
      uni.navigateTo({
        url: "../../resultPage/index/index",
        animationType: "pop-in",
        animationDuration: 200
      });
    }
  }
};
</script>

<style lang="less" scoped>
.audio {
  position: absolute;
  top: -50vh;
  height: 30vh;
  z-index: 100;
}
.begin_wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-size: 100% 100%;
}
.begin_grass {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 538upx;
  width: 750upx;
  background-size: 100% 100%;
  z-index: 1;
}
.begin_people {
  position: absolute;
  height: 412upx;
  width: 378upx;
  bottom: 16upx;
  left: 186upx;
}
.begin_tip {
  position: relative;
  height: 100%;
  width: 750upx;
}
.tip_box {
  box-sizing: border-box;
  position: absolute;
  top: 58upx;
  left: 30upx;
  height: 568upx;
  width: 697upx;
  z-index: 2;
  background: url("https://s3.cn-north-1.amazonaws.com.cn/personality-assessment/Images/08e0ac675b9876e7c3ada9bffe67c442.png");
  background-size: 100% 100%;
  color: #ffffff;
  font-size: 34upx;
  line-height: 50upx;
  padding: 56upx 50upx;
}
.public {
  position: absolute;
  width: 100%;
  z-index: 3;
}
.continueIntro {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: 4;
}
.resetIntro {
  position: absolute;
  left: 100upx;
  top: 506upx;
  height: 216upx;
  width: 216upx;
  z-index: 4;
}
.resetIntroBtn {
  position: absolute;
  left: 172.5upx;
  top: 466upx;
  z-index: 3;
  height: 290upx;
  width: 405upx;
}
.lookResult {
  position: absolute;
  top: 705upx;
  left: 176upx;
  height: 44upx;
  width: 390upx;
  z-index: 110;
  background-size: 100% 100%;
}
.btnOne {
  position: absolute;
  left: 215upx;
  top: 466upx;
  height: 290upx;
  width: 405upx;
  z-index: 4;
}
.tip_btn {
  position: absolute;
  left: 172.5upx;
  top: 466upx;
  z-index: 3;
  height: 290upx;
  width: 405upx;
}
</style>
