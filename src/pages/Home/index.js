import React from 'react';
import { Route, Switch } from 'react-router-dom';
import House from './House'; //找房
import Index from './Index/index.js'; //首页
import News from './News'; //资讯
import My from './My'; //我的
import './index.scss'; //导入链接的样式
import NotFound from '../NotFound';

//方式二:使用tabBar组件实现嵌套路由
import { TabBar } from 'antd-mobile';

//TabBar组件封装 这样更容易维护
const tabs = [
	{ title: '首页', path: '/home', icon: 'icon-ind' },
	{ title: '找房', path: '/home/house', icon: 'icon-findHouse' },
	{ title: '资讯', path: '/home/news', icon: 'icon-infom' },
	{ title: '我的', path: '/home/my', icon: 'icon-my' },
];

class Home extends React.Component {
	constructor(props) {
		super(props);
		/* 
			selectTab:用于控制默认选中的tab栏
			fullScree:用于控制tabBar是否需要全屏
      hidden:用于控制tab栏的显示和隐藏
			
		*/
		this.state = {
			selectedTab: this.props.location.pathname, //不能写死,这个值应该动态获取(写死的话,一刷新会高亮不对应)
		};
		// console.log(this.props);
	}
	//解决其他页面刷新才能获取对应的tab高亮问题
	componentDidUpdate(prevProps) {
		//state一改变就会触发
		// 不能直接在更新的钩子函数中调用setState,否则死递归
		// console.log(prevProps);
		// console.log(this.props);
		//如果上次(prevProps)和本次的路径不一样就去更新

		if (prevProps.location.pathname !== this.props.location.pathname) {
			this.setState({
				selectedTab: this.props.location.pathname,
			});
		}
	}

	render() {
		return (
			<div className="home">
				<Switch>
					{/* 配置嵌套路由 */}
					<Route path="/home" exact component={Index}></Route>
					<Route path="/home/house" component={House}></Route>
					<Route path="/home/news" component={News}></Route>
					<Route path="/home/my" component={My}></Route>
					<Route component={NotFound}></Route>
				</Switch>
				{/* 配置导航连接--使用antd-mobile的tabBar组件 */}
				<div className="navBar">
					{/* 
						TabBar组件
						unselectedTintColor:没有选中的文字的颜色
						tintColor:选中文字的颜色
      			barTintColor:整体TabBar的背景色
      			hidden:用于控制tab栏的显示和隐藏
					*/}

					<TabBar
						unselectedTintColor="#949494"
						tintColor="rgb(33, 185, 122)"
						barTintColor="white"
					>
						{/* 
				 TabBar.item:配置一个tab选项
         title:选项显示的文字
         key:唯一,和title一致就行
         icon:控制选项的图标
         selectedIcon:选中的图标
         selected:控制当前tabBar是否选中
         badge:字体图标旁的角标(可删)
         onPress:点击事件
						
						*/}
						{tabs.map((v) => (
							<TabBar.Item
								title={v.title}
								key={v.title}
								//控制选项的图标
								icon={<span className={`iconfont + ${v.icon}`}></span>}
								//选中的图标,注意:字符串拼接要留空
								selectedIcon={<span className={'iconfont ' + v.icon}></span>}
								selected={this.state.selectedTab === v.path}
								onPress={() => {
									//上面再数据更新的钩子函数已统一解决
									// this.setState({
									// 	selectedTab: v.path,
									// });
									//路由跳转
									this.props.history.push(v.path);
								}}
								data-seed="logId"
							></TabBar.Item>
						))}
					</TabBar>
				</div>
			</div>
		);
	}
}
export default Home;
