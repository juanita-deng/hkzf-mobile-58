/* 
  思路:
    1.优先从本地存储中获取当前城市信息
    2.如果有,直接返回该城市信息
    3.如果没有获取到,调用百度地图的API,去定位当前城市
    4.根据定位当前城市发送Ajax请求,得到真实的真实信息,存到本地再返回
      问题:定位发请求是异步的,拿不到返回值
      解决:方法一:使用回调函数 问题:如果回调嵌套过多,造成回调地狱
          方法二:用promise
    5.获取到了城市信息,记得往缓存中存一份
*/
import axios from 'axios';

//因多次使用当前城市的本地存储,生成统一变量提供出去,以免出错
const CURRENT_CITY = 'current-city';
export function setCity(city) {
	localStorage.setItem(CURRENT_CITY, JSON.stringify(city));
}

//方法二:promise
export function getCurrentCity(callback) {
	// 因为获取当前城市是异步的操作，直接返回一个承诺
	return new Promise((resolve, reject) => {
		const currentCity = JSON.parse(localStorage.getItem(CURRENT_CITY));
		if (currentCity) {
			resolve(currentCity);
			callback && callback(currentCity); //优化,调用时用回调函数也可以
		} else {
			const myCity = new window.BMap.LocalCity();
			myCity.get((result) => {
				// console.log(result);//result.name即为当前城市
				axios
					.get('http://localhost:8080/area/info?name=' + result.name)
					.then((res) => {
						//.then成功了就把城市信息存储起来
						const { body } = res.data;
						// localStorage.setItem(CURRENT_CITY, JSON.stringify(body));
						setCity(body);
						resolve(body);
						callback && callback(currentCity); //优化,调用时用回调函数也可以
					})
					.catch((err) => {
						reject(err);
						callback && callback(currentCity);
					});
			});
		}
	});
}

//方法一:回调函数
// export function getCurrentCity(callback) {
// 	// console.log('获取当前城市');
// 	const currentCity = JSON.parse(localStorage.getItem('current-city'));
// 	if (currentCity) {
// 		// return currentCity;
// 		callback(currentCity);
// 	} else {
// 		const myCity = new window.BMap.LocalCity();
// 		myCity.get(async (result) => {
// 			// console.log(result);//result.name即为当前城市
// 			const res = await axios.get('http://localhost:8080/area/info', {
// 				params: {
// 					name: result.name,
// 				},
// 			});
// 			// console.log(res);
// 			const { status, body } = res.data;
// 			if (status === 200) {
// 				localStorage.setItem('current-city', JSON.stringify(body));
// 				// return body; //axios是异步的,拿不到返回值
// 				callback(body);
// 			}
// 		});
// 	}
// }
