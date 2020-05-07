import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { hasToken } from 'utils/token';
/* 
  PrivateRoute最终要和Route一样
  功能:具有Route的功能,要求必须登录了才能显示对应的component
       如果没有登陆,直接添砖到登陆页面即可.
  component:Component 组件取名,想要当成组件进行渲染,首字母必须大写
*/
//解构props,将component组件属性单独提取出来;...rest:剩余参数,可以获取到除去component的剩余的属性参数
export default function PrivateRoute({ component: Component, ...rest }) {
	// console.log(props);
	//Component:是取得组件名字,解构得传进来得Rent组件,...rest是剩余属性
	// return <Route {...props}></Route>;//将使用时的Rent上得属性展开给当前组件,和Route就没区别了,没有意义,需要将component排除
	return (
		<Route
			{...rest}
			render={(props) => {
				// console.log(props, rest);
				/* 
       问题:在出租页拦截到登录页,登录成功后却跑到个人中心而不是原路返回到出租页
       解决:给重定向添加路由state参数,则在login页面可以通过props访问到这个参数state
      */

				return hasToken() ? (
					<Component {...props}></Component> //renderprops方式渲染组件会导致组件props丢失,需要手动加上
				) : (
					<Redirect
						to={{ pathname: '/login', state: { from: props.location } }}
					></Redirect>
				); //判断是否有token,没有就去登陆页,有就可以访问该页面
			}}
		></Route>
	);
}
