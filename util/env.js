
let baseUrl = ''
if(process.env.NODE_ENV === 'development'){
  baseUrl = 'https://uskkuau9zf.execute-api.cn-north-1.amazonaws.com.cn'
}else{
  baseUrl = 'https://uskkuau9zf.execute-api.cn-north-1.amazonaws.com.cn'
}
// let otherBaseUrl = 'http://api.4006688991.com/api/MiniProgram';
let otherBaseUrl = 'https://uat-api.4006688991.com/api/MiniProgram';

export { baseUrl, otherBaseUrl };