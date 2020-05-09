import React, { Component } from 'react';
import { SearchBar } from 'antd-mobile';
import styles from './index.module.scss';
import { getCurrentCity } from 'utils/City';
import http from 'utils/Http';
import _ from 'lodash';
export default class Search extends Component {
	state = {
		// 搜索框的值
		searchValue: '',
		tipsList: [],
	};

	// 渲染搜索结果列表
	renderTips = () => {
		const { tipsList } = this.state;
		return tipsList.map((v) => (
			<li
				onClick={() =>
					this.props.history.replace('/rent/add', {
						community: v.community,
						communityName: v.communityName,
					})
				}
				key={v.community}
			>
				{v.communityName}
			</li>
		));
	};

	render() {
		const { history } = this.props;
		const { searchValue } = this.state;
		return (
			<div className={styles['rent-search']}>
				{/* 搜索框 */}
				<SearchBar
					placeholder="请输入小区或地址"
					value={searchValue}
					onChange={this.handleChange}
					showCancelButton
					onCancel={() => history.push('/rent/add')}
				/>

				{/* 搜索提示列表 */}
				<ul className="tips">{this.renderTips()}</ul>
			</div>
		);
	}
	handleChange = (value) => {
		// console.log(value);
		//受控组件方式获取输入内容的值
		this.setState({
			searchValue: value,
		});
		//搜索关键字
		this.searchKeyWord(value);
	};
	//使用lodash的防抖函数进行性能优化
	searchKeyWord = _.debounce(async (value) => {
		//实时的发送Ajax请求,去搜索小区的名称
		const city = await getCurrentCity();
		// console.log('要请求了');
		const { status, body } = await http.get('/area/community', {
			params: {
				name: value,
				id: city.value,
			},
		});
		if (status === 200) {
			this.setState({
				tipsList: body,
			});
		}
	}, 1000);
}
