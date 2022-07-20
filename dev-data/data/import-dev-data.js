const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel')

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
    // .connect(process.env.DATABASE_LOCAL, {
    // no longer supported options in Mongoose 6
    .connect(DB, {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    }).then(() => console.log('DB connection successful'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data into database
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data successfully loaded!')
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

// Delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('Data successfully deleted!')
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData();
}