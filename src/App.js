import React from 'react';
//导入路由信息
import {
	HashRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
// import { hasToken } from 'utils/token';
import PrivateRoute from 'common/PrivateRoute';

//导入组件
import Home from './pages/Home'; //导入首页组件
import City from './pages/City'; //导入城市选择组件
import Map from './pages/Map'; //导入地图找房组件
import NotFound from './pages/NotFound'; //导入404页面
import Detail from './pages/Detail'; //导入文章详情页
import Login from './pages/Login';
import Rent from 'pages/Rent';

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
						{/* 此种方式的Route天生就带props,而renderprops方式的需要手动加上 */}
						<Route path="/login" component={Login}></Route>
						{/* 
							Route知识点:
								 path:用于控制路由匹配的路径
								 component:控制匹配时渲染的组件
								 render:路由匹配时匹配的内容也可以有render来提供
						*/}
						{/* render方式虽然也能拦截页面,但是单一页面还行,如果需要拦截的页面比较多,就麻烦了 */}
						{/* 注意:使用renderprops方式渲染路由信息,要传props,否则渲染的组件会访问不到props */}
						{/* 解决:封装一个类似vue中导航守卫的页面拦截PriveteRoute */}
						{/* <Route
							path="/rent"
							render={(props) =>
								hasToken() ? (
									<Rent {...props}></Rent>
								) : (
									<Redirect to="/login"></Redirect>
								)
							}
						></Route> */}
						<PrivateRoute path="/rent" component={Rent}></PrivateRoute>
						<Route component={NotFound}></Route>
					</Switch>
				</div>
			</Router>
		);
	}
}
export default App;
