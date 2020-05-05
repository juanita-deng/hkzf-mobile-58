import React, { Component } from 'react';
import styles from './index.module.scss';

//吸顶功能的组件
export default class Sticky extends Component {
	constructor(props) {
		super(props);
		this.placeholderRef = React.createRef();
		this.contentRef = React.createRef();
	}
	render() {
		return (
			<div className={styles.sticky}>
				{/* 占位置的盒子 */}
				<div className="placeholder" ref={this.placeholderRef}></div>
				{/* 转内容的盒子 */}
				<div className="content" ref={this.contentRef}>
					{this.props.children}
				</div>
			</div>
		);
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
	//如果不移除滚动事件,在其他页面滚动时也会触发滚动事件
	componentWillUnmount() {
		//页面销毁时触发
		window.removeEventListener('scroll', this.handleScroll);
	}
	//滚动事件
	handleScroll = () => {
		//1.获取到距离顶部的top值
		//方法一:window.pageYoffset
		// console.log(
		// this.contentRef.current.offsetTop
		// );
		// console.log(window.pageYOffset);
		// if (this.placeholderRef.current.offsetTop <= window.pageYOffset) {
		// 	this.contentRef.current.classList.add('fixed');
		// 	this.placeholderRef.current.style.height = 40 + 'px';
		// } else {
		// 	this.contentRef.current.classList.remove('fixed');
		// 	this.placeholderRef.current.style.height = 0;
		// }

		//方法二:getBoundingClientRect()返回元素的大小及其相对视口的位置
		const obj = this.placeholderRef.current.getBoundingClientRect();
		// console.log(obj.top);
		// 2.判断top值是否是负数
		if (obj.top <= 0) {
			//就该固定定位了
			this.contentRef.current.classList.add('fixed'); //添加固定定位类名
			//3.如果内容固定定位了,占位置的盒子就需要有高度(内容盒子的高度)
			this.placeholderRef.current.style.height =
				this.contentRef.current.offsetHeight + 'px'; //内容盒子的高度
		} else {
			this.contentRef.current.classList.remove('fixed');
			this.placeholderRef.current.style.height = 0;
		}
	};
}
