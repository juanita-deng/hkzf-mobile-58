//统一设置token的配置
const TOKEN_NAME = 'hkzf_token';

/**
 * 设置token
 * @param {string} token 从本地存储中添加token
 *  */

export function setToken(token) {
	localStorage.setItem(TOKEN_NAME, token);
}

/**
 * 获取token
 * @return {json} 从本地中获取token
 *  */

export function getToken(token) {
	localStorage.getItem(TOKEN_NAME);
}

/**
 * 移除token
 *  */

export function removeToken(token) {
	localStorage.removeItem(TOKEN_NAME);
}

/**
 * 判断是否有token
 * @return {boolean}返回一个布尔值
 *  */

export function hasToken() {
	return !!getToken();
}
