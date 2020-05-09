const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
	app.use(
		//基础路径 localhost:3000/api/home/swiper
		//代理服务器:http://localhost:8080/api/home/swiper  去掉/api
		'/api', // 匹配到所有以 '/api'开头的请求
		createProxyMiddleware({
			target: 'http://localhost:8080',
			changeOrigin: true, //设置请求头里面的host属性
			pathRewrite: { '^/api': '' }, //路径重写 如果你不想始终传递 /api ，则需要重写路径：  webpack.devsever.proxy配置
			secure: true, //也能代理https开头的服务器  webpack.devsever.proxy配置
		})
	);
};
