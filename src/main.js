import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import Axios from 'axios';
Vue.prototype.$axios = Axios;
import Moment from 'moment';
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css';
Vue.prototype.Viewer = Viewer;
// import UrlConfig from './components/urlConfig.vue';
// import UrlConfig from './urlConfig.js';
// Vue.prototype.urlConfig = UrlConfig;
// import prjType from './prjType.js';
// Vue.prototype.prjType = prjType;

import App from './app.vue';
import SearchList from './components/searchList.vue';
Vue.component('search-list', SearchList);
import ThemeSearchList from './components/themeSearchList.vue';
Vue.component('theme-search-list', ThemeSearchList);
import MeetingInfo from './components/meetingInfo.vue';
Vue.component('meeting-info', MeetingInfo);
import AccessoryManage from './components/accessoryManage.vue';
Vue.component('accessory-manage', AccessoryManage);
import ThemeInfo from './components/themeInfo.vue';
Vue.component('theme-info', ThemeInfo);


// 请求json配置文件后再加载vue实例
var configXhr = new XMLHttpRequest();
configXhr.responseType = 'json';
configXhr.onreadystatechange = ()=>{
	if (configXhr.readyState == 4) {
		if (configXhr.status == 200) {
			// 将配置信息挂到vue原型中，方便使用this.调用配置文件信息
			var prjTypeResp = configXhr.response.projectType;
			var prjNameResp = configXhr.response.projectName;
			var servicePathResp = configXhr.response.servicePath;
			var urlConfigResp = configXhr.response.urlConfig;
			var imgPathResp = configXhr.response.imgPath;
			var urlConfigObj = {};
			for(var key in urlConfigResp){
				urlConfigObj[key] = servicePathResp + urlConfigResp[key];
			}
			urlConfigObj.imgPath = imgPathResp;
			Vue.prototype.urlConfig = urlConfigObj;
			Vue.prototype.prjType = prjTypeResp[prjNameResp];
			// 生成vue实例
			var vm = new Vue({
				el:'#app',
				render:c => c(App),
				created:()=>{
					
				}
			});
		}
	}
}
configXhr.open('get','pageConfig.json')
configXhr.send();

//vue
// var vm = new Vue({
// 	el:'#app',
// 	render:c => c(App),
// 	created:()=>{
		
// 	}
// });
