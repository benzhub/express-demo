const Tour = require('../models/tourModel')

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}

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
        // 1B. Advanced filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // console.log(JSON.parse(queryStr))
        // const tours = await Tour.find(queryObj);
        let query = Tour.find(JSON.parse(queryStr));

        // 2. Sorting
        //http://localhost:8000/api/v1/tours?sort=price // price low to high
        //http://localhost:8000/api/v1/tours?sort=-price // price high to low
        if (req.query.sort) {
            // http://localhost:8000/api/v1/tours?sort=-price,ratingsAverage
            const sortBy = req.query.sort.split(',').join(' ');
            // console.log(sortBy)
            query = query.sort(sortBy)
            // sort('price ratingAverage')
        } else {
            // default sort by created Time
            query = query.sort('-createdAt')
        }

        // 3. Field Limiting
        if (req.query.fields) {
            //http://localhost:8000/api/v1/tours?fields=name,duration,difficulty,price => rsults only include name,duration,difficulty,price
            //http://localhost:8000/api/v1/tours?fields=-name,-duration => rsults only exclude name,duration
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // 4. Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        // page=2&limit=10, 1-10: page 1, 11-20: page 2, 21-30: page 3
        // query = query.skip(2).limit(10)
        query = query.skip(skip).limit(limit)

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist!')
        }

        // execute query
        const tours = await query;
        // query.sort().select().skip().limit()

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