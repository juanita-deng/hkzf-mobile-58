import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import House from './House'; //找房
import Index from './Index/index.js'; //首页
import News from './News'; //资讯
import Profile from './Profile'; //我的
import './index.scss'; //导入链接的样式
import NotFound from '../NotFound';

class Home extends React.Component {
	render() {
		return (
			<div className="home">
				<Switch>
					{/* 配置嵌套路由 */}
					<Route path="/home" exact component={Index}></Route>
					<Route path="/home/house" component={House}></Route>
					<Route path="/home/news" component={News}></Route>
					<Route path="/home/profile" component={Profile}></Route>
					<Route component={NotFound}></Route>
				</Switch>
				{/* 配置导航连接 */}
				<ul className="navBar">
					<li>
						<NavLink to="/home" exact>
							<span className="iconfont icon-ind"></span>
							<p>首页</p>
						</NavLink>
					</li>
					<li>
						<NavLink to="/home/house">
							<span className="iconfont icon-findHouse"></span>
							<p>找房</p>
						</NavLink>
					</li>
					<li>
						<NavLink to="/home/news">
							<span className="iconfont icon-infom"></span>
							<p>资讯</p>
						</NavLink>
					</li>
					<li>
						<NavLink to="/home/profile">
							<span className="iconfont icon-my"></span>
							<p>我的</p>
						</NavLink>
					</li>
				</ul>
			</div>
		);
	}
}
export default Home;
