import React from 'react';
import styles from './index.module.scss';
import { Flex } from 'antd-mobile';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class FilterFooter extends React.Component {
	static propTypes = {
		cancelBtn: PropTypes.string,
	};
	//设置默认校验值
	static defaultProps = {
		cancelBtn: '取消',
	};
	render() {
		const { className, cancelBtn, handleHide, handleConfirm } = this.props;
		return (
			/* 不能将propsName丢失 */
			<Flex className={classNames(styles['filter-footer'], className)}>
				{/* 取消按钮 */}
				<span className="btn cancel" onClick={handleHide}>
					{cancelBtn}
				</span>
				{/* 确定按钮 */}
				{/* <span className="btn ok" onClick={() => handleConfirm(value)}> 方式一 */}
				<span className="btn ok" onClick={handleConfirm}>
					确定
				</span>
			</Flex>
		);
	}
}
export default FilterFooter;
