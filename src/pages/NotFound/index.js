import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
class NotFound extends React.Component {
	render() {
		return (
			<div className="not-found">
				你访问的页面没找到,返回<Link to="/home">首页</Link>
			</div>
		);
	}
}
export default NotFound;
