import axios from 'axios';
import { BASE_URL } from './config';
import { getToken, removeToken } from 'utils/token';

//写法一:将全局的axios的路径进行修改,会影响其他页面
// axios.defaults.baseURL = BASE_URL

//写法二:
// http是axios创建出来的一个实例,他拥有和axios一样的功能
// 好处:以免影响到全局的axios

const http = axios.create({
	baseURL: BASE_URL,
});

//配置请求拦截器,统一处理token
http.interceptors.request.use((config) => {
	// console.log(config);
	if (
		config.url.startsWith('/user') &&
		config.url !== '/user/login' &&
		config.url !== '/user/registered'
	) {
		//所有以/user开头,除去注册和登录页外,都要加token(可以拦截出租页)
		config.headers = {
			authorization: getToken(),
		};
		//则可以去掉登录页和注册页请求时发的token
	}
	return config;
});

//继续对http进行优化
//配置响应拦截器.直接把res.data进行返回
//统一判断token--->防止token过期/假token
http.interceptors.response.use((res) => {
	// console.log(res);
	if (res.data.status === 400 && res.data.description === 'token异常或者过期') {
		removeToken(); //如果token过期删除无效的token
	}
	return res.data;
});

export default http;
