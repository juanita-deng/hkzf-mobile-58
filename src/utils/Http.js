import axios from 'axios';
import { BASE_URL } from './config';
//写法一:将全局的axios的路径进行修改,会影响其他页面
// axios.defaults.baseURL = BASE_URL

//写法二:
// http是axios创建出来的一个实例,他拥有和axios一样的功能
// 好处:以免影响到全局的axios

const http = axios.create({
	baseURL: BASE_URL,
});

//继续对http进行优化
//配置响应拦截器.直接把res.data进行返回
http.interceptors.response.use((res) => res.data);

export default http;
