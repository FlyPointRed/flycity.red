import Vue from 'vue'
import 'es6-promise/auto'
import { createApp } from './app'


// a global mixin that calls `asyncData` when a route component's params change
const { app, router, store } = createApp()
// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__)
}
// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
	// actually mount to DOM
	app.$mount('#app')
})

// service worker
if ('https:' === location.protocol && navigator.serviceWorker) {
	navigator.serviceWorker.register('/service-worker.js')
}
