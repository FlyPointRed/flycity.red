/**
   * 本方法仅在/backend/process文件中调用，传入外部环境参数
   * 
   * @param router node路由器
   * @param sc 协议发送端
   */
module.exports = function client(router, sc, passport) {
	router.all('/login_auth', function (req, res) {//登录接口
		const stuff = sc.instanceRequest('LoginTask', 'login', 'securityCenter')//从左到右分别是接口名，方法标志，部件码
		stuff.items = [req.body.username, req.body.password]//请求参数以数组形式传递 按照接口规定顺序传递，只需要按照规定顺序传入就好。不用传字段名。
		sc.send(stuff).then((resp) => {
			if (resp.head.success) {
				req.session.passport = resp.object
			} else {
				req.session.passport = undefined
			}
			res.json(resp.head)
		})
	})
	router.all('/login_check', function (req, res) {//鉴定是否登录接口
		const stuff = sc.instanceRequest('LoginTask', 'isLogin', 'securityCenter')//从左到右分别是接口名，方法标志，部件码
		stuff.items = [req.session.passport]//请求参数以数组形式传递 按照接口规定顺序传递，只需要按照规定顺序传入就好。不用传字段名。
		sc.send(stuff).then((resp) => {
			res.json(resp.head)
		})
	})
	router.all('/login_out', function (req, res) {//退出系统接口
		const stuff = sc.instanceRequest('LoginTask', 'logout', 'securityCenter')//从左到右分别是接口名，方法标志，部件码
		stuff.auxiliary = { [passport]: req.session.passport }//访问需要权限的接口需要在协议中放入passport对象
		stuff.items = [req.session.passport]
		sc.send(stuff).then((resp) => {
			res.json(resp.head)
		})
	})
	router.all('/login_getUser', function (req, res) {//退出系统接口
		const stuff = sc.instanceRequest('LoginTask', 'selectActorByPassport', 'securityCenter')
		stuff.auxiliary = { [passport]: req.session.passport }
		stuff.items = [req.session.passport]
		return sc.send(stuff).then((resp) => {
			res.json(resp.object)
		})
	})
	router.all('/sendCheckcode', function (req, res) {//发送短信验证码
		let param = req.body
		const stuff = sc.instanceRequest('SendCheckcodeTask', 'sendCheckcode', 'ltMessageManagement')
		stuff.items = [
			param.phone,
			param.templatCode,
			param.userName,
		]
		return sc.send(stuff).then((resp) => {
			res.json(resp.head)
		})
	})
	router.all('/forgotPassword', function (req, res) {//忘记密码
		let param = req.body
		const stuff = sc.instanceRequest('ActorTask', 'forgotLoginPwByMobile', 'securityCenter')
		stuff.items = [
			param.identCode,
			param.mobileNumber,
			param.loginPassword,
		]
		return sc.send(stuff).then((resp) => {
			res.json(resp.head)
		})
	})
	router.all('/createActor', function (req, res) {//注册账号
		let param = req.body
		const stuff = sc.instanceRequest('ActorTask', 'createActor', 'securityCenter')
		stuff.items = [
			param.identCode,
			param.mobileNumber,
			param.loginPassword,
		]
		return sc.send(stuff).then((resp) => {
			res.json(resp.head)
		})
	})

}
