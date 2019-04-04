console.log('init is runing')
console.log('uni', uni);
console.log('wx', wx);

let baseUrl = ''
if(process.env.NODE_ENV === 'development'){
		baseUrl = 'https://192.168.2.247'
}else{
		baseUrl = 'https://mini-program.imaginelearning.cn'
}

let init = {
	baseUrl: baseUrl
};
export default init;


import {Tips} from "./util"
Tips.showNavBarL();