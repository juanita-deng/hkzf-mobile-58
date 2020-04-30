import React from 'react';
import styles from './index.module.scss';
import FilterTitle from '../FilterTitle/index'; //导入筛选组件标题
import FilterPicker from '../FilterPicker/index'; //导入条件筛选组件
import FilterMore from '../FilterMore/index'; //导入更多筛选组件
import http from 'utils/Http';
import { getCurrentCity } from 'utils/City';

class Filter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//控制标题的高亮,因多个组件使用,需要状态提升至父组件
			titleObj: {
				area: false, //区域 (和FilterTitle组件的titleList的type数据对应)
				mode: false, //方式(整租,合租)
				price: false, //价格
				more: false, //更多
			},
			openType: '', //用于控制显隐,点击的是哪个分类area/mode/price/more
			filterData: {}, //组件需要渲染的数据
			//用于保存每个筛选的条件
			selectedValues: {
				area: ['area', 'null'], //设置的默认值
				price: ['null'],
				type: ['null'],
				mode: ['null'],
				more: [],
			},
		};
	}
	async componentDidMount() {
		//发送请求获取筛选条件的数据
		const city = await getCurrentCity();
		const res = await http.get('/houses/condition', {
			params: {
				id: city.value,
			},
		});
		const { status, body } = res;
		if (status === 200) {
			this.setState({
				filterData: body,
			});
		}
	}
	render() {
		const { titleObj, openType } = this.state;
		return (
			<div className={styles.filter}>
				{openType === 'area' || openType === 'mode' || openType === 'price' ? (
					<div className="mask" onClick={this.handleHide} />
				) : null}
				<div className="content">
					{/* filter组件的内容 */}
					{/* 筛选标题 */}
					<FilterTitle
						titleObj={titleObj}
						changeActive={this.changeActive}
					></FilterTitle>

					{/* 条件筛选 */}
					{this.renderFilterPicker()}

					{/* 更多筛选 */}
					{this.renderFilterMore()}
				</div>
			</div>
		);
	}
	//更多筛选组件的渲染
	renderFilterMore() {
		const {
			selectedValues,
			filterData: { characteristic, floor, oriented, roomType },
		} = this.state;
		let defaultValues = selectedValues.more;
		if (this.state.openType === 'more') {
			return (
				<FilterMore
					handleHide={this.handleHide}
					{...{ characteristic, floor, oriented, roomType }}
					handleConfirm={this.handleConfirm}
					defaultValues={defaultValues}
				></FilterMore>
			);
		}
	}
	//条件筛选组件的渲染
	renderFilterPicker() {
		const { openType, filterData, selectedValues } = this.state;
		// console.log(filterData);
		//FilterPicker的显示和隐藏
		if (openType === 'more' || openType === '') {
			return null;
		}
		//数据渲染
		let data, cols; //传给子组件的数据
		let defaultValues = selectedValues[openType];
		if (openType === 'mode') {
			data = filterData.rentType;
			cols = 1;
		} else if (openType === 'price') {
			data = filterData.price;
			cols = 1; //显示1列
		} else if (openType === 'area') {
			data = [filterData.area, filterData.subway];
			cols = 3; //显示3列
		}

		return (
			<FilterPicker
				handleHide={this.handleHide}
				handleConfirm={this.handleConfirm}
				/* 将收集的数据传给子组件FilterPicker */
				data={data}
				/* 将控制显示的列数传给子组件FilterPicker */
				cols={cols}
				/* 将用户筛选的条件内容传给子组件 */
				defaultValues={defaultValues}
				/* 解决来回切换标题数据不回显 */
				key={openType}
			></FilterPicker>
		);
	}
	//判断type和value是否需要高亮(封装)
	setSelectedStatus(type, val, newTitleObj) {
		const value = val.toString();
		if (type === 'area' && value !== 'area,null') {
			//如果点的是区域且不是默认值,就高亮
			newTitleObj[type] = true;
		} else if (type === 'mode' && value !== 'null') {
			newTitleObj[type] = true;
		} else if (type === 'price' && value !== 'null') {
			newTitleObj[type] = true;
		} else if (type === 'more' && value !== '') {
			newTitleObj[type] = true;
		} else {
			newTitleObj[type] = false;
		}
	}
	//控制FilterTitle中点击高亮,及FilterPicker的显示
	changeActive = (type) => {
		// console.log(type);//接收子组件FilterTitle传递过来的type值
		//this.state.titleObj[type] = true 不能直接修改state的值
		/*
				当我们点击某一个type的时候,我们不能直接修改当前的type为true
			1.当我们点击任意一个type的时候,就应该控制所有的type的选中状态
			2.点击某个type,让这个type高亮,让其他type不高亮(排他)
				需要遍历selectedValues或者titleObj的键(type类型)
				判断每一个type,设置titleSelectedStatus中每一个type的true或false
				说明我们遍历的这个type是当前的type
			3.如果不是当前的type,需要判断这个type对应的selectedValus的值是不是默认值
							 如果不是默认值,就高亮,如果是默认值,不高亮
							 默认值:area:['area','null'];mode:['null'] price:['null']
		*/
		const { selectedValues, titleObj } = this.state;
		const newTitleObj = { ...titleObj };

		Object.keys(titleObj).forEach((v) => {
			// 判断每一个type,设置titleSelectedStatus中每一个type的true或false
			if (v === type) {
				newTitleObj[v] = true; //点击当前的标题高亮
			} else {
				// 如果不是当前的type,需要判断这个type对应的selectedValus的值是不是默认值
				this.setSelectedStatus(v, selectedValues[v], newTitleObj);
			}
		});
		this.setState({
			titleObj: newTitleObj,
			openType: type, //控制组件FilterPicker的显示
		});
		//操作dom,解决bug:遮罩出现后滑动遮罩后面的数据还能动
		document.body.style.overflow = 'hidden';
	};
	//取消按钮的逻辑
	handleHide = () => {
		//需要判断当前点击的openType的值是不是默认值,
		//如果是不高亮,如果是就高亮
		const { openType, selectedValues, titleObj } = this.state;
		const newTitleObj = { ...titleObj };
		this.setSelectedStatus(openType, selectedValues[openType], newTitleObj);
		this.setState({
			openType: '', //控制FilterPicker的隐藏
			titleObj: newTitleObj, //控制取消时高亮的逻辑
		});
		//操作dom,解决bug:遮罩出现后滑动遮罩后面的数据还能动
		document.body.style.overflow = '';
	};
	//点击确定按钮的逻辑
	handleConfirm = (val) => {
		//操作dom,解决bug:遮罩出现后滑动遮罩后面的数据还能动
		document.body.style.overflow = '';
		// console.log(val); //接收子组件传递过来的值
		const { openType, selectedValues, titleObj } = this.state;
		const newValue = { ...selectedValues };
		newValue[openType] = val;
		const newTitleObj = { ...titleObj };
		this.setSelectedStatus(openType, val, newTitleObj);
		this.setState({
			openType: '', //控制FilterPicker的隐藏
			selectedValues: newValue, //获取用户筛选的内容
			titleObj: newTitleObj, //点击确定时高亮的控制
		});
		//点击确定时,把筛选好的条件传给父组件house
		this.props.onFilter(newValue);
		//在滚动条在中间时确定好筛选条件后数据不能置顶
		window.scrollTo(0, 0);
	};
}
export default Filter;
