import {request,jsonRequest} from '../util/request';
import {message} from 'antd';
import router from 'umi/router';

message.config({
  duration: 2,
  maxCount: 3,
});

export function loadLayout({fwCoord, fwParam}) {
  return fwRequest(`/fw/getMetaData`, {
    method: 'POST',
    body: {'fwCoord':fwCoord, 'fwParam':{...fwParam,queryType:'full'}},
  });
}

export function changePassword(args) {
  return fwRequest(`/fw/changePassword`, {
      method: 'POST',
      body: args,
  });
}
export default function fwRequest(url, options) {
  const result = request(url, options);
  return result.then((result)=> {
    if (result.data && result.data.redirectUrl) {
      window.location.href = result.data.redirectUrl;
    }
    return result;
  }).catch((error) => {
    console.info('error', error);
    if (error.response.status == 302) {
      window.location.href = error.response.headers.get('Location');
    } else {
      if (error.message) {
        message.error(error.message, 10);
      }
    }
    throw error;
  })
}
