const express = require('express')
const tourController = require('./../controllers/tourController')
const router = express.Router();

router.param('id', tourController.checkID)

router
    .route('/')
    .get(tourController.getAllTours)
    // tourController.checkBody is Middleware
    .post(tourController.checkBody, tourController.createTour)
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router;