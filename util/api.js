import { Request, GetOpenId } from './request';
import { baseUrl, weixinBaseUrl, appId, secret } from './env';

// 获取微信openid
function getOpenId(code) {
  return GetOpenId(weixinBaseUrl, appId, secret, code);
}



export {
  getOpenId
}