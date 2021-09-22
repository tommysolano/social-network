const path = require('path')
const { randomNumber } = require('../helpers/libs')
const fs = require('fs-extra')
const { Image, Comment } = require('../models/index')
const md5 = require('md5')
const ctrl = {}

ctrl.index = async (req, res) => {
    const viewModel = { image: {}, comments: {}}
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if(image){
        image.views = image.views + 1
        viewModel.image = image
        await image.save() 
        const comments = await Comment.find({image_id: image._id})
        viewModel.comments = comments
        res.render("image", {image, comments})
    } else {
        res.redirect("/")
    }
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

ctrl.like = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if (image) {
        image.likes = image.likes + 1
        await image.save()
        res.json({likes: image.likes})
    }  else {
        res.status(500).json({ error: "Internal error" })
    }
}

ctrl.comment = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if (image) {
        const newComment = new Comment(req.body)
        newComment.gravatar = md5(newComment.email)
        newComment.image_id = image._id
        newComment.save()
        res.redirect('/images/'+image.uniqueId)
    } else {
        res.redirect("/")
    }
}

ctrl.remove =  async(req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if (image) {
        await fs.unlink(path.resolve("./src/public/upload/" + image.filename))
        await Comment.deleteOne({image_id: image._id})
        await image.remove()
        res.json(true)
    }  
}

module.exports = ctrl