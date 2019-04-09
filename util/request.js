

function Request(dataObj) {
  Tips.showLoading()
  let { url, data, method } = dataObj;
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      data: data,
      method: method,
      success: function (res) {
        Tips.hideLoading()
        resolve(res);
        console.log(res);
      },
      fail: function (err) {
        Tips.hideLoading()
        Tips.showToast('请求失败', 1000);
        throw err;
      }
    })
  })
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
  Request,
  GetOpenId
}