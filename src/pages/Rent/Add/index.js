import React, { Component } from 'react';
import {
	Flex,
	List,
	InputItem,
	Picker,
	ImagePicker,
	TextareaItem,
	Toast,
} from 'antd-mobile';
import NavHeader from 'common/NavHeader';
import HousePackge from 'common/HousePackage';
import styles from './index.module.scss';
import http from 'utils/Http';

// 房屋类型
const roomTypeData = [
	{ label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
	{ label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
	{ label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
	{ label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
	{ label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' },
];

// 朝向：
const orientedData = [
	{ label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
	{ label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
	{ label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
	{ label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
	{ label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
	{ label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
	{ label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
	{ label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' },
];

// 楼层
const floorData = [
	{ label: '高楼层', value: 'FLOOR|1' },
	{ label: '中楼层', value: 'FLOOR|2' },
	{ label: '低楼层', value: 'FLOOR|3' },
];

export default class RentAdd extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// 小区的名称和id
			community: {
				name: '',
				id: '',
			},
			// 价格
			price: '',
			// 面积
			size: '',
			// 房屋类型
			roomType: [],
			// 楼层
			floor: [],
			// 朝向：
			oriented: [],
			// 房屋标题
			title: '',
			// 房屋图片
			houseImg: [],
			// 房屋配套：
			supporting: [],
			// 房屋描述
			description: '',
		};
	}

	// 取消编辑，返回上一页
	onCancel = () => {};
	//获取用户输入信息
	handleChange = (params, val) => {
		//handlChange可以允许传递参数,value值会永远在最后一个参数
		// console.log(params, val);
		this.setState({
			[params]: val,
		});
	};
	//处理图片上传
	handleImg = (files, type, index) => {
		/*返回值
	 	files:图片信息
		type:类型,add,remove
		index:remove的下标 
	*/
		// console.log(files, type, index);
		this.setState({
			houseImg: files,
		});
	};
	//提交按钮,添加
	addHouse = async () => {
		//处理图片上传信息
		const fd = new FormData();
		this.state.houseImg.forEach((v) => {
			// console.log(v);
			fd.append('file', v.file); //file为后台指定的参数
		});
		//发送请求上传图片
		const res = await http.post('/houses/image', fd);
		const imgData = res.body;
		//发送请求发布房源
		const {
			title,
			description,
			oriented,
			supporting,
			price,
			roomType,
			floor,
			size,
			community,
		} = this.state;
		const { status } = await http.post('/user/houses', {
			title,
			description,
			houseImg: imgData.join('|'),
			oriented: oriented[0],
			supporting,
			price,
			roomType: roomType[0],
			size,
			floor: floor[0],
			community: community.id,
		});
		if (status === 200) {
			Toast.success('发布成功');
			this.props.history.push('/rent');
		}
	};
	componentDidMount() {
		//坑:注意:如果使用HashRouter,不能通过this.props.history.replace进行传参
		//解决:使用BrowerRouter
		// console.log(this.props);
		const { state } = this.props.location;
		if (state) {
			this.setState({
				community: {
					id: state.community,
					name: state.communityName,
				},
			});
		}
	}
	onSelect = (active) => {
		// console.log(active); //获取到从子组件housePackage穿过的配置信息
		// 需要的信息格式是['空调'|'洗衣机'|'冰箱']
		this.setState({
			supporting: active.join('|'),
		});
		// console.log(this.state.supporting);
	};
	render() {
		const Item = List.Item;
		const { history } = this.props;
		const {
			community,
			price,
			size,
			roomType,
			floor,
			oriented,
			description,
			houseImg,
			title,
		} = this.state;

		return (
			<div className={styles['rent-add']}>
				<NavHeader className="NavHeader">发布房源</NavHeader>
				<List className="header" renderHeader="房源信息">
					{/* 选择所在小区 */}
					<Item
						extra={community.name || '请输入小区名称'}
						arrow="horizontal"
						onClick={() => history.push('/rent/search')}
					>
						小区名称
					</Item>
					<InputItem
						placeholder="请输入租金/月"
						onChange={this.handleChange.bind(this, 'price')}
						value={price}
						extra="￥/月"
					>
						租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
					</InputItem>
					<InputItem
						placeholder="请输入建筑面积"
						onChange={this.handleChange.bind(this, 'size')}
						value={size}
						extra="㎡"
					>
						建筑面积
					</InputItem>
					<Picker
						data={roomTypeData}
						onChange={this.handleChange.bind(this, 'roomType')}
						value={roomType}
						cols={1}
					>
						<Item arrow="horizontal">
							户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
						</Item>
					</Picker>
					<Picker
						value={floor}
						onChange={this.handleChange.bind(this, 'floor')}
						data={floorData}
						cols={1}
					>
						<Item arrow="horizontal">所在楼层</Item>
					</Picker>
					<Picker
						value={oriented}
						onChange={this.handleChange.bind(this, 'oriented')}
						data={orientedData}
						cols={1}
					>
						<Item arrow="horizontal">
							朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
						</Item>
					</Picker>
				</List>

				<List className="title" renderHeader="房屋标题">
					<InputItem
						value={title}
						onChange={this.handleChange.bind(this, 'title')}
						placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
					/>
				</List>

				{/* mulitple:允许多文件上传 
					files:收集图片的数据
							注意:图片信息仍然是base64预览的格式,需要用formData进行处理
					onChange:可以有三个返回值,files,type,index
					selectable:是否显示添加按钮
			*/}
				<List className="pics" renderHeader="房屋图像">
					<ImagePicker
						onChange={this.handleImg}
						files={houseImg}
						multiple={true}
						className="imgpicker"
					/>
				</List>

				<List className="supporting" renderHeader="房屋配置">
					{/* <HousePackge list={['空调']} /> */}
					<HousePackge onSelect={this.onSelect} />
				</List>

				<List
					className="desc"
					renderHeader={() => '房屋描述'}
					data-role="rent-list"
				>
					<TextareaItem
						rows={5}
						value={description}
						onChange={this.handleChange.bind(this, 'description')}
						placeholder="请输入房屋描述信息"
						autoHeight
					/>
				</List>

				<Flex className="bottom">
					<Flex.Item className="cancel" onClick={this.onCancel}>
						取消
					</Flex.Item>
					<Flex.Item className="confirm" onClick={this.addHouse}>
						提交
					</Flex.Item>
				</Flex>
			</div>
		);
	}
}
