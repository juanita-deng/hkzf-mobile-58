import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Modal, Toast } from 'antd-mobile';
import { BASE_URL } from 'utils/config';
import styles from './index.module.scss';
import { hasToken, getToken, removeToken } from 'utils/token';
import http from 'utils/Http';
// 菜单数据
const menus = [
	{ id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
	{ id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
	{ id: 3, name: '看房记录', iconfont: 'icon-record' },
	{
		id: 4,
		name: '成为房主',
		iconfont: 'icon-identity',
	},
	{ id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
	{ id: 6, name: '联系我们', iconfont: 'icon-cust' },
];

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png';

export default class My extends Component {
	state = {
		isLogin: hasToken(),
		userInfo: {},
	};
	componentDidMount() {
		if (this.state.isLogin) {
			//已登录,发送请求,获取个人信息
			this.getUserInfo();
		}
		//未登录,渲染未登录信息
	}
	async getUserInfo() {
		const { status, body } = await http.get('/user');
		if (status === 200) {
			this.setState({
				userInfo: body,
			});
		} else {
			this.setState({
				isLogin: false,
			});
		}
		// console.log(this.state.userInfo);
	}
	render() {
		const { history } = this.props;
		const { isLogin, userInfo } = this.state;
		return (
			<div className={styles.my}>
				{/* 个人信息 */}
				<div className="title">
					<img
						className="bg"
						src={BASE_URL + '/img/profile/bg.png'}
						alt="背景图"
					/>
					<div className="info">
						<div className="myIcon">
							<img
								className="avatar"
								src={isLogin ? BASE_URL + userInfo.avatar : DEFAULT_AVATAR}
								alt="icon"
							/>
						</div>
						<div className="user">
							<div className="name">{isLogin ? userInfo.nickname : '游客'}</div>
							{isLogin ? (
								//登录后展示：
								<>
									<div className="auth">
										<span onClick={this.logout}>退出</span>
									</div>
									<div className="edit">
										编辑个人资料
										<span className="arrow">
											<i className="iconfont icon-arrow" />
										</span>
									</div>
								</>
							) : (
								//未登录显示
								<div className="edit">
									<Button
										type="primary"
										size="small"
										inline
										onClick={() => history.push('/login')}
									>
										去登录
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* 九宫格菜单 */}
				<Grid
					data={menus}
					columnNum={3}
					hasLine={false}
					renderItem={(item) =>
						item.to ? (
							<Link to={item.to}>
								<div className="menuItem">
									<i className={`iconfont ${item.iconfont}`} />
									<span>{item.name}</span>
								</div>
							</Link>
						) : (
							<div className="menuItem">
								<i className={`iconfont ${item.iconfont}`} />
								<span>{item.name}</span>
							</div>
						)
					}
				/>

				{/* 加入我们 */}
				<div className="ad">
					<img src={BASE_URL + '/img/profile/join.png'} alt="" />
				</div>
			</div>
		);
	}
	//退出
	logout = () => {
		Modal.alert('温馨提示', '确定要退出吗?', [
			{ text: '取消' },
			{
				text: '确定',
				onPress: async () => {
					//发送请求,并删除token,修改登陆状态
					const { status } = await http.post('/user/logout', null, {
						headers: {
							authorization: getToken(),
						},
					});
					if (status === 200) {
						removeToken();
						this.setState({
							isLogin: false,
							userInfo: {}, //清空用户状态
						});
						Toast.success('退出成功');
					}
				},
			},
		]);
	};
}
