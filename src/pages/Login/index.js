import React from 'react';
import styles from './index.module.scss';
import { WhiteSpace, WingBlank, Flex, Toast } from 'antd-mobile';
import NavHeader from 'common/NavHeader';
import { Link } from 'react-router-dom';
import { Form, Field, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import http from 'utils/Http';
import { setToken } from 'utils/token';

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;

//初始状态
const state = {
	username: '',
	password: '',
	repassword: '',
};

//表单校验逻辑
const schema = Yup.object().shape({
	username: Yup.string()
		.required('用户名不能为空')
		.matches(REG_UNAME, '用户名必须是5-8位,由数字,字母,下划线组成'),
	password: Yup.string()
		.required('密码不能为空')
		.matches(REG_PWD, '密码必须是5-12位,由数字,字母,下划线组成'),
	repassword: Yup.string().required('确认密码不能为空'),
});
//重复密码的校验逻辑
const validate = (values) => {
	// console.log(values);
	const errors = {};
	if (values.repassword !== values.password) {
		errors.repassword = '密码不一致';
	}
	return errors;
};

function Login(props) {
	// console.log(props);
	return (
		<div className={styles.login}>
			{/* 顶部导航 */}
			<NavHeader className="navHeader">账号登录</NavHeader>
			{/* 上下留白 */}
			<WhiteSpace size="xl" />

			{/* 登录表单 */}
			{/* 
				initialValues:提供初始受控状态
				*/}
			<WingBlank>
				<Formik
					initialValues={state}
					onSubmit={async (values, FormikBag) => {
						// console.log(values, FormikBag);
						// console.log(props);
						//发请求登陆
						const { status, body } = await http.post('/user/login', {
							username: values.username,
							password: values.password,
						});
						// console.log(body);
						if (status === 200) {
							setToken(body.token);
							// FormikBag.props.history.go(-1); //props丢失

							//不能写死,需要根据路径判断是否需要回跳
							const { location, history } = props;
							if (location.state) {
								/* 
									push会生成历史记录,replace不会生成历史
								*/
								// history.push(location.state.from.pathname);
								history.replace(location.state.from.pathname); //未登录状态rent回退可以到/my页面而不是登陆页面
							} else {
								props.history.go(-1); //render-props方式在组件内部可以直接访问props
							}
						} else {
							Toast.fail('用户名或密码错误');
							//重置表单的值
							FormikBag.resetForm(); //formik提供的方法
						}
					}}
					validationSchema={schema}
					validate={validate}
				>
					{(props) => {
						return (
							<Form>
								<div className="formItem">
									<Field
										className="input"
										autoComplete="off"
										name="username"
										placeholder="请输入账号"
									/>
								</div>
								{/* 长度为5到8位，只能出现数字、字母、下划线 */}
								{/* <div className="error">账号为必填项</div> */}
								<ErrorMessage
									name="username"
									className="error"
									component="span"
								></ErrorMessage>
								<div className="formItem">
									<Field
										className="input"
										name="password"
										type="password"
										placeholder="请输入密码"
									/>
								</div>
								{/* 长度为5到12位，只能出现数字、字母、下划线 */}
								{/* <div className="error">账号为必填项</div> */}
								<ErrorMessage
									name="password"
									className="error"
									component="span"
								></ErrorMessage>
								{/* 确认密码 */}
								<div className="formItem">
									<Field
										className="input"
										name="repassword"
										type="password"
										placeholder="请输入确认密码"
									/>
								</div>
								{/* 长度为5到12位，只能出现数字、字母、下划线 */}
								{/* <div className="error">账号为必填项</div> */}
								<ErrorMessage
									name="repassword"
									className="error"
									component="span"
								></ErrorMessage>
								<div className="formSubmit">
									<button className="submit" type="submit">
										登 录
									</button>
								</div>
							</Form>
						);
					}}
				</Formik>

				<Flex className="backHome">
					<Flex.Item>
						<Link to="/registe">还没有账号，去注册~</Link>
					</Flex.Item>
				</Flex>
			</WingBlank>
		</div>
	);
}
export default Login;
