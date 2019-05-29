<template>
  <div class="selectAwrap" :animation="bgAnimationData" :style="{backgroundImage:'url('+bgImage+')'}">
    <!-- 以下为预加载 GG -->
    <div style="display: none" :style="{backgroundImage: 'url('+ catAblack +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ catAsmile +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ dogAblack +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ dogAsmile +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ girlAblack +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ girlAsmile +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ boyAblack +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ boyAsmile +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ grassAblack +')'}"></div>
    <div style="display: none" :style="{backgroundImage: 'url('+ bgAblack +')'}"></div>
    <!-- 预加载结束 -->
    <div class="speaker" :animation="speakerAnimationData" :style="{backgroundImage: 'url('+ speaker +')'}"></div>
    <div class="tipBox" :animation="tipBoxAnimationData" :style="{backgroundImage: 'url('+ tipBox +')'}">
      <div class="tipContent" :animation="tipOneAnimationData"><div>整个测评约10分钟，请根据</div><div>宝宝平时的表现情况回答~</div></div>
      <div class="tipContent" :animation="tipTwoAnimationData"><div>点击下方的小朋友</div><div>告诉我们宝宝是男孩还是女孩？</div></div>
      <div class="tipContent" :animation="tipThreeAnimationData"><div>上下滑动选择</div><div>告诉我们宝贝今年几岁啦？</div></div>
    </div>
    <div class="cat" :animation="catAnimationData" :style="{backgroundImage: 'url('+ catImage +')'}"></div>
    <div class="dog" :animation="dogAnimationData" :style="{backgroundImage: 'url('+ dogImage +')'}"></div>
    <div class="girl" :animation="girlAnimationData" :style="{backgroundImage:'url('+ girlImage+')'}"></div>
    <div class="boy" :animation="boyAnimationData" :style="{backgroundImage: 'url(' + boyImage +  ')'}"></div>
    <view class="beginAgrass" :animation="grassAnimationData" :style="{backgroundImage:'url('+grassImage+')'}"></view>
    <!-- 小程序不支持点透事件， 下面的元素模拟点击事件 -->
    <div class="clickWarp" @click="clickWarp"> </div>
    <div class="clickCat" @click="clickCat"></div>
    <div class="clickDog" @click="clickDog"></div>
    <div class="clickGirl" @click="clickGirl"></div>
    <div class="clickBoy" @click="clickBoy"></div>
    <!-- 选择年龄div -->
    <div class="ageBg" v-if="isShowAge" :style="{backgroundImage: 'url(' + ageBg +  ')'}"></div>
    <div class="ageName" v-if="isShowAge" >岁</div>
    <div  class="startTest" v-if="isShowTest" :style="{backgroundImage: 'url(' + startTest +  ')'}">
      <button id="clickobject" :style="'opacity: 0'" class="primary" type="primary" open-type="getUserInfo" @getuserinfo="bindGetUserInfo"></button>
    </div>
    <div class="selectAgeWarp" v-if="isShowAge">
      <picker-view 
      :indicator-style="indicatorStyle"
      :value="value" 
      :mask-style="maskStyle"
      @change="bindChangeto"
      class="pickerView">
        <picker-view-column>
            <view class="item" style="padding-left: 45%;" v-for="(item,index) in ages" :key="index">{{item}}</view>
        </picker-view-column>
      </picker-view>
    </div>
  </div>
</template>
<script>
import { EvenSelectPage } from "../../util/imageData";
import { SoundBasic, RepeatAnimation, StartTiming } from "../../util/sound";
import { updateUserInfo, AddDataRequireUserInfo } from "../../util/api"
import { Storage } from "../../util/util"
export default {
  data() {
    return {
      ages: [0, 5, 6, 7, 8, 9, 10, 11, 12],
      age: 0,
      value: [0],
      indicatorStyle: 'height: 42px;opacity: 0;',
      maskStyle: 'background: rgba(25,25,25,0);',
      ...EvenSelectPage,
      bgImage: EvenSelectPage.bg,
      catImage: EvenSelectPage.cat,
      dogImage: EvenSelectPage.dog,
      girlImage: EvenSelectPage.girl,
      boyImage: EvenSelectPage.boy,
      grassImage: EvenSelectPage.grass,
      catAnimationData: {},
      dogAnimationData: {},
      girlAnimationData: {},
      boyAnimationData: {},
      speakerAnimationData: {},
      tipBoxAnimationData: {},
      bgAnimationData: {},
      grassAnimationData: {},
      tipNodeAnimationData: {},
      tipOneAnimationData: {},
      tipTwoAnimationData: {},
      tipThreeAnimationData: {},
      inputEnable: false,
      kidGender: 0,
      kidAge: 0,
      isShowAge: false,
      isShowTest: false,
      objectKey: 'girl',
      // 数据埋点；
      clickobject: '女',
      currentpage: 'pages/selectPage/index'
    };
  },
  async onShow() {
    this.initPosition();
    await this.awaitByPormise(200);
    await this.showAllElement();
    await this.showSpeaker();
    await this.showTipBox();
    await this.hideNodeText('tipOneAnimationData');
    await this.showNodeText('tipTwoAnimationData');
    await this.toggleBlack();
    await this.boyMoveEyes();
    await this.girlMoveEyes();
    this.inputEnable = true;
    this.startTiming.start(2000).then(() => {
      this.isShowAge = true;
      this.showThreeNode();
    }).catch(() => {})
  },
  mounted() {
    this.initSound();
  },
  methods: {
    async showThreeNode() {
      await this.hideNodeText('tipTwoAnimationData');
      this.showNodeText('tipThreeAnimationData');
    },
    bindGetUserInfo(e) {
      const { userInfo, encryptedData, iv } = e.detail;
      let data = {...e.detail.userInfo, kidAge: this.kidAge, kidGender: this.kidGender };
      let weChatLocation = userInfo.country + '-' + userInfo.city + '-' + userInfo.province
      let addData = {weChatLocation: weChatLocation, weChatGender: userInfo.gender, weChatSelectGender: this.kidGender }
      // console.log('e', e);
      AddDataRequireUserInfo(addData);
      Storage.setStorage('nickName', e.detail.userInfo.nickName);
      updateUserInfo(data).then(() => {
        uni.redirectTo({
          url: `../../assessPage/index/index?status=0`
        })
      })
    },
    bindChangeto(e) {
      const val = e.detail.value // [4]
      this.kidAge = this.ages[val[0]];
      if (this.kidAge !==0) {
        this.isShowTest = true;
      } else {
        this.isShowTest = false;
      }
    },
    playAnimation(key) {
      this.startTiming.stop();
      this.isShowAge = true;
      let soundName = key + 'SoundBasic';
      let animationName = key + 'Animation';
      this[soundName].playSound();
      this[animationName].start(key);
    },
    clickWarp() {
      if (!this.inputEnable) return;
      // isClickWarp 标记 不可以二次点击；
      this.isClickWarp = 1;
      if (this.isClickWarp === 1) {
        this.isClickWarp = this.isClickWarp + 1;
        this.startTiming.stop();
        this.isShowAge = true;
        this.showThreeNode();
      }
    },
    clickCat() {
      if (!this.inputEnable) return;
      this.objectKey = 'cat';
      this.playAnimation('cat')
    },
    clickDog() {
      if (!this.inputEnable) return;
      this.objectKey = 'dog';
      this.playAnimation('dog')
    },
    clickGirl() {
      if (!this.inputEnable) return;
      this.objectKey = 'girl';
      this.clickobject = '女';
      this.kidGender = 0;
      this.playAnimation('girl');
      this.boyImage = EvenSelectPage.boyAblack;
    },
    clickBoy() {
      if (!this.inputEnable) return;
      this.clickobject = '男';
      this.objectKey = 'boy';
      this.kidGender = 1;
      this.playAnimation('boy');
      this.girlImage = EvenSelectPage.girlAblack;
    },
    // 初始化声音；
    initSound() {
      let micSound = this.micSound;
      let girlSound = this.girlSound;
      let boySound = this.boySound;
      let catSound = this.catSound;
      let dogSound = this.dogSound;
      // 初始化声音
      this.soundBasic = new SoundBasic(micSound);
      this.boySoundBasic = new SoundBasic(boySound);
      this.girlSoundBasic = new SoundBasic(girlSound);
      this.catSoundBasic = new SoundBasic(catSound);
      this.dogSoundBasic = new SoundBasic(dogSound);
      // 初始化动画 cat dog boy girl
      this.boyAnimation = new RepeatAnimation(this);
      this.girlAnimation = new RepeatAnimation(this);
      this.catAnimation = new RepeatAnimation(this);
      this.dogAnimation = new RepeatAnimation(this);
      // 初始化倒计时
      this.startTiming = new StartTiming();
    },
    // 所有的人物消失
    initPosition() {
      this.isShowAge = false;
      this.isShowTest = false;
      let tipBoxTransition = uni.createAnimation({
        duration: 10,
        timingFunction: "ease",
        transformOrigin: "50% 50% 300"
      });
      tipBoxTransition.rotateY(0).opacity(1).step();
      this['tipOneAnimationData'] = tipBoxTransition.export();
      
      let allTransition = uni.createAnimation({
        duration: 10,
        timingFunction: "ease"
      });
      // 草消失
      allTransition.opacity(0).step();
      this.catAnimationData = allTransition;
      this.dogAnimationData = allTransition;
      this.girlAnimationData = allTransition;
      this.boyAnimationData = allTransition;

      // speaker 消失；
      let speakerTransition = uni.createAnimation({
        duration: 10,
        timingFunction: "ease"
      });
      speakerTransition.translate(-100, 0).step();
      this.speakerAnimationData = speakerTransition.export();

      // 文字消失 two
      let tipTwoTransition = uni.createAnimation({
        duration: 10,
        timingFunction: "ease"
      });
      tipTwoTransition
        .rotateY(90)
        .opacity(0)
        .step();
      this.tipTwoAnimationData = tipTwoTransition.export();

      // 文字小时 three
      let tipThreeTransition = uni.createAnimation({
        duration: 10,
        timingFunction: "ease"
      });
      tipThreeTransition
        .rotateY(90)
        .opacity(0)
        .step();
      this.tipThreeAnimationData = tipThreeTransition.export();

      // tipbox 消失；
      this.hideTipBox();
    },
    hideTipBox(time = 10) {
      // tipbox 消失；
      let tipBoxTransition = uni.createAnimation({
        duration: time,
        timingFunction: "ease"
      });
      tipBoxTransition
        .rotateY(90)
        .opacity(0)
        .step();
      this.tipBoxAnimationData = tipBoxTransition.export();
      return this.awaitByPormise(time);
    },
    hideNodeText(name) {
      let tipNodeTransition = uni.createAnimation({
        duration: 200,
        timingFunction: "ease"
      });
      tipNodeTransition.opacity(0).step();
      this[name] = tipNodeTransition.export();
      return this.awaitByPormise(200);
    },
    showNodeText(name) {
      let tipBoxTransition = uni.createAnimation({
        duration: 500,
        timingFunction: "ease",
        transformOrigin: "50% 50% 300"
      });
      tipBoxTransition.rotateY(0).opacity(1).step();
      this[name] = tipBoxTransition.export();
      return this.awaitByPormise(1000);
    },
    showAllElement() {
      let allTransition = uni.createAnimation({
        duration: 800,
        timingFunction: "ease"
      });
      allTransition.opacity(1).step();
      this.catAnimationData = allTransition;
      this.dogAnimationData = allTransition;
      this.girlAnimationData = allTransition;
      this.boyAnimationData = allTransition;
      return this.awaitByPormise(500);
    },
    showSpeaker() {
      this.soundBasic.playSound();
      let speakerTransition = uni.createAnimation({
        duration: 300,
        timingFunction: "ease"
      });
      speakerTransition.translate(0, 0).step();
      this.speakerAnimationData = speakerTransition.export();
      return this.awaitByPormise(100);
    },
    showTipBox() {
      let tipBoxTransition = uni.createAnimation({
        duration: 600,
        timingFunction: "ease",
        transformOrigin: "50% 50% 300"
      });
      tipBoxTransition.rotateY(0).opacity(1).step();
      this.tipBoxAnimationData = tipBoxTransition.export();
      return this.awaitByPormise(4000);
    },
    toggleBlack() {
      this.bgImage = EvenSelectPage.bgAblack;
      this.grassImage = EvenSelectPage.grassAblack;
      this.catImage = EvenSelectPage.catAblack;
      this.dogImage = EvenSelectPage.dogAblack;
      this.girlImage = EvenSelectPage.girlAblack;
      this.boyImage = EvenSelectPage.boyAblack;
      return this.awaitByPormise(500);
    },
    boyMoveEyes() {
      this.boyAnimation.start('boy');
      return this.awaitByPormise(200).then(() => {
        return this.boySoundBasic.playSound();
      })
    },
    girlMoveEyes() {
      this.boyImage = this.boyAblack;
      this.boyAnimation.start('girl');
      return this.awaitByPormise(200).then(() => {
        return this.girlSoundBasic.playSound();
      })
    },
    awaitByPormise(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    }
  }
};
</script>
<style lang="less" scope>
.primary {
  height: 75upx;
  width: 190upx;
}
.startTest {
  position: absolute;
  z-index: 111;
  bottom: 0;
  left: 160upx;
  height: 290upx;
  width: 405upx;
  background-size: 100% 100%;
  padding-top: 85upx;
  box-sizing: border-box;
}
.ageBg {
  position: absolute;
  z-index: 109;
  top: 446upx;
  height: 83upx;
  width: 100%;
  background-size: 100% 100%;
}
.ageName {
  position: absolute;
  z-index: 109;
  top: 462upx;
  right: 234upx;
  padding-left:100upx;
  font-size: 34upx;
  color: rgb(102,102,102);
  line-height: 44upx;
}
.selectAgeWarp .pickerView .item {
  color: #087071;
  line-height: 42px;
}
.selectAgeWarp {
  height: 249upx;
  width: 100%;
  position: absolute;
  top: 361upx;
  z-index: 110;
  box-sizing: border-box;
  .pickerView {
    height: 249upx;
    width: 100%;
    position: absolute;
  }
}
.clickWarp {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: 101;
}
.tipContent {
  position: absolute;
  color: #087071;
  line-height: 44upx;
  font-size: 32upx;
  padding: 50upx 0 0 60upx;
  font-family: "PingFangSC-Semibold";
  font-weight: 600;
}
.selectAwrap {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-size: 100% 100%;
  animation: mymove 1s;
  -webkit-animation: mymove 1s;
}

.beginAgrass {
  position: fixed;
  bottom: 0;
  left: 0;
	height: 538upx;
	width: 750upx;
  background-size: 100% 100%;
  z-index: 100;
}
.boy {
  position: absolute;
  left: 85upx;
  bottom: 16upx;
  width: 300upx;
  height: 560upx;
  background-size: 100% 100%;
  z-index: 2;
}
.clickBoy {
  position: absolute;
  left: 85upx;
  bottom: 16upx;
  width: 300upx;
  height: 568upx;
  background: rgba(1, 1, 1, 0);
  z-index: 102;
}
.girl {
  position: absolute;
  left: 355upx;
  bottom: 40upx;
  width: 235upx;
  height: 450upx;
  background-size: 100% 100%;
  z-index: 3;
}
.clickGirl {
  position: absolute;
  left: 355upx;
  bottom: 40upx;
  width: 235upx;
  height: 450upx;
  z-index: 102;
  background: rgba(1, 1, 1, 0);
}
.dog {
  position: absolute;
  left: 278upx;
  bottom: 16upx;
  width: 160upx;
  height: 225upx;
  background-size: 100% 100%;
  z-index: 4;
}
.clickDog {
  position: absolute;
  left: 278upx;
  bottom: 16upx;
  width: 160upx;
  height: 225upx;
  background: rgba(1, 1, 1, 0);
  z-index: 103;
}
.cat {
  position: absolute;
  left: 447upx;
  bottom: 450upx;
  width: 120upx;
  height: 112upx;
  background-size: 100% 100%;
  z-index: 5;
}
.clickCat {
  position: absolute;
  left: 447upx;
  bottom: 450upx;
  width: 120upx;
  height: 112upx;
  background: rgba(1, 1, 1, 0);
  z-index: 103;
}
.speaker {
  position: absolute;
  top: 250upx;
  left: 0;
  height: 196upx;
  width: 154upx;
  background-size: 100% 100%;
}
.tipBox {
  position: absolute;
  top: 96upx;
  right: 136upx;
  height: 236upx;
  width: 525upx;
  background-size: 100% 100%;
}
</style>
