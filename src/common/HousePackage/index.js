import React from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// 所有房屋配置项
const HOUSE_PACKAGE = [
	{
		id: 1,
		name: '衣柜',
		icon: 'icon-wardrobe',
	},
	{
		id: 2,
		name: '洗衣机',
		icon: 'icon-wash',
	},
	{
		id: 3,
		name: '空调',
		icon: 'icon-air',
	},
	{
		id: 4,
		name: '天然气',
		icon: 'icon-gas',
	},
	{
		id: 5,
		name: '冰箱',
		icon: 'icon-ref',
	},
	{
		id: 6,
		name: '暖气',
		icon: 'icon-Heat',
	},
	{
		id: 7,
		name: '电视',
		icon: 'icon-vid',
	},
	{
		id: 8,
		name: '热水器',
		icon: 'icon-heater',
	},
	{
		id: 9,
		name: '宽带',
		icon: 'icon-broadband',
	},
	{
		id: 10,
		name: '沙发',
		icon: 'icon-sofa',
	},
];
export default class HousePackage extends React.Component {
	static propTypes = {
		list: PropTypes.array,
		onSelect: PropTypes.func,
	};
	state = {
		activeVale: [], //动态控制的类名
	};
	handleClick = (name) => {
		// console.log(name);
		const { activeVale } = this.state;
		//判断当前状态是否有配置的名字
		//注意:不是直接修改当前状态的值,否则拿到的值永远是上一次的状态
		let arr = Array.from(activeVale);
		if (arr.includes(name)) {
			//有就去掉
			arr = arr.filter((v) => v !== name);
		} else {
			//没有就添加
			arr.push(name);
		}
		this.setState({
			activeVale: arr,
		});
		// console.log(arr);
		//将最新结果传给父组件
		this.props.onSelect(arr);
	};

	render() {
		// console.log(this.props);
		const { onSelect, list } = this.props;
		var data = [];
		if (list) {
			data = HOUSE_PACKAGE.filter((v) => list.includes(v.name));
		} else {
			data = HOUSE_PACKAGE;
		}
		// console.log(data);
		return (
			<div className={styles['house-package']}>
				{data.map((items) => (
					<li
						//如果有onSelect属性,就执行点击事件,没有这个属性就不执行
						onClick={onSelect && this.handleClick.bind(this, items.name)}
						key={items.id}
						className={classNames('item', {
							active: this.state.activeVale.includes(items.name),
						})}
					>
						<p>
							<i className={`iconfont icon ${items.icon}`}></i>
						</p>
						{items.name}
					</li>
				))}
			</div>
		);
	}
}
