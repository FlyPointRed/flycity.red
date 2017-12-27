export default {
	imageBiger: {
		// 当绑定元素插入到 DOM 中。
		bind: function (el) {
			// 聚焦元素
			el.style.cursor = 'pointer'
			el.addEventListener('click', function () {
				if (el.src && el.src != '') {
					window.open(el.src)
				}
			})
		}
	}
}