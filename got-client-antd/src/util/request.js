
import {message} from 'antd';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
  
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  
  const encode = (value) => {
    return encodeURIComponent(value)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/gi, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/gi, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
  };


  /**
   * Requests a URL, returning a promise.
   *
   * @param  {string} url       The URL we want to request
   * @param  {object} [options] The options we want to pass to "fetch"
   * @return {object}           An object containing either "data" or "err"
   */
  export async function request(url, options) {
    return innerRequest(url, options, objectToFormArr);
  }

  export async function jsonRequest(url, options) {
    const result =  innerRequest(url, options, objectToJsonFormArr);
    return result.then((result)=> {
      if (result.errorMsg) {
        // message.error(result.errorMsg, 10);
      }
      if (result.data.redirectUrl) {
        window.location.href = result.data.redirectUrl;
      }
      return result;
    }).catch((error) => {
      console.info('error', error);
      if (error.response.status == 302) {
        window.location.href = error.response.headers.get('Location');
      } else {
        if (error.message) {
          // message.error(error.message, 10);
        }
      }
      throw error;
    })
  }

  export function getSimulateUserId(queryString) {
    if (queryString) {
      const questionMarkIndex = queryString.indexOf('?');
      if (questionMarkIndex >= 0) {
        const params = queryString.substr(questionMarkIndex + 1).split('&');
        let su = null;
        params.filter(str=>str).map(str=> {
          const nv = str.split('=');
          if (nv.length > 0 && nv[0] == 'su') {
            su = nv[1];
          }
        })
        return su;
      }
    }
    return null;
  }

  /**
   * Requests a URL, returning a promise.
   *
   * @param  {string} url       The URL we want to request
   * @param  {object} [options] The options we want to pass to "fetch"
   * @return {object}           An object containing either "data" or "err"
   */
  async function innerRequest(url, options, formDataProcess) {
    const queryString = location.search;
    const su = getSimulateUserId(queryString);
    if (su) {
      if (url.indexOf('?') < 0) {
        url = url + '?su=' + su;
      } else {
        url = url + '&su=' + su;
      }
    }
    // console.info('queryString', su);
    let localOptions = {...options};
    if (!localOptions.method) {
      localOptions.method = 'POST';
    }
    if (localOptions.method === 'POST') {
      if (!localOptions.headers) {
        localOptions.headers = {}; 
      }
      // add post content-type
      if (!localOptions.headers['Content-Type']) {
        localOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      if (!localOptions.headers['X-Requested-With']) {
        localOptions.headers['X-Requested-With'] = 'XMLHttpRequest';
      }
      if (typeof localOptions.body != 'string') {
        // convert to post string style
        const postData = formDataProcess(localOptions.body, [], null);
        localOptions.body = postData.join('&');
      }
    }
    localOptions.credentials = 'include';

    const response = await fetch(url, localOptions);
    checkStatus(response);

    const data = await response.json();
    const ret = {
      data,
      headers:{},
    };
/*
    if (response.headers.get('x-total-count')) {
      ret.headers['x-total-count'] = response.headers.get('x-total-count');
    }
*/
    return ret;
  };

  
function objectToJsonFormArr (obj, form, namespace) {
  const fd = form || [];
  let formKey;
  if (Array.isArray(obj)) {
    obj.map((ae, index)=> objectToJsonFormArr(ae, fd, (namespace?namespace:'') + '[' + index + ']'));
  } else {
    for(var property in obj) {
      if(obj.hasOwnProperty(property)) {
        let key = property;
        let value = obj[property];
        if (typeof value == 'object') {
          value = JSON.stringify(value);
        } else {
          value = String(value);
        }
        value = value.replace(/%/g, "%25").replace(/\&/g, "%26").replace(/\+/g, "%2B").replace(/\=/g, "%3D");
        // if it's a string or a File object
        fd.push(key + "=" +value);
      }
    }
  }
  return fd;
};
  
function objectToFormArr (obj, form, namespace) {
  const fd = form || [];
  let formKey;
  if (Array.isArray(obj)) {
    obj.map((ae, index)=> objectToFormArr(ae, fd, (namespace?namespace:'') + '[' + index + ']'));
  } else {
  for(var property in obj) {
      if(obj.hasOwnProperty(property)) {
        let key = Array.isArray(obj) ? '[]' : `[${property}]`;
        if(namespace) {
          formKey = namespace + key;
        } else {
          formKey = property;
        }
      
        // if the property is an object, but not a File, use recursivity.
        if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
          objectToFormArr(obj[property], fd, formKey);
        } else {
          // if it's a string or a File object
          fd.push(formKey + "=" + new String(obj[property]).replace(/%/g, "%25").replace(/\&/g, "%26").replace(/\+/g, "%2B").replace(/\=/g, "%3D"));
        }
        
      }
    }
  }
  return fd;
};


  export function objectToFormData (obj, form, namespace) {
    const fd = form || [];
    let formKey;
    
    for(var property in obj) {
        if(obj.hasOwnProperty(property)) {
          let key = Array.isArray(obj) ? '[]' : `[${property}]`;
          if(namespace) {
            formKey = namespace + key;
          } else {
            formKey = property;
          }
        
          // if the property is an object, but not a File, use recursivity.
          if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
            objectToFormData(obj[property], fd, formKey);
          } else {
            
            // if it's a string or a File object
            fd.push(formKey + "=" + obj[property]);
          }
          
        }
      }
    
    return fd;
      
  };
