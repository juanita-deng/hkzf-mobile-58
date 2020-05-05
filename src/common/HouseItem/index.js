import React from 'react';
import { BASE_URL } from 'utils/config'; //引入环境变量
import classNames from 'classnames';
import styles from './index.module.scss';
import { withRouter } from 'react-router-dom';

function houseItem(props) {
	const { v, style, history } = props;
	return (
		<div
			className={styles.house}
			style={style}
			onClick={() => history.push(`/detail/${v.houseCode}`)}
		>
			<div className="imgWrap">
				<img className="img" src={BASE_URL + v.houseImg} alt="" />
			</div>
			<div className="content">
				<h3 className="title">{v.title}</h3>
				<div className="desc">{v.desc}</div>
				<div>
					{v.tags.map((items, index) => {
						return (
							<span
								key={items}
								className={classNames(`tag tag${(index % 3) + 1}`)}
							>
								{items}
							</span>
						);
					})}
				</div>
				<div className="price">
					<span className="priceNum">{v.price}</span> 元/月
				</div>
			</div>
		</div>
	);
}

export default withRouter(houseItem);
