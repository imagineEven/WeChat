class Tips {
	constructor() {
	  console.log('this is the tips')
		this.isLoading = false;
	}
	
	static showToast(title="成功", duration=1500, icon='none') {
		uni.showToast({
			title: title,
      mask: true,
      icon: icon,
      duration: duration
		})
	}
	
	static hideToast() {
		uni.hideToast()
	}
	
	static showLoading(title='加载中') {
    if (!this.isLoading) {
      uni.showLoading({
        title: title,
        mask: true
      })
      this.isLoading = true;
    }
	}
	
	static hideLoading() {
    if (this.isLoading) {
      uni.hideLoading()
      this.isLoading = false;
    }
	}
}
  
function request(dataObj) {
  Tips.showLoading()
  let {url, data, method} = dataObj;
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      data: data,
      method: method,
      success: function(res) {
        Tips.hideLoading()
        resolve(res);
        console.log(res);
      },
      fail: function(err) {
        Tips.hideLoading()
        Tips.showToast('请求失败', 1000);
        throw err;
      }
    })
  })
}

class Storage {
  constructor() {
  }

  static setStorage(key, data) {
    return new Promise((resolve, reject) => {
      uni.setStorage({
        key: key,
        data: data,
        success: resolve,
        fail: reject
      });
    })
  }

  static getStorage(key) {
    return new Promise((resolve, reject) => {
      uni.getStorage({
        key: key,
        success: function (res) {
          resolve(res.data)
        },
        fail: function() {
          reject();
        }
      });
    })
  }

  static removeStorage(key) {
    return new Promise((resolve, reject) => {
      uni.removeStorage({
        key: key,
        success: resolve,
        fail: reject
      });
    })
  }

  static clearStorage() {
    uni.clearStorage();
  }
}

export {
	Tips,
  request,
  Storage
}