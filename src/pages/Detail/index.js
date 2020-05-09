import React from 'react';
import styles from './index.module.scss';
import http from 'utils/Http';
import NavHeader from 'common/NavHeader';
import { Carousel, Flex, Modal } from 'antd-mobile'; //导入轮播图组件
import { BASE_URL } from 'utils/config';
import classNames from 'classnames';
import HousePackage from 'common/HousePackage'; //配套信息组件
import HouseItem from 'common/HouseItem';
import { hasToken } from 'utils/token';

const BMap = window.BMap;
// 猜你喜欢(写死的假数据)
const recommendHouses = [
	{
		id: 1,
		houseImg: '/img/news/1.png',
		desc: '72.32㎡/南 北/低楼层',
		title: '安贞西里 3室1厅',
		price: 4500,
		tags: ['随时看房'],
	},
	{
		id: 2,
		houseImg: '/img/news/2.png',
		desc: '83㎡/南/高楼层',
		title: '天居园 2室1厅',
		price: 7200,
		tags: ['近地铁'],
	},
	{
		id: 3,
		houseImg: '/img/news/3.png',
		desc: '52㎡/西南/低楼层',
		title: '角门甲4号院 1室1厅',
		price: 4300,
		tags: ['集中供暖'],
	},
];

export default class Detail extends React.Component {
	state = {
		info: {
			//房源信息
			community: '', //小区名称,提供默认值,解决children报错问题
			houseImg: '',
			oriented: [], //提供默认值,解决oriented.join报错问题
			tags: [], //同上
			coord: {
				latitude: '39.928033', //设置默认值
				longitude: '116.529466',
			},
			supporting: [], //房屋配套信息
		},
		isFavorite: false, //是否收藏
	};
	render() {
		const { community, supporting } = this.state.info;
		return (
			<div className={styles.detail}>
				{/* 头部导航条 */}
				<NavHeader
					className="navHeader"
					rightContent={[<i key="share" className="iconfont icon-share"></i>]}
				>
					{community}
				</NavHeader>
				{/* 轮播图 */}
				{this.renderSwiper()}
				{/* 房屋信息渲染 */}
				{this.renderInfo()}
				{/* 地图位置 */}
				<div className="map">
					<div className="mapTitle">
						小区：
						<span>{community}</span>
					</div>
					<div className="mapContainer" id="map">
						地图
					</div>
				</div>
				{/* 房屋配套信息 */}
				<div className="about">
					<div className="houseTitle">房屋配套</div>
					{supporting.length === 0 ? (
						<div className="titleEmpty">暂无数据</div>
					) : (
						<HousePackage list={supporting} />
					)}
				</div>
				{/* 房源概况 */}
				{this.renderDesc()}
				{/* 猜你喜欢 */}
				{this.renderLike()}
				{/* 底部收藏 */}
				{this.renderFooter()}
			</div>
		);
	}
	async componentDidMount() {
		const id = this.props.match.params.id;
		//判断是否登陆了
		if (hasToken()) {
			//登陆了发送请求
			const { status, body } = await http.get(`/user/favorites/${id}`);
			if (status === 200) {
				this.setState({
					isFavorite: body.isFavorite,
				});
			}
			//没登陆渲染对应的文本信息
		}
		//发送请求获取房屋信息
		const res = await http.get(`houses/${id}`);
		const { status, body } = res;
		if (status === 200) {
			this.setState({
				info: body,
			});
		}
		// console.log(this.state.info);
		//渲染地图
		const { community, coord } = res.body;
		this.renderMap(community, coord);
	}
	//渲染轮播图
	renderSwiper = () => {
		const { houseImg } = this.state.info;
		if (!houseImg) {
			return null;
		}
		return (
			<Carousel infinite autoplay className="slider">
				{houseImg.map((v) => (
					<a
						key={v}
						href="http://www.alipay.com"
						style={{
							display: 'inline-block',
							width: '100%',
							height: this.state.imgHeight,
						}}
					>
						<img
							// src={`${BASE_URL}${v}`}
							src={BASE_URL + v}
							alt=""
							style={{ width: '100%', verticalAlign: 'top' }}
							onLoad={() => {
								window.dispatchEvent(new Event('resize'));
								this.setState({ houseImg: 'auto' });
							}}
						/>
					</a>
				))}
			</Carousel>
		);
	};
	//房屋信息渲染
	renderInfo() {
		const {
			title,
			tags,
			price,
			roomType,
			size,
			floor,
			oriented,
		} = this.state.info;
		return (
			<div className="info">
				<h3 className="infoTitle">{title}</h3>
				<Flex className="tags">
					<Flex.Item>{this.renderTags(tags)}</Flex.Item>
				</Flex>

				<Flex className="infoPrice">
					<Flex.Item className="infoPriceItem">
						<div>
							{price}
							<span className="month">/月</span>
						</div>
						<div>租金</div>
					</Flex.Item>
					<Flex.Item className="infoPriceItem">
						<div>{roomType}</div>
						<div>房型</div>
					</Flex.Item>
					<Flex.Item className="infoPriceItem">
						<div>{size}平米</div>
						<div>面积</div>
					</Flex.Item>
				</Flex>

				<Flex className="infoBasic" align="start">
					<Flex.Item>
						<div>
							<span className="title">装修：</span>
							精装
						</div>
						<div>
							<span className="title">楼层：</span>
							{floor}
						</div>
					</Flex.Item>
					<Flex.Item>
						<div>
							<span className="title">朝向：</span>
							{oriented.join('、')}
						</div>
						<div>
							<span className="title">类型：</span>普通住宅
						</div>
					</Flex.Item>
				</Flex>
			</div>
		);
	}
	//标签渲染处理
	renderTags(tags) {
		// 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
		return tags.map((v, index) => {
			return (
				<span key={v} className={classNames(`tag tag${(index % 3) + 1}`)}>
					{v}
				</span>
			);
		});
	}
	//地图渲染
	renderMap(community, coord) {
		const { longitude, latitude } = coord;
		const map = new BMap.Map('map');
		const point = new BMap.Point(longitude, latitude);
		map.centerAndZoom(point, 17);
		// 创建文本标注对象
		const label = new BMap.Label(
			`<span>${community}</span>
      <div class="mapArrow"></div>`,
			{
				position: point,
				offset: new BMap.Size(0, -36),
			}
		);
		label.setStyle({
			position: 'absolute',
			zIndex: -1,
			backgroundColor: 'rgb(238, 93, 91)',
			color: 'rgb(255, 255, 255)',
			height: 25,
			padding: '5px 10px',
			lineHeight: '14px',
			borderRadius: 3,
			boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
			whiteSpace: 'nowrap',
			fontSize: 12,
			userSelect: 'none',
		});
		//添加文字标签
		map.addOverlay(label);
	}
	//房源概述
	renderDesc() {
		const { description } = this.state.info;
		return (
			<div className="set">
				<div className="houseTitle">房源概况</div>
				<div>
					<div className="contact">
						<div className="user">
							<img src={BASE_URL + '/img/avatar.png'} alt="头像" />
							<div className="useInfo">
								<div>王女士</div>
								<div className="userAuth">
									<i className="iconfont icon-auth" />
									已认证房主
								</div>
							</div>
						</div>
						<span className="userMsg">发消息</span>
					</div>

					<div className="descText">{description || '暂无房屋描述'}</div>
				</div>
			</div>
		);
	}
	//猜你喜欢
	renderLike() {
		return (
			<div className="recommend">
				<div className="houseTitle">猜你喜欢</div>
				<div className="items">
					{recommendHouses.map((v) => (
						<HouseItem v={v} key={v.id} />
					))}
				</div>
			</div>
		);
	}
	//底部收藏
	renderFooter() {
		const { isFavorite } = this.state;
		return (
			<Flex className="fixedBottom">
				<Flex.Item onClick={this.handleFavorite}>
					<img
						src={
							isFavorite
								? BASE_URL + '/img/star.png'
								: BASE_URL + '/img/unstar.png'
						}
						className="favoriteImg"
						alt="收藏"
					/>
					<span className="favorite">{isFavorite ? '收藏' : '未收藏'}</span>
				</Flex.Item>
				<Flex.Item>在线咨询</Flex.Item>
				<Flex.Item>
					<a href="tel:400-618-4000" className="telephone">
						电话预约
					</a>
				</Flex.Item>
			</Flex>
		);
	}
	//收藏功能
	handleFavorite = async () => {
		const id = this.props.match.params.id;
		if (hasToken()) {
			//登陆了判断是否收藏了
			if (this.state.isFavorite) {
				//收藏了,发送请求删除收藏
				await http.delete('/user/favorites/' + id);
				this.setState({
					isFavorite: false,
				});
			} else {
				//没收藏,发送请求添加收藏
				await http.post('/user/favorites/' + id);
				this.setState({
					isFavorite: true,
				});
			}
		} else {
			//没登陆
			Modal.alert('温馨提示', '登陆才能收藏,是否要去登陆?', [
				{ text: '取消' },
				{
					text: '确定',
					onPress: () => {
						this.props.history.push('/login');
					},
				},
			]);
		}
	};
}
