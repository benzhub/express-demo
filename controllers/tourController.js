const APIFeatures = require('../utils/apiFeatures')
const Tour = require('../models/tourModel')

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}

exports.getAllTours = async (req, res) => {
    try {
        // execute query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

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