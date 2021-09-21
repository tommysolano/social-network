const path = require('path')
const { randomNumber } = require('../helpers/libs')
const fs = require('fs-extra')
const { Image, Comment } = require('../models/index')
const md5 = require('md5')
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

ctrl.comment = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if (image) {
        const newComment = new Comment(req.body)
        newComment.gravatar = md5(newComment.email)
        newComment.image_id = image._id
        newComment.save()
        res.redirect('/images/'+image.uniqueId)
    }
}

ctrl.remove = (req, res) => {

}

module.exports = ctrl