import {Tips} from "./util"
require('./api');
let baseUrl = ''
if(process.env.NODE_ENV === 'development'){
  baseUrl = 'https://192.168.2.247'
}else{
  baseUrl = 'https://mini-program.imaginelearning.cn'
}
// Tips.showLoading();


// console.log('auth', auth)
// 获取openId
function getOpenId(code) {
  uni.request({
  	url: 'https://api.weixin.qq.com/sns/jscode2session',
    method: 'GET',
    data: {
      appid: "wx975d5ceaf8611171",
      secret: "21ceadae454237fb0f61bd847d643e50",
      js_code: code,
      grant_type: "authorization_code"
    },
    success: function(res) {
      console.log('res', res);
    }
  })
}

// 获取提供商
function getProvider() {
  return new Promise((resolve, reject)=> {
    uni.getProvider({
      service: 'oauth',
      success: function (res) {
        if (res.provider.length > 0) {
          resolve(res.provider)
        } else {
          reject('没有获取到provider')
        }
      },
      fail: function (err) {
        console.log('获取供应商失败', err)
        reject(err)
      }
    }); 
  })
}
// 获取token
function login(provider) {
  return new Promise((resolve, reject)=> {
    uni.login({
      provider: provider,
      success: function (loginRes) {
        if (loginRes.code) {
          resolve(loginRes.code);
        } else {
          reject('没有获取到code')
        }
      },
      fail: function(err) {
      	reject(err)
      }
    });
  })
}

getProvider().then(providerArr => {
  let provider = providerArr[0];
  console.log('provider', provider);
  return login(provider)
}).then(code => {
  getOpenId(code)
  console.log('code', code)
}).catch(err => {
  throw err;
})

let init = {
	baseUrl: baseUrl
};
export default init;
