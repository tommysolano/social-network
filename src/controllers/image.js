const path = require('path')
const { randomNumber } = require('../helpers/libs')
const fs = require('fs-extra')
const { Image } = require('../models/index')
const ctrl = {}

ctrl.index = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    res.render("image", {image})
}

ctrl.create = (req, res) => {

    const saveImage = async () => {
        const imgURL = randomNumber()
        const images = await Image.find({ filename: imgURL })
        if (images.length > 0) {
            saveImage()
        } else {
            const imageTempPath = req.file.path
            const ext = path.extname(req.file.originalname).toLowerCase()
            const targetPath = path.resolve(`src/public/upload/${imgURL}${ext}`)
    
            if (ext === '.jpg' || ext === '.png' || ext === '.jpeg' || ext === '.gif') {
                await fs.moveSync(imageTempPath, targetPath)
                const newImg = new Image({
                    title: req.body.title,
                    description: req.body.description,
                    filename: imgURL + ext
                })
                const imageSaved = await newImg.save()
                res.redirect("/images/" + imgURL )
            } else {
                await fs.unlink(imageTempPath)
                res.status(500).json({ error: "Only images are allowed" })
            }
        }
    }

    saveImage()
}

ctrl.like = (req, res) => {

}

ctrl.comment = (req, res) => {

}

ctrl.remove = (req, res) => {

}

module.exports = ctrl