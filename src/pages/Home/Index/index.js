import React from 'react';
import { Carousel } from 'antd-mobile';
class Index extends React.Component {
	state = {
		//控制图片
		data: ['1', '2', '3'],
		//轮播图初始高度
		imgHeight: 176,
	};
	componentDidMount() {
		// simulate img loading
		setTimeout(() => {
			this.setState({
				//图片
				data: [
					'AiyWuByWklrrUDlFignR',
					'TekJlZRVCjLFexlOCuWn',
					'IJOtIlfsYdTyaDTRVrLI',
				],
			});
		}, 100);
	}
	render() {
		return (
			<div>
				{/* 轮播图组件 */}
				<Carousel
					//自动播放
					autoplay={false}
					//无限滚动
					infinite
				>
					{this.state.data.map((val) => (
						<a
							key={val}
							href="http://www.alipay.com"
							style={{
								display: 'inline-block',
								width: '100%',
								height: this.state.imgHeight,
							}}
						>
							<img
								src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
								alt=""
								style={{ width: '100%', verticalAlign: 'top' }}
								onLoad={() => {
									// fire window resize event to change height
									window.dispatchEvent(new Event('resize'));
									this.setState({ imgHeight: 'auto' });
								}}
							/>
						</a>
					))}
				</Carousel>
			</div>
		);
	}
}
export default Index;
