import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import http from 'utils/Http';
import NavHeader from 'common/NavHeader';
import HouseItem from 'common/HouseItem';
import NoHouse from 'common/NoHouse';
import styles from './index.module.scss';
export default class Rent extends Component {
	state = {
		list: [], // 出租房屋列表
		isLoaded: false, //是否加载完(解决页面已进来闪跳无房源问题)
	};

	// 获取已发布房源的列表数据
	async getHouseList() {
		const { status, body } = await http.get('/user/houses');
		if (status === 200) {
			this.setState({
				list: body,
				isLoaded: true,
			});
		}
		// console.log(this.state.list);
	}

	componentDidMount() {
		this.getHouseList();
	}
	//有数据渲染的内容
	renderHouseItem = () => {
		const { list } = this.state;
		return list.map((v) => <HouseItem v={v} key={v.houseCode}></HouseItem>);
	};
	//渲染房屋列表
	renderRentList() {
		const { list, isLoaded } = this.state;
		if (!isLoaded) {
			//加载完再渲染,解决闪跳问题
			return null;
		}
		if (list.length === 0) {
			//没有数据渲染无房源
			return (
				<NoHouse>
					您还没有房源，
					<Link to="/rent/add" className="link">
						去发布房源
					</Link>
					吧~
				</NoHouse>
			);
		}
		//有数据渲染房屋信息
		return <div className="houses">{this.renderHouseItem()}</div>;
	}

	render() {
		return (
			<div className={styles.rent}>
				<NavHeader
					className="navHeader"
					rightContent={[
						<span key={1} onClick={() => this.props.history.push('/rent/add')}>
							添加
						</span>,
					]}
				>
					房屋管理
				</NavHeader>
				{this.renderRentList()}
			</div>
		);
	}
}
