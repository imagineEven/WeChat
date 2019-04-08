class Tips {
	constructor() {
	  console.log('this is the tips')
		this.isLoading = false;
	}
	
	static showToast(title="成功", duration=1500) {
		uni.showToast({
			title: title,
			mask: true,
      duration: duration
		})
	}
	
	static hideToast() {
		uni.hideToast()
	}
	
	static showLoading(title='加载中') {
    if (!this.isLoading) {
      uni.showLoading({
        title: '加载中',
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

class Request {
  constructor() {
  }
  
//   request(dataObj) {
//     Tips.showLoading()
//     let {url, data, method} = dataObj;
//     return new Promise((resolve, reject) => {
//       uni.request({
//         url: url,
//         data: data,
//         method: method,
//         success: function(res) {
//           Tips.hideLoading()
//           resolve(res);
//         	console.log(res);
//         },
//         fail: function(err) {
//           Tips.hideLoading()
//           Tips.showToast('请求失败', 1000);
//           throw err;
//         }
//       })
//     })
//   }
}


export {
	Tips
  // Request
}