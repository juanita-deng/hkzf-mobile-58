import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd-mobile/dist/antd-mobile.css'; //全局导入antd-mobilede样式
import './assets/fonts/iconfont.css'; //导入字体图标

import './index.scss'; //导入全局通用样式(也可按需导入)

ReactDOM.render(<App />, document.getElementById('root'));
