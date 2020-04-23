import React from 'react';
import styles from './index.module.scss';
import NavHeader from 'common/NavHeader';
import { getCurrentCity } from 'utils/City';
import { Toast } from 'antd-mobile';
import axios from 'axios';
import { BASE_URL } from 'utils/config'; //引入环境变量
const BMap = window.BMap;

class Map extends React.Component {
	state = {
		isShow: false, //控制房屋列表的显示和隐藏
		houseList: [], //房屋列表
	};
	render() {
		return (
			<div className={styles.map}>
				<NavHeader>地图找房</NavHeader>
				<div id="container" className="container"></div>
				{/* 房屋列表 */}
				<div className={`houseList ${this.state.isShow ? 'show' : ''}`}>
					<div className="titleWrap">
						<h1 className="listTitle">房屋列表</h1>
						<a className="titleMore" href="/house/list">
							更多房源
						</a>
					</div>
					{/* 遍历房屋列表数据动态渲染 */}
					<div className="houseItems">
						{this.state.houseList.map((v) => (
							<div className="house" key={v.houseCode}>
								<div className="imgWrap">
									<img className="img" src={BASE_URL + v.houseImg} alt="" />
								</div>
								<div className="content">
									<h3 className="title">{v.title}</h3>
									<div className="desc">{v.desc}</div>
									<div>
										{v.tags.map((items, index) => {
											return (
												<span
													key={items}
													className={`tag tag${(index % 3) + 1}`}
												>
													{items}
												</span>
											);
										})}
									</div>
									<div className="price">
										<span className="priceNum">{v.price}</span> 元/月
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
	async componentDidMount() {
		// console.log(styles);
		// 1.获取当前定位城市
		const currentCity = await getCurrentCity();
		// 2.创建地图实例
		var map = new BMap.Map('container');
		// 3.创建地址解析器获取经纬度
		const myGeo = new BMap.Geocoder();

		//修改map的指向
		this.map = map;
		myGeo.getPoint(
			currentCity.label,
			async (point) => {
				/* 
				调用getPoint方法获取经纬度
					参数1:地址详细信息
					参数2:回调函数,用于获取坐标点
					参数3:名称
			*/
				// 4.初始化地图，设置中心点坐标和地图级别
				map.centerAndZoom(point, 11);
				//给地图添加控件
				map.addControl(new BMap.NavigationControl());
				map.addControl(new BMap.ScaleControl());
				//移动地图时隐藏房屋列表  movestart百度提供事件移动时触发
				this.map.addEventListener('movestart', () => {
					this.setState({
						isShow: false,
					});
				});

				//发送ajax请求,获取当前城市下所有区的信息
				this.renderOverLays(currentCity);
			},
			currentCity.label
		);
	}
	//发送请求渲染覆盖物
	async renderOverLays(currentCity) {
		//添加加载效果
		Toast.loading('拼命加载中...', 0);

		const res = await axios.get('http://localhost:8080/area/map', {
			params: {
				id: currentCity.value,
			},
		});
		// console.log(res);
		const { status, body } = res.data;
		//获取到判断缩放级别的返回值
		const { nextZoom, type } = this.getTypeAndZoom();

		if (status === 200) {
			//遍历所有区数据,并渲染覆盖物
			body.forEach((v) => {
				this.addOverLays(v, type, nextZoom);
			});
		}
		//加载成功,隐藏加载中提示
		Toast.hide();
	}
	//添加覆盖物的方法,只是判断类型
	addOverLays(v, type, nextZoom) {
		// console.log(v, type, nextZoom);
		if (type === 'circle') {
			//渲染圆形覆盖物
			this.addCircle(v, nextZoom);
		} else {
			//渲染方形覆盖物
			this.addRect(v, nextZoom);
		}
	}
	//根据当前地图的缩放级别,判断覆盖物和下一级覆盖物的缩放级别
	getTypeAndZoom() {
		const zoom = this.map.getZoom(); //百度提供的获取当前缩放级别
		let nextZoom; //下一级别覆盖物的缩放级别
		let type; //渲染的类型
		if (zoom === 11) {
			nextZoom = 13;
			type = 'circle'; //渲染圆形覆盖物
		} else if (zoom === 13) {
			type = 'circle';
			nextZoom = 15;
		} else {
			type = 'rect'; //渲染方形覆盖物
			nextZoom = 15;
		}
		return {
			type,
			nextZoom, //(传给addOverlays)
		};
	}
	//渲染圆形覆盖物(市,区,镇)
	addCircle(v, nextZoom) {
		const point = new BMap.Point(v.coord.longitude, v.coord.latitude);
		//1.创建label给地图添加文本标注
		let label = new BMap.Label(
			`<div class="bubble">
								<p class="name">${v.label}</p>
								<p>${v.count}套</p>
							</div>`,
			{
				position: point, // 指定文本标注所在的地理位置
				offset: new BMap.Size(-35, -35), //设置文本偏移量
			}
		);
		//2.设置label的样式,清除默认的边框
		label.setStyle({
			//设置文本标注的样式
			border: 'none',
			padding: 0, //去掉白色小圆点
		});
		//3.把label添加到地图上
		this.map.addOverlay(label);

		//4.给label注册点击事件
		label.addEventListener('click', () => {
			//1.把点击的label设置为地图的中心点
			this.map.centerAndZoom(point, nextZoom);
			//2.清除地图上所有的label
			/* 
									报错: Cannot read property 'R' of null
									原因:百度内部处理事件顺序:1.先处理用户的注册事件,2.再处理百度内部其他事件
											这里清除了覆盖物,导致百度内部找不到label,就报错但不影响功能
									解决:添加延时器
									参考文档:https://www.jianshu.com/p/dd903851f791
								*/
			setTimeout(() => {
				this.map.clearOverlays(); //百度提供的清除覆盖物的方法
			}, 0);
			//3.继续发送请求获取下一级覆盖物的信息
			this.renderOverLays(v);
		});
	}
	//渲染方形覆盖物(小区)
	addRect(v, nextZoom) {
		// console.log(v, nextZoom);
		/* 
			逻辑同渲染圆形覆盖物,只是不需要清除label
		*/
		//1.获取小区覆盖物的地理位置
		const point = new BMap.Point(v.coord.longitude, v.coord.latitude);
		//2.创建方形的文本标注
		const label = new BMap.Label(
			`
			<div class="rect">
        <span class="housename">${v.label}</span>
	      <span class="housenum">${v.count} 套</span>
      	<i class="arrow"></i>
      </div>
			`,
			{
				position: point, //设置文本标注所在位置
				offset: new BMap.Size(-50, -22), //设置文本偏移值
			}
		);
		//3.设置label的样式,清除默认的边框
		label.setStyle({
			border: 'none',
			padding: 0,
		});
		//4.把label添加到地图上
		this.map.addOverlay(label);

		// debugger; //打断点,断完后要删掉

		//5.给方块状房源添加点击事件
		label.addEventListener('click', (e) => {
			// console.log(e);
			Toast.loading('拼命加载中...', 0);

			//1.需要让地图居中-不需要放大(房源列表出现,需要重新计算)
			// this.map.centerAndZoom(point, nextZoom);
			//2.房源信息在地图中居中
			const x = window.innerWidth / 2 - e.changedTouches[0].pageX;
			const y =
				(window.innerHeight - 45 - 330) / 2 - (e.changedTouches[0].pageY - 45);
			this.map.panBy(x, y); //让地图在地图上移动的位置

			//3.发送请求显示该小区下房源信息(不需要清除覆盖物)
			/* 
				注意:此处不能用async语法,不然注册事件不执行
				原因:百度自己实现的addEventListener方法不支持async function	
				解决:.then语法
			*/
			axios
				.get('http://localhost:8080/houses', {
					params: {
						cityId: v.value,
					},
				})
				.then((res) => {
					const { status, body } = res.data;
					if (status === 200) {
						//4.显示房源信息  移动地图时需要隐藏(在添加控件后添加移动触发的事件)
						this.setState({
							houseList: body.list,
							isShow: true,
						});
					}
					Toast.hide();
				});
		});
	}
}
export default Map;
