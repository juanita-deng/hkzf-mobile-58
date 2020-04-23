import React from 'react';
import axios from 'axios';
import { Carousel, Flex, Grid } from 'antd-mobile';
import './index.scss';
import { getCurrentCity } from 'utils/City'; //导入获取当前城市信息的工具函数
import { BASE_URL } from 'utils/config';

//导航图片-使用create-react-app绝对路径
import nav1 from 'assets/images/nav-1.png';
import nav2 from 'assets/images/nav-2.png';
import nav3 from 'assets/images/nav-3.png';
import nav4 from 'assets/images/nav-4.png';
//封装导航
const navList = [
	{ title: '整租', path: '/home/house', img: nav1 },
	{ title: '合租', path: '/home/house', img: nav2 },
	{ title: '地图找房', path: '/map', img: nav3 },
	{ title: '去出租', path: '/rent', img: nav4 },
];
//提供伪数组(数据没出来之前造假图片)
// const data = Array.from(new Array(4)).map((_val, i) => ({
// 	icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
// 	text: `name${i}`,
// }));

class Index extends React.Component {
	state = {
		//图片的地址
		data: [],
		//轮播图初始高度,因为图片初始没高度
		imgHeight: (212 / 375) * window.innerWidth,
		//租房小组
		GridList: [],
		//当前城市的信息
		city: {
			label: '北京', //城市名称(给默认值,避免闪跳)
			value: '', //城市的id,后台需要的参数
		},
		//资讯
		news: [],
	};
	async componentDidMount() {
		// 发送ajax请求获取轮播图数据
		this.SwiperList();
		// //获取小组信息
		// this.getGrid();
		// //获取最新资讯
		// this.getNews();

		// 根据百度地图获取到城市（ip定位)
		//直接使用封装的工具函数
		const currentCity = await getCurrentCity();
		this.setState(
			{
				city: currentCity,
			},
			() => {
				this.getGrid();
				this.getNews();
			}
		);

		//1.进入到首页,首先根据百度地图获取当前的城市.
		//BMap是全局变量,前面要加window
		// var myCity = new window.BMap.LocalCity();
		//参数:回调函数
		// myCity.get(async (result) => {
		// 	// console.log(result);//result.name即为当前城市信息
		// 	//2.获取到城市信息后,需要发送请求,去获取城市的详细信息
		// 	const res = await axios.get('http://localhost:8080/area/info', {
		// 		params: {
		// 			name: result.name,
		// 		},
		// 	});
		// 	// console.log(res);
		// 	const { status, body } = res.data;

		// 	// 将获取到的当前城市存到本地
		// 	localStorage.setItem('current_city', JSON.stringify(body));

		// 	if (status === 200) {
		// 		//需要保存城市label和value
		// 		this.setState(
		// 			{
		// 				city: body,
		// 			},
		// 			() => {
		// 				// 3.有了城市的id,我们才去发送请求获取小组数组和资讯
		// 				//获取小组信息
		// 				this.getGrid();
		// 				//获取最新资讯
		// 				this.getNews();
		// 			}
		// 		);
		// 	}
		// });
	}
	//发送ajax请求轮播图图片获取数据
	async SwiperList() {
		const res = await axios.get('http://localhost:8080/home/swiper');
		// console.log(res);
		const { status, body } = res.data;
		if (status === 200) {
			// this.state.data = body;//error
			this.setState({
				data: body,
			});
			// console.log(this.state.data);
		}
	}
	//发送Ajax请求获取租房小组的具体数据
	async getGrid() {
		const res = await axios.get('http://localhost:8080/home/groups', {
			// params: {
			// 	area: 'AREA|88cff55c-aaa4-e2e0', //参数:地区的id,后期需要根据百度定位后动态获取
			// },
			params: {
				area: this.state.city.value,
			},
		});
		// console.log(res);
		const { status, body } = res.data;
		if (status === 200) {
			this.setState({
				GridList: body,
			});
			// console.log(this.state.GridList);
		}
	}
	//发送ajax请求获取最新资讯的数据
	async getNews() {
		const res = await axios.get('http://localhost:8080/home/news', {
			// params: {
			// 	area: 'AREA|88cff55c-aaa4-e2e0', //先写死后期获取到定位城市后动态生成
			// },
			params: {
				area: this.state.city.value,
			},
		});
		// console.log(res);
		const { status, body } = res.data;
		if (status === 200) {
			this.setState({
				news: body,
			});
		}
		// console.log(this.state.news);
	}

	//导入轮播图组件并且渲染
	renderSwiper() {
		//有内容才渲染
		if (this.state.data.length === 0) {
			return null;
		}
		return (
			<Carousel
				//自动播放
				autoplay
				//无限滚动
				infinite
			>
				{this.state.data.map((val) => (
					<a
						key={val}
						href="http://www.alipay.com"
						style={{
							display: 'inline-block',
							width: '100%',
							height: this.state.imgHeight,
						}}
					>
						<img
							src={BASE_URL + val.imgSrc}
							alt={val.alt}
							style={{ width: '100%', verticalAlign: 'top' }}
							onLoad={() => {
								// fire window resize event to change height
								window.dispatchEvent(new Event('resize'));
								//当图片加载完成,动态的设置轮播图的高度(让其自适应)
								this.setState({ imgHeight: 'auto' });
							}}
						/>
					</a>
				))}
			</Carousel>
		);
	}
	//头部搜索
	renderSearch() {
		return (
			<Flex className="search-box">
				<Flex className="search-form">
					<div
						className="location"
						onClick={() => this.props.history.push('/city')}
					>
						<span className="name">{this.state.city.label}</span>
						<span className="iconfont icon-arrow"> </span>
					</div>
					<div className="search-input">
						<span className="iconfont icon-seach" />
						<span className="text">请输入小区地址</span>
					</div>
				</Flex>
				{/* 地图小图标 */}
				<span
					className="iconfont icon-map"
					onClick={() => this.props.history.push('/map')}
				/>
			</Flex>
		);
	}
	//导航结构渲染
	renderNav() {
		return (
			<Flex>
				{navList.map((v) => (
					<Flex.Item
						key={v.title}
						onClick={() => this.props.history.push(v.path)}
					>
						<img src={v.img} alt="" />
						<p>{v.title}</p>
					</Flex.Item>
				))}
			</Flex>
		);
	}
	//租房小组
	renderGroup() {
		return (
			<>
				<div className="title">
					<h3>租房小组</h3>
					<span className="more">更多</span>
				</div>
				<div className="grid">
					{/* 
							 data:具体数据,需要发送请求获取
         						=Array.from(new Array(9))快速创建一个伪数组
    					 columnNum:用于控制显示几列数据
    					 renderItem(el,index):自定义渲染的内容,el:遍历的当前元素,index:对应的下标
    					 square:	每个格子是否固定为正方形(默认为true)
    					 hasLine:是否需要加边框线
    					 activeStyle:点击反馈的自定义样式 			
					
					*/}
					<Grid
						data={this.state.GridList}
						hasLine={false}
						square={false}
						columnNum={2}
						renderItem={(el, index) => (
							<Flex className="grid-flex" justify="around">
								{/* {JSON.stringify(el)}---- {index} */}
								<div className="el-title">
									<h4>{el.title}</h4>
									<p>{el.desc}</p>
								</div>
								<img src={BASE_URL + el.imgSrc} alt="" />
							</Flex>
						)}
					/>
				</div>
			</>
		);
	}
	//最新资讯
	renderNews() {
		return (
			<>
				<h3>最新资讯</h3>
				<div className="news-content">
					{this.state.news.map((v) => (
						<div key={v.id} className="news-item">
							<div className="imgbox">
								<img src={BASE_URL + v.imgSrc} alt="" />
							</div>
							<Flex justify="between" direction="column" className="content">
								<h5 className="title"> {v.title} </h5>
								<Flex justify="between" className="bottom">
									<span className="from"> {v.from} </span>
									<span className="date"> {v.date} </span>
								</Flex>
							</Flex>
						</div>
					))}
				</div>
			</>
		);
	}

	render() {
		return (
			<div className="index">
				<div className="swiper">
					{/* 轮播图组件 */}
					{this.renderSwiper()}
					{/* 头部搜索 */}
					{this.renderSearch()}
				</div>
				{/* 导航部分 */}
				<div className="nav"> {this.renderNav(this.props)} </div>
				{/* 租房小组 */}
				{<div className="group"> {this.renderGroup()} </div>}
				{/* 最新资讯 */}
				<div className="news"> {this.renderNews()} </div>
			</div>
		);
	}
}
export default Index;
