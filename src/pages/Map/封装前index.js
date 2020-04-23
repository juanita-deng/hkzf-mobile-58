import React from 'react';
import styles from './index.module.scss';
import NavHeader from 'common/NavHeader';
import { getCurrentCity } from 'utils/City';
import Axios from 'axios';

const BMap = window.BMap;

class Map extends React.Component {
	render() {
		return (
			<div className={styles.map}>
				<NavHeader>地图找房</NavHeader>
				<div id="container" className="container"></div>
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

				//发送ajax请求,获取当前城市下所有区的信息
				const res = await Axios.get('http://localhost:8080/area/map', {
					params: {
						id: currentCity.value,
					},
				});
				// console.log(res);
				//遍历所有区数据,并渲染
				res.data.body.forEach((v) => {
					// console.log(v);
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
					});
					//3.把label添加到地图上
					map.addOverlay(label);

					//4.给label注册点击事件
					label.addEventListener('click', () => {
						//1.把点击的label设置为地图的中心点
						map.centerAndZoom(point, 13);
						//2.清除地图上所有的label
						/* 
							报错: Cannot read property 'R' of null
							原因:百度内部处理事件顺序:1.先处理用户的注册事件,2.再处理百度内部其他事件
									这里清除了覆盖物,导致百度内部找不到label,就报错但不影响功能
							解决:添加延时器
							参考文档:https://www.jianshu.com/p/dd903851f791
						*/
						setTimeout(() => {
							map.clearOverlays(); //百度提供的清除覆盖物的方法
						}, 1000);
					});
				});
			},
			currentCity.label
		);
	}
}
export default Map;
