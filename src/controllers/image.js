const path = require('path')
const { randomNumber} = require('../helpers/libs')
const fs = require('fs-extra')
const ctrl = {}

ctrl.index = (req, res) => {

}

ctrl.create = async (req, res) => {
    const imgURL = randomNumber()
    const imageTempPath = req.file.path
    const ext = path.extname(req.file.originalname).toLowerCase()
    const targetPath = path.resolve(`src/public/upload/${imgURL}${ext}`)
    
    if(ext === '.jpg' || ext === '.png' || ext === '.jpeg' || ext === '.gif'){
        await fs.rename(imageTempPath, targetPath)
    }

    res.send("works")
}

ctrl.like = (req, res) => {
    
}

ctrl.comment = (req, res) => {
    
}

ctrl.remove = (req, res) => {
    
}

module.exports = ctrl