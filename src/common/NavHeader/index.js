import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import styles from './index.module.scss';
import PropTypes from 'prop-types'; //props的校验
import { withRouter } from 'react-router-dom'; //导入路由高阶组件
import classNames from 'classnames';

/* 
	在react中,组件必须通过Route进行配置,才能通过props去获取到路由信息
	(location,match,history)
*/
class NavHeader extends React.Component {
	static propTypes = {
		children: PropTypes.string.isRequired,
		rightContent: PropTypes.array,
	};
	render() {
		// console.log(this.props);
		return (
			<div className={classNames(styles.navHeader, this.props.className)}>
				<NavBar
					className="navbar"
					mode="dark"
					icon={<Icon type="left" />}
					onLeftClick={() => this.props.history.go(-1)}
					rightContent={this.props.rightContent}
				>
					{/* 头部中间的文字通过children传递过来 */}
					{this.props.children}
				</NavBar>
			</div>
		);
	}
}

export default withRouter(NavHeader);
