import { Service, GetOpenId } from './request';
import { baseUrl, otherBaseUrl } from './env';
import { Storage } from './util';
const BASE_PARAMS = {
  operation: 'post',
  tableName: 'lambda-apigateway',
}
let service = new Service();
// 获取微信openid
function getOpenId(data) {
  return service.request({
    dataObj: {
      url: '/dev/userTopicStatusHandler',
      method: 'POST',
      data: data,
    }
  });
}

// 获取结果页数据
function getResultData() {
  return service.request({
    dataObj: {
      url: '/dev/getUserTopicFinishResultHandler',
      method: 'POST',
      data: JSON.stringify({ ...BASE_PARAMS, payload: { openId: Storage.getStorageSync('OpenId') } })
    }
  });
}

// 上传图片
function uploadImg(imageType, base64String) {
  return service.request({
    dataObj: {
      url: '/dev/imageUploadByOptTypeHandler',
      method: 'POST',
      data: JSON.stringify({ ...BASE_PARAMS, payload: { openId: Storage.getStorageSync('OpenId'), imageType, base64String } })
    }
  });
}

function getAllQuestions() {
  return service.request({
    dataObj: {
      url: '/dev/newTopicHandler',
      method: 'POST',
      data: JSON.stringify({ ...BASE_PARAMS, payload: { openId: Storage.getStorageSync('OpenId') } })
    }
  });
}

function updateProgress(data) {
  return service.request({
    dataObj: {
      url: '/dev/updateUserTopicHandler',
      method: 'POST',
      data: JSON.stringify({ ...BASE_PARAMS, payload: { ...BASE_PARAMS.payload, openId: Storage.getStorageSync('OpenId'), subjectList: data } })
    }, showLoading: false
  });
}

function getCurrentQuestions() {
  return service.request({
    dataObj: {
      url: '/dev/getUserTopicHandler ',
      method: 'POST',
      data: JSON.stringify({ ...BASE_PARAMS, payload: { openId: Storage.getStorageSync('OpenId') } })
    }
  });
}


// 接口
function updateUserInfo(data) {
  let params = {
    ...BASE_PARAMS
  }
  params.payload = {
    openId: Storage.getStorageSync('OpenId'),
    ...data
  }
  return service.request({
    dataObj: {
      url: '/dev/updateUserInfoHandler',
      method: 'POST',
      data: JSON.stringify(params)
    }
  })
}

function AddDataRequireUserInfo(data) {
  let params = {
    ...data,
    openId: Storage.getStorageSync('OpenId'),
    phoneNumber: '',
    miniProgramNum: 1,
  }
  return service.request({
    dataObj: {
      url: '/AddDataRequireUserInfo',
      method: 'POST',
      data: JSON.stringify(params)
    },
    otherBaseUrl: otherBaseUrl
  })
}

function getUserInfo() {
  return service.request({
    dataObj: {
      url: '/dev/getUserInfoHandler',
      method: 'POST',
      data: JSON.stringify({ ...BASE_PARAMS, payload: { openId: Storage.getStorageSync('OpenId') } })
    }
  })
}

export {
  getOpenId,
  getResultData,
  uploadImg,
  getAllQuestions,
  updateProgress,
  getCurrentQuestions,
  updateUserInfo,
  getUserInfo,
  AddDataRequireUserInfo
};
