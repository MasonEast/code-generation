/**
 * 设置cookie
 * @param {string | array} name cookie名称 | cookie名称数组对象，对象内属性与当前一致
 * @param {string} value cookie值
 * @param {object} options 设置cookie的一些参数
 */
function setCookie(name, value, options) {
  const argLen = arguments.length;

  const createCookieOpts = (opt) => {
    const { expires, path, domain, secure } = opt;
    let optsStr = '';
    optsStr += `path=${path || '/'};`;
    if(expires){ optsStr += `expires=${new Date(expires).toUTCString()};`};
    if(domain){ optsStr += `domain=${domain};`};
    if(secure){ optsStr += `secure=${secure};`};
    return optsStr;
  }
  
  const setOne = (_name, _value, _options) => {         // 设置一个cookie
    if(typeof _name === 'string'){
      const _optStr = createCookieOpts(_options);
      document.cookie = `${_name}=${encodeURIComponent(_value)};${_optStr}`;
    }else{
      throw Error(`'name' is required and must be 'string' type!`);
    }
  }
  if(argLen === 1 && (name instanceof Array)){          // 如果只有一个参数且是数组，就便利生成多个cookie字符串
    if(name.length){
      name.map((_name,i)=>{
        const {name, value, options} = _name;
        setOne(name, value, options);
      })
    }
  }else{
    setOne(name, value, options);
  }
}

/**
 * @description 获取cookie
 * @param {string | array | null } name cookie名称，或名称数组，或无参数（获取所有cookie）
 * @return {string | object} 传入string->string：对应cookie值, array | null -> object: 即cookie键值对 
 */
function getCookie(name){
  const ca = document.cookie.split(';');
  const getOne = (_name) => {             // 获取一个cookie
    let one = '';
    ca.map((item,i)=>{
      const _item = item.trim();
      if (_item.indexOf(_name) == 0) { 
        one =  _item.substring(_name.length, _item.length); 
      }
    });
    return decodeURIComponent(one);
  }
  if(typeof name === 'string'){         // 返回单个cookie字符串
    const _name = name + "=";
    return getOne(_name);
  }else if(name instanceof Array){      // 返回对应数组内cookie键值对
    if(name.length){
      let Cobj = {};
      name.map((n,i)=>{
        const _n = n + "=";
        Cobj[n] = getOne(_n);
      })
      return Cobj;
    }
  }else if(!name){                      // 返回所有cookie键值对
    let Cobj = {};
    ca.map((item,i)=>{
      const arr = item.trim().split("=");
      Cobj[arr[0]] = arr[1];
    })
    return Cobj;
  }
  return "";
}
/**
 * 删除cookie
 * @param {string | array} name cookie名称
 */
function deleteCookie(name,options) {     // 设置当前时间（毫秒），就是告诉系统cookie在当前时间过期，系统就会立刻去删除cookie
  const now = new Date().getTime();
  if(typeof name === 'string'){
    setCookie(name, "", { ...options,expires: now });
  }else if(name instanceof Array){
    if(name.length){
      name.map((_name,i)=>{
        if(typeof _name === 'string'){
          setCookie(_name, "", { ..._name.options, expires: now })
        }else if(_name instanceof Object){
          if(_name.options && _name.options instanceof Object){
            setCookie( _name.name, "", Object.assign(_name.options, { expires: now }) );
          }
          if(_name.options && !(_name.options instanceof Object)){
            throw Error("options must be an Object!")
          }
          if(!_name.options){
            setCookie( _name.name, "", { expires: now } );
          }
        }else{
          throw Error('item in Array must be "string" or "object"! ')
        }
      })
    }
  }
};

export {
  setCookie,
  getCookie,
  deleteCookie
}