const express = require('express')
const router = express.Router()
const multer = require('multer')


//上传下载 通用
router.all('/fileupload', multer().single('file'), function(req, res) { 

	res.json('nasdasd')
})
//上传头像截图信息
router.all('/fileuploadBlob', multer().single('file'), function(req, res) { 
	res.json('nasdasd')
})
// router.all('/filedownload*', function(req, res) {
// 	res.set({
// 		'Content-Type': 'application/octet-stream',
// 		'Content-Disposition': 'attachment; filename=' + encodeURIComponent(55555),
// 		'Content-Length':5000,
// 	})
// 	res.send()
// })

module.exports = { router}