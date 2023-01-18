const formidable = require("formidable")
const fs = require("fs")
const path = require("path")
const mkdirp = require('mkdirp')
const handleStream = (item, writeStream) => {
    const readFile = fs.readFileSync(item);
    writeStream.write(readFile)
    /**
     * unlink 删除文件 除err，回调没有参数
     * item 暂存的切片文件
     */
    fs.unlink(item, () => { })
}

singleFile = (req, res) => {
    console.log("singleFiles")
    let errMsg = "";
    if (!req.file) errMsg = "文件应为image";
    res.send({
      code: 0,
      msg: errMsg || "单文件上传成功",
    });
  };

mutilFiles = (req, res) => {
    console.log("mutilFiles")
    let errMsg = "";
    if (req.files.length === 0) errMsg = "文件应为image";
    res.send({
      code: 0,
      msg: errMsg || "多文件上传成功",
    });
  };

getSize = (req, res) => {
    console.log("getSize")
    let count = 0;
    req.setEncoding("utf8")
    req.on("data", function (data) {
        let name = JSON.parse(data)
        let dirPath = path.join(__dirname, "video")
        let files = fs.readdirSync(dirPath)
        console.log(files)
        files.forEach((item, index) => {
            let url = name.fileName.split(".")[0] + `_${index + 1}.` + name.fileName.split(".")[1]
            if (files.includes(url)) {
                ++count;
            }
        })
        res.send({
            "code": 200,
            "msg": "请继续上传",
            "data":count
        })
    })
}

//上传（切片过程）
video = (req, res) => {
    console.log("video")
    //创建解析对象
    const form = new formidable.IncomingForm();
    let dirPath = path.join(__dirname, "video");
    //dirPath C:\Users\HP\Desktop\upload\uploadDemo\video
    console.log(__dirname)
    console.log(form)

    form.uploadDir = dirPath;
    mkdirp.sync(form.uploadDir)
    form.keepExtensions = true;

    /**
     * @err 错误信息
     * @fileds formData 的key-value对象
     * @file 上传的文件
     */
    form.parse(req, async (err, fields, file) => {
        let files = file.file;
        console.log(files)
        console.log(fields)
        let index = fields.index;
        let total = fields.total;
        let filename = fields.filename;
        console.log(index)
        console.log(files.filepath)

        let url = dirPath + "\\" + filename.split(".")[0] + `_${index}.` + filename.split(".")[1]
        console.log(url)
        try {
            //暂存目录用以处理文件上传不完整的情况
            fs.renameSync(files.filepath, url)
            setTimeout(() => {
                //上传完整后汇总到新地址
                if (index === total) {
                    let newDir = __dirname + `\\uploadFiles\\${Date.now()}`
                    console.log(newDir)
                    fs.mkdirSync(newDir)
                    let writeStream = fs.createWriteStream(newDir + `\\${filename}`)
                    let fsList = []
                    for (let i = 0; i < total; i++) {
                        const fsUrl = dirPath + "\\" + filename.split(".")[0] + `_${i + 1}.` + filename.split(".")[1]
                        fsList.push(fsUrl)
                    }
                    for (let item of fsList) {
                        handleStream(item, writeStream)
                    }
                    writeStream.end()
                }
            },100)
        } catch (e) {
            console.log(e)
        }
        res.send({
            "code": 200,
            "msg": "上传成功",
            "data":index
        })
    })
}

module.exports = {
    getSize,
    video,
    singleFile,
    mutilFiles
}