const express = require('express')
const tourController = require('../controllers/tourController')

const router = express.Router();

// middleware
// router.param('id', tourController.checkID)

// Alias Router
// request => http://localhost:8000/api/v1/tours/top-5-cheap
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours)

router
    .route('/')
    .get(tourController.getAllTours)
    // tourController.checkBody is Middleware
    .post(tourController.createTour)
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router;