const APIFeatures = require('../utils/apiFeatures');
const Tour = require('./../models/tourModel');
const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/appError")

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  next();
};



exports.getAllTours = catchAsync(async (req, res,next) => {
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
})

exports.getTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findById({ _id: req.params.id });
    console.log(tour,"getTOurk andar h")
    if(!tour){
     return  next(new AppError("No tour find with that id",404))
    }

    res.status(200).json({
      status: 'success',
      results: tour,
    });
})

exports.createTour = catchAsync(async (req, res,next) => {
    let newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    })
})


//to remove try Catch we implemented catchAsync function this fn will reuturn new anonyses fn and call it.
exports.updateTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      //this is very useful bcs while updating also it will follow all rules of creating.
      runValidators:true
    });

    if(!tour){
      return  next(new AppError("No tour find with that id",404))
     }

    res.status(200).json({ status: 'Success', data: { tour } });
});

exports.deleteTour = catchAsync(async (req, res,next) => {


    let deleted = await Tour.deleteOne({ _id: req.params.id });

    if(!deleted){
      return  next(new AppError("No tour find with that id",404))
     }

    res.status(204).json({
      status: 'success',
      data: deleted,
    });
})

exports.getTourStats = catchAsync(async (req,res,next)=>{
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
   
})


exports.getMonthlyPlan=catchAsync(async (req,res,next)=>{
    const year = req.params.year * 1;

    //unwind will split the array in single single object for every start date
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group : {
          _id: {$month: '$startDates'},
          numToursStarts: {$sum:1},
          //we will have array having names of all the tours using below query
          tours: {$push: '$name'}
        }
      },
      {
        //simply to add new field in the data
        $addFields: {
          month: '$_id'
        }
      }, {
        //if i add _id as 0 will not show it in the document whereas 1 will show that
        $project: {
          _id: 0 //1
        }
      },{
        $sort: { numToursStarts: -1}
      }, {
        $limit: 12
      }
    ])

    res.status(200).json({ status: 'Success', plan  });
})