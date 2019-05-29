let allSoundArr = [];
import { Tips } from './util';
/**
   * 创建声音对象
   * @param {string} urlStr :sound Url
   * @param {boolean} loop  :true: 循环播放；
   * @param {Object} option : isBgsound(是否是背景音乐)  默认值false, :volume 音量；
   * @param {function} playCallback : 播放音乐成功之后的回调函数；
   * @returns 
   * @memberof Courseware
*/
class SoundBasic {
  constructor(urlStr, loop = false, option = {isBgsound:false}, playCallback) {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = urlStr;
    this.innerAudioContext.loop = loop;
    this.innerAudioContext.option = option;
    if (option.volume) {
      this.innerAudioContext.volume = option.volume;
    }
    allSoundArr.push(this.innerAudioContext);

    this.innerAudioContext.onPlay((event) => {
      if (playCallback && typeof playCallback === 'function') {
        playCallback();
      }
    });

    this.innerAudioContext.onError((res) => {
      // Tips.showToast('音频无法播放');
      console.warn(res.errMsg);
      console.warn(res.errCode);
    });
  }

  stopCurrentSound() {
    this.innerAudioContext.stop();
  }

  stopAllSound() {
    allSoundArr.forEach((item) => {
      if (!item.paused) {
        item.stop();
      }
    });
  }

  stopExceptBgSound() {
    allSoundArr.forEach((item) => {
      if (!item.option.isBgsound && item && item.isPlaying) {
        item.stop();
      }
    });
  }

  playSound() {
    this.stopExceptBgSound();
    this.innerAudioContext.play();
    this.innerAudioContext.isPlaying = true;
    return new Promise((resolve, reject) => {
      this.innerAudioContext.onEnded(() => {
        this.innerAudioContext.isPlaying = false;
        resolve();
      });
    });

  }
}

let animationArr = [];
class RepeatAnimation {
  constructor(game) {
    this.game = game;
    this.stopRepeatAnimation = false;
    animationArr.push(this);
  }

  stop() {
    this.stopRepeatAnimation = true;
  }

  start(key, number = 7, time = 200) {
    this.name = key + 'Image';
    this.origin = this.game[key];
    this.translate = this.game[(key + 'Asmile')];
    animationArr.forEach(item => {
      item.stop();
    });
    this.stopRepeatAnimation = false;
    this.repeatAnimation(key, number, time);
  }

  toggleBackground(key) {
    if (key === 'girl') {
      this.game['girlImage'] = this.game[('girlAblack')];
    } else if (key === 'boy') {
      this.game['boyImage'] = this.game[('boyAblack')];
    }
  }

  repeatAnimation(key, number, time) {
    this.game[this.name] = this.origin;
    let pro = Promise.resolve();
    for(let i = 0; i < number; i ++) {
      pro = pro.then(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (i%2 === 0) {
              this.game[this.name] = this.origin;
            } else {
              this.game[this.name] = this.translate;
            }
            if (this.stopRepeatAnimation) {
              if (this.game.objectKey === 'girl' ||  this.game.objectKey === 'boy') {
                this.toggleBackground(key);
              }
              reject();
            } else {
              resolve();
            }
          }, time);
        });
      });
      pro.catch(() => {});
    }
  }
}

class StartTiming {
  constructor() {
    this.isStart = false;
  }

  start(time) {
    this.isStart = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.isStart) {
          resolve();
          this.isStart = false;
        } else {
          reject();
        }
      }, time);
    });
  }

  stop() {
    this.isStart = false;
  }
}


export {
  SoundBasic,
  RepeatAnimation,
  StartTiming
};