import React from 'react';
import styles from './index.module.scss';
import img from './not-found.png';
import PropTypes from 'prop-types';
export default class NoHouse extends React.Component {
	static propTypes = {
		children: PropTypes.array,
	};
	render() {
		//发布房源的结构
		if (this.props.children) {
			return (
				<div className={styles['no-house']}>
					<img src={img} alt="" />
					<p>{this.props.children}~</p>
				</div>
			);
		}

		return (
			//找房页面的结构
			<div className={styles['no-house']}>
				<img src={img} alt="" />
				<p>没有找到房源，请您换个搜索条件吧~</p>
			</div>
		);
	}
}
