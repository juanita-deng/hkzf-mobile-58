import React from 'react';
import styles from './index.module.scss';
import img from './not-found.png';
export default function NoHouse() {
	return (
		<div className={styles['no-house']}>
			<img src={img} alt="" />
			<p>没有找到房源，请您换个搜索条件吧~</p>
		</div>
	);
}
