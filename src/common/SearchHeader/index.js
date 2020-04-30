import React from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Flex } from 'antd-mobile';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class SearchHeader extends React.Component {
	static propTypes = {
		cityName: PropTypes.string.isRequired,
		className: PropTypes.string,
	};
	render() {
		// console.log(this.props);
		/* 
			封装一个组件的时候,会出现类名丢失问题(className,styles),我们希望使用组件的时候,覆盖这个组件的样式,需要对classname进行额外的处理
		*/
		//方法一:缺点:如果使用的组件没有传值classname,html中会显示undefined
		// const className = [styles['search-header'] + ' ' + this.props.className];
		//方法二:解决:使用数组的join方法,进行字符串拼接.最终的类名效果 aa bb
		// const className = [styles['search-header'], this.props.className].join(' ');
		//方法三:使用第三方组件classnames

		return (
			<div
				className={classNames(styles['search-header'], this.props.className)}
				style={this.props.style}
			>
				<Flex className="search-box">
					<Flex className="search-form">
						<div
							className="location"
							onClick={() => this.props.history.push('/city')}
						>
							<span className="name">{this.props.cityName}</span>
							<span className="iconfont icon-arrow"> </span>
						</div>
						<div className="search-input">
							<span className="iconfont icon-seach" />
							<span className="text">请输入小区地址</span>
						</div>
					</Flex>
					{/* 地图小图标 */}
					<span
						className="iconfont icon-map"
						onClick={() => this.props.history.push('/map')}
					/>
				</Flex>
			</div>
		);
	}
}
export default withRouter(SearchHeader);
