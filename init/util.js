class Tips {
	constructor() {
	  console.log('this is the tips')
		this.isLoading = false;
	}
	
	static showToast() {
		wx.showToast({
			title: '干杯',
			mask: false,
			icon: 'success'
		})
	}
	
	static showModal() {
		wx.showModal({
			title: 'this is the modal',
			content: 'why',
			comfirm: 'sure'
		})
	}
	
	static showLoading() {
		if (!this.isLoading) {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
			this.isLoading = true;
		}
	}
	
	static hideLoading() {
		if (this.isLoading) {
			wx.hideLoading()
			this.isLoading = false;
		}
	}
	
	static showNavBarL() {
		wx.showNavigationBarLoading()
	}
}



export {
	Tips
}