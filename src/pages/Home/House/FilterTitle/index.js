import React from 'react';
import { Flex } from 'antd-mobile';
import styles from './index.module.scss';
import classNames from 'classnames';

const titleList = [
	{ title: '区域', type: 'area' },
	{ title: '方式', type: 'mode' },
	{ title: '租金', type: 'price' },
	{ title: '筛选', type: 'more' },
];
class FilterTitle extends React.Component {
	render() {
		// console.log(this.props);
		const { titleObj, changeActive } = this.props;
		return (
			<div>
				<Flex align="center" className={styles['filter-title']}>
					{titleList.map((v) => (
						<Flex.Item key={v.type}>
							{/* 选中类名： selected */}
							<span
								className={classNames('dropdown', {
									selected: titleObj[v.type],
								})}
							>
								<span onClick={() => changeActive(v.type)}>{v.title}</span>
								<i className="iconfont icon-arrow" />
							</span>
						</Flex.Item>
					))}
				</Flex>
			</div>
		);
	}
}
export default FilterTitle;
