/**
 * @param {string} name 参数名
 * @description 获取地址栏指定的参数名的值
 */
function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    };
    return null;
}


/**
 * @description: 生成随机数方法
 * @param {number} m : 随机数起始点
 * @param {number} n : 随机数终止点
 */
function randomNum (m, n) {
    return Math.floor(Math.random() * (m - n) + n)
}

export {
    getQueryString,
    randomNum
}