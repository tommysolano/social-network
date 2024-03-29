const mongoose = require('mongoose')
const { database } = require('./keys')

mongoose.connect(database.URI, {
    //useCreateIndex: true,
    useNewUrlParser: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log("DB is connected"))
    .catch(err => console.error(err));