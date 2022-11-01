const Tour = require('../models/tourModel')

exports.getAllTours = async (req, res) => {
    try {
        // build query
        // 1. Filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el])

        // The Moongse model give you a easy way to operate Objects
        // const querys = Tour.find(req.query);

        // execute  query
        // 2. Advanced filtering
        // execute query
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr))
        // const tours = await Tour.find(queryObj);
        const tours = await Tour.find(JSON.parse(queryStr));

        // { difficult: 'easy', duration: { $gte: 5 } }
        // { difficult: 'easy', duration: { gte: '5' } }

        // object operation
        // const tours = await Tour.find()
        //     .where('duration')
        //     // .lt(5)
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy')

        // send response
        res.status(200).json({
            'status': 'success',
            'requestedAt': req.requestTime,
            'results': tours.length,
            'data': {
                tours
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }

}

exports.getTour = async (req, res) => {
    try {
        // Tour.findOne({ _id: req.params.id })
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            'status': 'success',
            'data': {
                tours: tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }

}

exports.createTour = async (req, res) => {
    try {

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }

}

exports.updateTour = async (req, res) => {
    try {
        // new: true is mean return the update document
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}