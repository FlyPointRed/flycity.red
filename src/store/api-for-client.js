import Vue from 'vue'
import Resource from 'vue-resource'
import { Message } from 'element-ui'

Vue.use(Resource)
Vue.http.options.root = '/ajax'
Vue.http.options.emulateJSON = true
Vue.http.interceptors.push(function (request, next) {
	Vue.prototype.$bar.running()
	// let loadingInstance = null
	// if (request.load) {
	// 	loadingInstance = Loading.service({
	// 		fullscreen: true,
	// 		text: 'loading',
	// 		customClass: 'loading-window'
	// 	});
	// }
	// continue to next interceptor
	next((response) => {
		Vue.prototype.$bar.end()
		if (response.body.assignUniqueSecretMessage) {
			Message.closeAll()
			Message.warning(response.body.assignUniqueSecretMessage)
			if (response.body.assignUniqueSecretMessage == '账号未登录！') {
				setTimeout(() => {
					location.href = '/login'
				}, 1000)
			}
			request.respondWith({}, {
				status: 500,
				statusText: response.body.assignUniqueSecretMessage
			})
		}
		// if (request.load) {
		// 	loadingInstance.close();
		// }
	})

})



export const api = {

}