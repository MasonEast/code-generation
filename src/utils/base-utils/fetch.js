import Qs from 'qs';

function handleGetParams(url, options){
    //GET方法：查询字符附在url后面;
    if(options.body){
        let searchStr = '';
        if(options.body instanceof Object) {
            for(let i in options.body) {
                searchStr += ( i + '=' + options.body[i] + '&' );
            }
        }
        url = (url + '?' + searchStr).slice(0,-1);
        delete options.body;
    }
    return [url,options]
}

//初始化Fetch
function initFetch(url, options){
    const defaultOptions = {
        credentials: 'include'    //包含cookie
    };
    const newOptions = { ...defaultOptions, ...options };

    let fetchParams = null;
    if(!newOptions.method) newOptions.method = 'get';
    if(newOptions.method.toLowerCase() == 'get' && newOptions.body){
        fetchParams = handleGetParams(url, newOptions)
    }else{
        fetchParams = [url,newOptions]
    }

    return fetch(...fetchParams).then( res => {
        return res.json();
    }).catch(
        ex => {console.log('parsing failed', ex)}
    )
}

//原始fetch
function Fetch(url, options){
    return initFetch(url, options)
}

//扩展get请求
/**
 * @param {string} url            The URL we want to request
 * @param {object} options        The options we want to pass to "fetch"
 */
Fetch.get = function(url, options){
    const init = {
        method: 'GET'
    }
    const _options = { ...options, ...init };  //保证只能是GET请求
    const paramsArr = handleGetParams(url, _options);
    return initFetch(paramsArr[0], paramsArr[1])
}

//扩展post请求
/**
 * @param {string} url            The URL we want to request
 * @param {object} options        The options we want to pass to "fetch"
 * @param {string} paramsType     请求参数格式类型 "json" or "formData"
 */
Fetch.post = function(url, options, paramsType){
    const init = {
        method: 'POST',
    }
    const _options = { ...options, ...init };       //保证只能是POST请求
    if(!_options.body) _options['body'] = null;     //body未配置，则设置未空对象

    if(_options.body instanceof Object){
        switch(paramsType){
            case 'json':
                _options['body'] = JSON.stringify(_options.body);
                _options['headers'] = {
                    'Content-Type': 'application/json; charset=UTF-8',
                    ..._options.headers
                }
                break;
            case 'formData':
                _options['body'] = Qs.stringify(_options.body);
                _options['headers'] = {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    ..._options.headers
                }
                break;
            // case 'file':
            //   _options['headers'] = {
            //     'Content-Type': 'multipart/form-data',
            //     ..._options.headers
            //   }
            // break;
            default:
                _options['body'] = _options.body;
        }
    }
    return initFetch(url, _options)
}

export default Fetch;