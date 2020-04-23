import React from 'react';
import { Toast } from 'antd-mobile';
import axios from 'axios';
import { getCurrentCity, setCity } from 'utils/City';
import { List, AutoSizer } from 'react-virtualized'; //长列表组件
import styles from './index.module.scss';
import NavHeader from 'common/NavHeader/index'; //引入头部封装的导航条

//造假列表数据
// const list = Array.from(new Array(10000)).map(
// 	(v, index) => `我是第${index}条数据`
// );

const TITLE_HEIGHT = 36; //标题的高
const CITY_HEIGHT = 50; //城市的高度
const Hot = ['北京', '上海', '广州', '深圳']; //热门城市

class City extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			arr: [],
			obj: {},
			currentIndex: 0, //当前高亮的下标
		};
		this.ListRef = React.createRef();
	}
	render() {
		return (
			<div className={styles.city}>
				{/* 导航条 */}
				<NavHeader> 城市选择</NavHeader>
				{/* 渲染城市列表 
          	width: 长列表的宽度
          	height: 长列表的高度
          	rowCount: 用于指定有多少条数据
          	rowHeight： 指定每一行的高度,可以是一个固定的高度，或者一个函数
						scrollToAlignment:配置scrollToRow的对齐方式
							start:置顶对齐
							end:底部对齐
							center:居中对齐
						rowRenderer： 用于控制每一行数据渲染的具体的内容
							key:因为长列表是遍历出来的,渲染的元素肯定需要加key
							index:需要渲染的数据的下标
							isScrolling:是否正在滚动(可删)
							isVisiable:当前数据是否可见(可删)
							style:用于控制每一项数据的样式,位置
*/}
				<AutoSizer>
					{({ width, height }) => (
						<List
							width={width}
							height={height}
							rowCount={this.state.arr.length}
							rowHeight={this.parseHeight.bind(this)}
							rowRenderer={this.rowRenderer.bind(this)}
							onRowsRendered={this.onRowsRendered.bind(this)}
							ref={this.ListRef}
							scrollToAlignment="start"
						/>
					)}
				</AutoSizer>
				{/* 右侧城市索引列表： */}
				<ul className="city-index">
					{this.state.arr.map((v, index) => (
						<li className="city-index-item" key={v}>
							<span
								className={
									index === this.state.currentIndex ? 'index-active' : ''
								}
								onClick={this.handleIndex.bind(this, index)}
							>
								{v === 'hot' ? '热' : v.toUpperCase()}
							</span>
						</li>
					))}
				</ul>
			</div>
		);
	}

	componentDidMount() {
		this.getCityList();
	}
	//List渲染的每项内容
	rowRenderer({ key, index, style }) {
		const short = this.state.arr[index];
		const citys = this.state.obj[short];
		// console.log(short, citys);
		return (
			<div key={key} style={style} className="city-item">
				<div className="title">{this.parseTitle(short)}</div>
				{citys.map((v) => (
					<div
						className="name"
						key={v.value}
						onClick={this.switchCity.bind(this, v)}
					>
						{v.label}
					</div>
				))}
			</div>
		);
	}
	//点击城市名称切换城市
	switchCity(city) {
		// console.log(city);
		if (Hot.includes(city.label)) {
			// localStorage.setItem('current-city', JSON.stringify(city));
			setCity(city);
			this.props.history.push('/home');
		} else {
			Toast.info('没有更多数据', 1);
			return;
		}
	}
	//点击索引置顶该索引城市
	handleIndex(index) {
		//scrollToRow让 List 组件滚动到指定行
		this.ListRef.current.scrollToRow(index);
	}
	//处理滚动类名高亮问题
	onRowsRendered({ startIndex }) {
		//onRowsRendered当list长列表的行发生改变的时候会触发
		// console.log(startIndex);//开始行的下标
		if (this.state.currentIndex !== startIndex) {
			this.setState({
				currentIndex: startIndex,
			});
		}
	}
	//处理列表标题
	parseTitle(title) {
		// console.log(title);
		if (title === '#') {
			return '当前定位';
		} else if (title === 'hot') {
			return '热门城市';
		} else {
			return title.toUpperCase();
		}
	}
	//处理每项的高
	parseHeight({ index }) {
		// console.log(index);
		const title = this.state.arr[index];
		const citys = this.state.obj[title];
		return TITLE_HEIGHT + citys.length * CITY_HEIGHT;
	}
	//获取城市列表
	async getCityList() {
		const res = await axios.get('http://localhost:8080/area/city', {
			params: {
				level: 1,
			},
		});
		// console.log(res);
		const { status, body } = res.data;
		if (status === 200) {
			//将数据交给另一个函数专门处理
			this.parseCityList(body);

			//根据处理后的数据的返回值进行处理
			const { arr, obj } = this.parseCityList(body);
			// console.log(arr, obj);

			//处理热门城市
			const hotRes = await axios.get('http://localhost:8080/area/hot');
			// console.log(hotRes);
			arr.unshift('hot');
			obj.hot = hotRes.data.body;
			// console.log(obj, arr);

			/* 
			//处理当前定位城市--多处使用-封装到utils工具函数中
				1.首页中获取到的当前城市保存到本地存储
				2.优先从本地存储获取当前城市的信息
				3.如果获取到,就直接使用
					如果没有获取到,就调用百度地图的API,去定位获取当前城市
				4.把当前城市的信息保存到本地存储
			
			*/
			arr.unshift('#');
			//方法一:回调函数
			// getCurrentCity((currentCity) => {
			// 	console.log(currentCity);
			// });

			//方法二:用promise
			const currentCity = await getCurrentCity();
			// console.log(currentCity);

			obj['#'] = [currentCity]; //将对象转成数组,和后台数据统一
			// console.log(obj, arr);
			this.setState(
				{
					arr,
					obj,
				},
				() => {
					//等arr,obj数据修改完并且渲染完成,测量所有的行
					this.ListRef.current.measureAllRows();
				}
			);
		}
	}
	//处理城市数据
	parseCityList(body) {
		// console.log(body);

		/* 
			思路:
					1.遍历数据
					2.获取到城市的short简写第一个字符
					3.判断这个字符在对象中是否存在
					4.如果不存在,给对象新增加一个属性 cityObj['b'] = [v]
						如果存在,直接给这个属性的值push一个值 cityObj['b'].push(v)
		*/
		const obj = {};
		body.forEach((v) => {
			const short = v.short.slice(0, 1);
			if (short in obj) {
				//如果存在
				obj[short].push(v);
			} else {
				obj[short] = [v]; //中括号语法,新增一个short的属性
			}
		});
		// console.log(obj);

		//2.而且渲染还要有顺序，并且右侧菜单还需要渲染，还需要有一个数组
		const arr = Object.keys(obj).sort();
		// console.log(arr);
		//3.将处理的数据(对象和数组)返回
		return {
			obj,
			arr,
		};
	}
}
export default City;
