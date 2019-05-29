class Tips {
  constructor() {
    this.isLoading = false;
  }
	
  static showToast(title='成功', duration=1500, icon='none') {
    uni.showToast({
      title: title,
      mask: true,
      icon: icon,
      duration: duration
    });
  }
	
  static hideToast() {
    uni.hideToast();
  }
	
  static showLoading(title='加载中') {
    if (!this.isLoading) {
      uni.showLoading({
        title: title,
        mask: true
      });
      this.isLoading = true;
    }
  }
	
  static hideLoading() {
    if (this.isLoading) {
      uni.hideLoading();
      this.isLoading = false;
    }
  }
  
  static showModal(options, successFun, failFun ) {
    let successCallback = function() {};
    let failCallback =  function() {};
    if (successFun && typeof successFun === 'function') {
      successCallback = successFun;
    }
    if (failFun && typeof failFun === 'function') {
      failCallback = failFun;
    }
    let { title, tontent } = options;
    uni.showModal({
      title: title,
      content: tontent,
      success: function(res) {
        if (res.confirm) {
          successCallback();
        } else if (res.concel) {
          failCallback();
        }
      }
    });
  }
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
    });
  }

  static getStorage(key) {
    return new Promise((resolve, reject) => {
      uni.getStorage({
        key: key,
        success: function (res) {
          resolve(res.data);
        },
        fail: function() {
          reject();
        }
      });
    });
  }

  static removeStorage(key) {
    return new Promise((resolve, reject) => {
      uni.removeStorage({
        key: key,
        success: resolve,
        fail: reject
      });
    });
  }

  static clearStorage() {
    uni.clearStorage();
  }

  static setStorageSync(key, data) {
    try {
      uni.setStorageSync(key, data);
    } catch (e) {
      console.warn(e);
    }
  }

  static getStorageSync(key) { 
    try {
      const value = uni.getStorageSync(key);
      if (value) {
        return value;
      } else {
        console.warn('获取Storage失败');
      }
    } catch (e) {
      console.warn(e);
    }
  }
}

function afterHandle(afterFunc, targetFunc) {
  let proxy = new Proxy(targetFunc, {
    apply(target, ctx, args) {
      Reflect.apply(target, ctx, [].concat(args)).then((res) => {
        Reflect.apply(afterFunc, ctx, [].concat([res]));
      });
    }
  });
  return proxy;
}

export {
  Tips,
  Storage,
  afterHandle
};