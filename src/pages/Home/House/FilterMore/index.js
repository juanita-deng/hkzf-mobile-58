import React from 'react';
import styles from './index.module.scss';
import FilterFooter from '../FilterFooter';
import classNames from 'classnames';

class FilterMore extends React.Component {
	state = {
		selectValue: this.props.defaultValues, //选中项的值(回显)
	};
	render() {
		const { handleConfirm, handleHide } = this.props;
		return (
			<div className={styles['filter-more']}>
				{/* 遮罩层 */}
				<div className="mask" onClick={handleHide} />
				{/* 条件内容 */}
				{this.renderItem()}
				{/* 底部的按钮 */}
				<FilterFooter
					className="footer"
					cancelBtn="清除"
					handleHide={() => this.setState({ selectValue: [] })}
					handleConfirm={() => handleConfirm(this.state.selectValue)}
				></FilterFooter>
			</div>
		);
	}
	//渲染条件内容
	renderItem() {
		const { characteristic, floor, oriented, roomType } = this.props;
		const itemList = [
			{ title: '户型', content: roomType },
			{ title: '朝向', content: oriented },
			{ title: '楼层', content: floor },
			{ title: '房屋亮点', content: characteristic },
		];
		return (
			<div className="tags">
				{itemList.map((v) => (
					<dl className="dl" key={v.title}>
						<dt className="dt">{v.title}</dt>
						<dd className="dd">
							{v.content.map((item) => (
								<span
									className={classNames('tag', {
										'tag-active': this.state.selectValue.includes(item.value),
									})}
									onClick={this.handleSelect.bind(this, item.value)}
									key={item.value}
								>
									{item.label}
								</span>
							))}
						</dd>
					</dl>
				))}
			</div>
		);
	}
	//获取选中值
	handleSelect(value) {
		//判断value是否在selectValue中存在，
		//如果不存在，就添加，如果存在，就删除
		let arr = Array.from(this.state.selectValue);
		if (arr.includes(value)) {
			// 如果value在arr中存在
			arr = arr.filter((v) => v !== value);
		} else {
			arr.push(value);
		}
		this.setState({
			selectValue: arr,
		});
	}
}

export default FilterMore;
