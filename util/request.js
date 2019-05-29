import { Tips } from './util.js';
import { baseUrl } from './env';
/**
 * @param {Object} dataObj
 * @param {Number} time : 倒计时弱网的时间
 * @param {String} title: 弱网提示语
*/
let timeArr = [];
class Service {
  constructor() {
    this.timeState = 0;
    this.getNetWorkType();
  }

  getNetWorkType() {
    uni.getNetworkType({
      success: function (res) {
        res.networkType;
        if (res.networkType === 'none') {
          Tips.showToast('网络连接不可用', 3000);
        }
      }
    });
  }

  startTime(time=10000, title='当前信号弱') {
    this.timeState = 1;
    this.timeObj = setTimeout(() => {
      Tips.showToast(title);
    }, time)
  }

  stopTime() {
    if (this.timeState === 1) {
      this.timeObj && clearTimeout(this.timeObj);
      this.timeState = 0;
    }
  }


  checkTime(time, title) {
    if (this.timeState !== 1) {
      this.startTime(time, title);
    }
  }

  request({dataObj, time=10000, title='当前信号弱', showLoading=true, otherBaseUrl = false} = {}) {
    showLoading && Tips.showLoading();
    let { url, data, method } = dataObj;
    this.checkTime(time, title);
    let that = this;
    let Url = '';
    if (!otherBaseUrl) {
      Url = baseUrl + url;
    } else {
      Url = otherBaseUrl + url;
    }
    return new Promise((resolve, reject) => {
      uni.request({
        url: Url,
        data: data,
        method: method,
        dataType: dataObj.dataType || 'json',
        header: {
          'Content-Type': dataObj.dataType || 'application/json'
        },
        success: function (res) {
          showLoading && Tips.hideLoading();
          that.timeState === 1 && that.stopTime();
          if(+res.data.statusCode === 200) {
            resolve(res.data.body);
          } else {
            Tips.showToast('请求失败');
						reject(res);
          }
        },
        fail: function (err) {
          that.timeState = 0;
          showLoading && Tips.hideLoading();
          Tips.showToast('请求失败', 1000);
          throw new Error(err);
        }
      })
    })
  }
}

function GetOpenId(url, appid, secret, code) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: 'GET',
      data: {
        appid: appid,
        secret: secret,
        js_code: code,
        grant_type: "authorization_code"
      },
      success: function (res) {
        if (res.statusCode == -1) {
          Tips.showToast('系统繁忙，稍后再试')
        } else if (res.statusCode == 40029) {
          Tips.showToast('code 无效')
        } else if (res.statusCode == 45011) {
          Tips.showToast('频率限制，稍后再试')
        } else if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          Tips.showToast('网络异常');
        }
      }
    })
  })
}

export {
  Service,
  GetOpenId
}