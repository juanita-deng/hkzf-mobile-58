import React from 'react';
import SearchHeader from 'common/SearchHeader';
import styles from './index.module.scss';
import { Flex, Toast } from 'antd-mobile';
import Filter from './Filter';
import http from 'utils/Http'; //处理过的axios
import { getCurrentCity } from 'utils/City';
import HouseItem from 'common/HouseItem';
import Sticky from 'common/Sticky'; //吸顶功能的组件
import NoHouse from 'common/NoHouse'; //没有匹配数据时显示的页面
import {
	AutoSizer,
	List,
	WindowScroller,
	InfiniteLoader,
} from 'react-virtualized';
let CURRENT_CITY = '上海';
class House extends React.Component {
	state = {
		houseParems: {}, //房屋列表处理的参数
		houseList: [], //房屋列表信息
		houseCount: -1, //房屋总条数
	};
	render() {
		return (
			<div className={styles.house}>
				<Flex className="house-title" style={{ backgroundColor: '#ddd' }}>
					<span className="iconfont icon-back"></span>
					<SearchHeader
						cityName={CURRENT_CITY}
						className="house-header"
					></SearchHeader>
				</Flex>

				{/* 渲染筛选组件 */}
				<Sticky>
					<Filter onFilter={this.onFilter}></Filter>
				</Sticky>

				{/* 渲染房屋列表 */}
				<div className="house-list">{this.renderList()}</div>
			</div>
		);
	}
	renderList() {
		const { houseCount } = this.state;
		if (houseCount === 0) {
			return <NoHouse></NoHouse>;
		} else if (houseCount > 0) {
			//loadMoreRows:一个函数:用于加载更多函数,需要发送Ajax请求获取更多数据,必须返回promise
			return (
				<InfiniteLoader
					isRowLoaded={this.isRowLoaded}
					loadMoreRows={this.loadMoreRows}
					rowCount={this.state.houseCount}
				>
					{({ onRowsRendered, registerChild }) => (
						<WindowScroller>
							{({ height, isScrolling, onChildScroll, scrollTop }) => (
								<AutoSizer>
									{({ width }) => (
										<List
											autoHeight
											height={height}
											//用于判断某一行是否有数据,需要返回一个布尔值
											isScrolling={isScrolling}
											onScroll={onChildScroll}
											scrollTop={scrollTop}
											width={width}
											//渲染的总条数
											rowCount={this.state.houseCount}
											rowHeight={120}
											rowRenderer={this.rowRenderer}
											onRowsRendered={onRowsRendered}
											ref={registerChild}
										/>
									)}
								</AutoSizer>
							)}
						</WindowScroller>
					)}
				</InfiniteLoader>
			);
		} else {
			return null;
		}
	}
	rowRenderer = ({ key, index, style }) => {
		// console.log(this.state.houseList[index]);//滚动太快显示undefined
		/* 解决快速滚动报错问题
					如果item有值,就正常渲染houseItem
					没有item没有值,就不渲染houseItem,渲染一个占位置的元素
		*/
		const item = this.state.houseList[index];
		if (item) {
			return (
				<HouseItem
					v={this.state.houseList[index]}
					key={key}
					//style属性List组件用于控制位置的
					style={style}
				></HouseItem>
			);
		} else {
			return (
				<div key={key} className="placeholder" style={style}>
					<p></p>
				</div>
			);
		}
	};
	isRowLoaded = ({ index }) => {
		/* 
			index:返回的那个看不见的下标
            需要返回一个布尔值 
            如果有值,就不用加载数据
            如果没有数据需要加载更多数据,
		*/
		return !!this.state.houseList[index]; //双!!转布尔值
	};
	loadMoreRows = ({ startIndex, stopIndex }) => {
		// 用于提供加载更多函数的逻辑,需要发送Ajax请求去加载更多数据,必须返回一个promise
		console.log('加载更多', startIndex, stopIndex);
		return new Promise(async (resolve, reject) => {
			//异步的操作,需要发送请求,获取数据
			//加1解决每次请求最后一条数据重复的问题
			await this.getHouseList(startIndex + 1, stopIndex + 1);
			resolve();
		});
	};
	componentDidMount() {
		this.getHouseList();
	}
	//获取房屋列表
	async getHouseList(start = 1, end = 30) {
		Toast.loading('拼命加载中', 0);
		//解决不断加载,不断发请求
		document.body.style.overflow = 'hidden';
		const city = await getCurrentCity();
		CURRENT_CITY = city.label;
		const res = await http.get('/houses', {
			params: {
				...this.state.houseParems,
				cityId: city.value,
				start,
				end,
			},
		});
		const { count, list } = res.body;
		if (res.status === 200) {
			this.setState({
				//不能覆盖,而是追加
				houseList: [...this.state.houseList, ...list],
				houseCount: count,
			});
		}
		//数据加载完隐藏提示
		Toast.hide();
		//解决不断加载,不断发请求
		document.body.style.overflow = '';
		if (start === 1) {
			Toast.info('总共找到了' + count + '条数据');
		}
	}
	//点击确定接收filter组件传递过来的数据
	onFilter = (selectedValues) => {
		// console.log(selectedValues); //接收子组件Filter传递过来的筛选好的条件
		const params = this.parseFilter(selectedValues);
		// console.log(params); //接收处理参数的返回值
		//根据参数发送ajax请求获取房屋数据
		this.setState(
			{
				houseParems: params,
				houseList: [], //点击确定时要清空房屋列表,否则数据不会更新
			},
			() => {
				this.getHouseList();
			}
		);
	};
	//处理Filter组件传过来的参数
	parseFilter(val) {
		const params = {};
		params.rentType = val.mode[0];
		params.price = val.price[0];
		params.more = val.more.join();
		/* 
			处理area或者subway
         area和subway的值： 如果长度为2， 值就是第二项
         如果长度为3，并且第三项值不为null, 值就是第三项，否则值就是第二项。		
		*/
		const area = val.area;
		if (area.length === 3 && area[2] !== null) {
			params[area[0]] = area[2];
		} else {
			params[area[0]] = area[1];
		}
		//将处理好的params返回
		return params;
	}
}
export default House;
