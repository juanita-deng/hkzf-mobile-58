import React from 'react';
import './index.scss';

class Map extends React.Component {
	render() {
		return <div id="container"></div>;
	}
	componentDidMount() {
		// 3.创建地图实例
		var map = new window.BMap.Map('container');
		// 4.创建点坐标
		const point = new window.BMap.Point(121.61895125119062, 31.040452304898167);
		// 5.初始化地图，设置中心点坐标和地图级别
		map.centerAndZoom(point, 15);
	}
}
export default Map;
