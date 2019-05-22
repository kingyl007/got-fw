import fwRequest from '../fwService';

export function requestValidCode(args) {
  return fwRequest(`/wx/requestValidCode`, {
    method: 'POST',
    body: args,
  });
}

export function bind(args) {
  return fwRequest(`/wx/bind`, {
    method: 'POST',
    body: args,
  });
}


export function getMemberInfo(args) {
  return fwRequest(`/wx/getMemberInfo`, {
    method: 'POST',
    body: args,
  });
}

export function unbind(args) {
  return fwRequest(`/wx/unbind`, {
    method: 'POST',
    body: args,
  });
}

export function setFence(args) {
  return fwRequest(`/wx/setFence`, {
    method: 'POST',
    body: args,
  });
}

// export function getJsapiConfigInfo(args) {
//   return fwRequest(`/wx/getJsapiConfigInfo`, {
//     method: 'POST',
//     body: args,
//   });
// }