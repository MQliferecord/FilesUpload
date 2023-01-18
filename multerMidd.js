const multer = require("multer")
const format = require('silly-datetime')
const mkdirp = require('mkdirp')
const path = require('path')

const multerMidd = multer({
    storage:multer.diskStorage({
        destination:function(req,file,cb){
            console.log('111')
            const date = format.format(new Date(),'YYYYMMDD')
            const url = path.resolve(__dirname+`/img/${date}`)
            mkdirp.sync(url)
            cb(null,url)
        },
        filename:function(req,file,cb){
            const name = file.originalname.slice(file.originalname.lastIndexOf("."))
            cb(null,Date.now()+name)
        }
    }),
    fileFilter:(req,file,cb)=>{
        if (file.mimetype.includes("image")) {
            cb(null, true);
          } else {
            cb(null, false);
          }
    }
})
let getFile = multerMidd.single("file");
let getFiles = multerMidd.array("file");

module.exports={
    getFile,
    getFiles
}