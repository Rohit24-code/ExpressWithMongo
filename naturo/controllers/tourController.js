const APIFeatures = require('../utils/apiFeatures');
const Tour = require('./../models/tourModel');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  next();
};



exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      results: tour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    let newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ status: 'Success', data: { tour } });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    let deleted = await Tour.deleteOne({ _id: req.params.id });

    res.status(204).json({
      status: 'success',
      data: deleted,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getTourStats = async (req,res)=>{
   try {
    const stats =await Tour.aggregate([
      {
        $match:{ratingsAverage: {$gte: 4.5}}
      },
        {
          $group:{
            _id:{$toUpper : "$difficulty"},
            numTours: { $sum:1},
            numRating:{$avg : "$ratingsQuantity"},
            avgRating:{$avg:"$ratingsAverage"},
            avgPrice:{$avg:"$price"},
            minPrice:{$min:"$price"},
            maxPrice:{$max:"$price"}
          }

        },
        {
          $sort :{ 
            avgPrice:1
          }
        }
        // ,{
        //   // $match:{
        //   //   _id: {$ne : 'EASY'}
        //   // }
        // }
    ])
    res.status(200).json({ status: 'Success', stats  });
   } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
   }
}
