
let baseUrl = ''
if(process.env.NODE_ENV === 'development'){
  baseUrl = 'https://192.168.2.247'
}else{
  baseUrl = 'https://mini-program.imaginelearning.cn'
}

let weixinBaseUrl = 'https://api.weixin.qq.com/sns/jscode2session';
let appId = "wx975d5ceaf8611171"
let secret = "21ceadae454237fb0f61bd847d643e50"

export { baseUrl, weixinBaseUrl, appId, secret };