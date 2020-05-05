import React from 'react';
//导入路由信息
import {
	HashRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
//导入组件
import Home from './pages/Home'; //导入首页组件
import City from './pages/City'; //导入城市选择组件
import Map from './pages/Map'; //导入地图找房组件
import NotFound from './pages/NotFound'; //导入404页面
import Detail from './pages/Detail'; //导入文章详情页
import Login from './pages/Login';

class App extends React.Component {
	render() {
		return (
			<Router>
				<div className="app">
					{/* 链接 */}
					{/* <NavLink to="/home">首页</NavLink>
					<NavLink to="/city">城市选择</NavLink>
					<NavLink to="/map">地图找房</NavLink> */}

					{/* 路由信息 */}
					<Switch>
						{/* 路由重定向 */}
						<Redirect from="/" exact to="/home"></Redirect>
						<Route path="/home" component={Home}></Route>
						<Route path="/city" component={City}></Route>
						<Route path="/map" component={Map}></Route>
						<Route path="/detail/:id" component={Detail}></Route>
						<Route path="/login" component={Login}></Route>
						<Route component={NotFound}></Route>
					</Switch>
				</div>
			</Router>
		);
	}
}
export default App;
