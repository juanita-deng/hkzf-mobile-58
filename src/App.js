import React from 'react';
//导入路由信息
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
//导入组件
import Home from './pages/Home'; //导入首页组件
import City from './pages/City'; //导入城市选择组件
import Map from './pages/Map'; //导入地图找房组件

class App extends React.Component {
	render() {
		return (
			<Router>
				<div className="app">
					{/* 链接 */}
					<NavLink to="/home">首页</NavLink>
					<NavLink to="/city">城市选择</NavLink>
					<NavLink to="/map">地图找房</NavLink>
					{/* 路由信息 */}
					<Route path="/home" component={Home}></Route>
					<Route path="/city" component={City}></Route>
					<Route path="/map" component={Map}></Route>
				</div>
			</Router>
		);
	}
}
export default App;
