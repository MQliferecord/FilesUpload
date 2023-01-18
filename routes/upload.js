var express = require('express');
var router = express.Router();
let upload = require('../uploadFile')
const multerPosit = require('../multerMidd')

router.post('/getSize',upload.getSize)
router.post('/video',upload.video)
router.post("/upload",multerPosit.getFile,upload.singleFile)
router.post('/uploads',multerPosit.getFiles,upload.mutilFiles)

module.exports = router;