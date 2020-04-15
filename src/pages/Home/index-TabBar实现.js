import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import House from './House'; //找房
import Index from './Index/index.js'; //首页
import News from './News'; //资讯
import Profile from './Profile'; //我的
import './index.scss'; //导入链接的样式
import NotFound from '../NotFound';

//方式二:使用tabBar组件实现嵌套路由
import { TabBar } from 'antd-mobile';

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
		console.log(this.props);
	}

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
						<TabBar.Item
							title="首页"
							key="首页"
							//控制选项的图标
							icon={<span className="iconfont icon-ind"></span>}
							//选中的图标
							selectedIcon={<span className="iconfont icon-ind"></span>}
							selected={this.state.selectedTab === '/home'}
							onPress={() => {
								this.setState({
									selectedTab: '/home',
								});
								//路由跳转
								this.props.history.push('/home');
							}}
							data-seed="logId"
						></TabBar.Item>
						<TabBar.Item
							icon={<span className="iconfont icon-findHouse"></span>}
							selectedIcon={<span className="iconfont icon-findHouse"></span>}
							title="找房"
							key="找房"
							selected={this.state.selectedTab === '/home/house'}
							onPress={() => {
								this.setState({
									selectedTab: '/home/house',
								});
								//路由跳转
								this.props.history.push('/home/house');
							}}
							data-seed="logId1"
						></TabBar.Item>
						<TabBar.Item
							icon={<span className="iconfont icon-infom"></span>}
							selectedIcon={<span className="iconfont icon-infom"></span>}
							title="资讯"
							key="资讯"
							selected={this.state.selectedTab === '/home/news'}
							onPress={() => {
								this.setState({
									selectedTab: '/home/news',
								});
								//路由跳转
								this.props.history.push('/home/news');
							}}
						></TabBar.Item>
						<TabBar.Item
							icon={<span className="iconfont icon-my"></span>}
							selectedIcon={<span className="iconfont icon-my"></span>}
							title="我的"
							key="我的"
							selected={this.state.selectedTab === '/home/profile'}
							onPress={() => {
								this.setState({
									selectedTab: '/home/profile',
								});
								//路由跳转
								this.props.history.push('/home/profile');
							}}
						></TabBar.Item>
					</TabBar>
				</div>
			</div>
		);
	}
}
export default Home;
