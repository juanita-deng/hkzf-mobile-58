import React from 'react';
import styles from './index.module.scss';
import { PickerView } from 'antd-mobile';
import FilterFooter from '../FilterFooter/index';
//三级联动造假数据
// const province = [
// 	{
// 		label: '北京',
// 		value: '01',
// 		children: [
// 			{
// 				label: '东城区',
// 				value: '01-1',
// 			},
// 			{
// 				label: '西城区',
// 				value: '01-2',
// 			},
// 			{
// 				label: '崇文区',
// 				value: '01-3',
// 			},
// 			{
// 				label: '宣武区',
// 				value: '01-4',
// 			},
// 		],
// 	},
// 	{
// 		label: '浙江',
// 		value: '02',
// 		children: [
// 			{
// 				label: '杭州',
// 				value: '02-1',
// 				children: [
// 					{
// 						label: '西湖区',
// 						value: '02-1-1',
// 					},
// 					{
// 						label: '上城区',
// 						value: '02-1-2',
// 					},
// 					{
// 						label: '江干区',
// 						value: '02-1-3',
// 					},
// 					{
// 						label: '下城区',
// 						value: '02-1-4',
// 					},
// 				],
// 			},
// 			{
// 				label: '宁波',
// 				value: '02-2',
// 				children: [
// 					{
// 						label: 'xx区',
// 						value: '02-2-1',
// 					},
// 					{
// 						label: 'yy区',
// 						value: '02-2-2',
// 					},
// 				],
// 			},
// 			{
// 				label: '温州',
// 				value: '02-3',
// 			},
// 			{
// 				label: '嘉兴',
// 				value: '02-4',
// 			},
// 			{
// 				label: '湖州',
// 				value: '02-5',
// 			},
// 			{
// 				label: '绍兴',
// 				value: '02-6',
// 			},
// 		],
// 	},
// ];

class FilterPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.defaultValues, //用于获取PickView的筛选的值(双向绑定)
		};
	}
	/* 
	  解决来回切换筛选的标题-数据不回显的问题
	原因:来回切换Picker组件没被销毁,直接复用.componentDidMount只执行了一次更新value
	解决法1:用数据更新的钩子函数(一定要加判断,否则死循环)
	解决法2:给Picker组件加一个key
	*/
	// componentDidUpdate(prevProps) {
	// 	if (prevProps.defaultValues !== this.props.defaultValues) {
	// 		this.setState({
	// 			value: this.props.defaultValues,
	// 		});
	// 	}
	// }
	render() {
		const { handleHide, handleConfirm, data, cols } = this.props;
		return (
			<div className={styles['filter-picker']}>
				{/* 三级联动 */}
				<PickerView
					data={data}
					cols={cols}
					value={this.state.value}
					onChange={this.handleChange.bind(this)}
				/>
				{/* 底部 */}
				<FilterFooter
					handleHide={handleHide}
					handleConfirm={() => handleConfirm(this.state.value)}
				></FilterFooter>
			</div>
		);
	}
	//双向数据绑定,获取用户筛选的内容
	handleChange(val) {
		// console.log(val);//onchange的返回值,用户筛选的内容
		this.setState({
			value: val,
		});
	}
}
export default FilterPicker;
