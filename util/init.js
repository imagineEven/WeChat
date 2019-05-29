import { Tips, Storage } from "./util"
import { getOpenId } from "./api"
require('./sound')

// 获取供应商
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
        console.warn('获取供应商失败', err)
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
      	reject(err);
      }
    });
  })
}

export {
  getProvider,
  login
}