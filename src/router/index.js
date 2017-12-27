import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const index = () => import('../views/index.vue')

const routes = [
	{ path: '/i', component: index ,meta: { scrollToTop: true } },
	{ path: '/', redirect: '/i' }
]



export function createRouter() {
	return new Router({
		mode: 'history',
		routes: routes,
		scrollBehavior: (to, from, savedPosition) => {
			if (savedPosition) {
				// savedPosition is only available for popstate navigations.
				return savedPosition
			} else {
				const position = {}
				//if any matched route config has meta thafrom scrolling to to
				if (to.matched.some(m => m.meta.scrollToTop)) {
					// cords will be used if no selector is provided,
					// or if the selector didn't match any element.
					position.x = 0
					position.y = 0
				}
				// if the returned position is falsy or an empty object,
				// will retain current scroll position.
				return position
			}
		}
	})
}
