const mongoose = require('mongoose');

const slugify = require("slugify")
// Fat Modal And Thin Controller
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim:true,
      maxlength: [40,'A tour name must have less or equal than 40 characters'],
      minlength: [10,'A tour name must have more or equal than 20 characters']
    },
    slug: String,
    duration:{
      type:Number,
      required:[true, "A tour must have a duration"]
    },
    maxGroupSize:{
     type:Number,
     required:[true,'A tour must have a group size']
    },
    difficulty:{
      type:String,
      required:[true,'A tour must have a difficulty'],
      enum: {values:['easy','medium','difficult'],message: 'Difficulty is either: easy,medium,difficult'}
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1,'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'The tour must have a price'],
    },
    priceDiscount:{
    type:  Number,
    //custom validator
    validate: {
     validator: function(val){
      //we need to return true and false only from this validator , this only points to current doc on New document creation
      return val<this.price
    },
    message:'Discount price ({VALUE}) should be below regular price'
    } 
    },
    summary:{
      type:String,
      trim:true,
      required: [true, 'A tour must have a description']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required: [true , 'A tour must have a cover image']
    },
    images: [String],
    createdAt:{
      type:Date,
      default: Date.now()
    },
    secretTour:{
      type:Boolean,
      default:false
    },
    startDates:[Date]
  }, 
  //this is the second object that is passed in schema which says virtual to be true 
  {
    toJSON : {
      virtuals: true,
    },
    toObject : {
      virtuals: true
    }
  });


  // i used the regulation fn here to have access to this bcs it will point out 
  // this will not be persist in database but it will be there when we get the data

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7
  })
  
  //this is the pre that is a middleware that will run before save
  //Document middleware: runs before .save()  and .create() not on any else
  tourSchema.pre('save',function (next) {
    //this is the currently processed data
    this.slug = slugify(this.name, {
      lower: true
    })
    //this will call next middleware in the queue
    next();
  })

  //we can use multiple pre middleware
  // tourSchema.pre('save',function (next) {
  //   next();
  // })

  

  //post middleware will perform after all the pre middleware completes
  //over here the function have access to doc and next in the function

  // tourSchema.post("save", function(doc,next){
  // //in here we don't access to this but finished document that was saved
  // console.log(doc)

  // })

  //QUERY MIDDLEWARE
  // /^find/ this is a regex to check all function starting with find 
  tourSchema.pre(/^find/, function (next) {
    // tourSchema.pre('find', function (next) {
    this.find({secretTour: {$ne: true}})
    next()
  })

  //AGGREGATION MIDDLEWARE
  //this middleware is used before a aggreration is run
  tourSchema.pre("aggregate",function(next){
    //to remove all secret tour while we count using aggregation
   this.pipeline().unshift({$match: {secretTour: {$ne:true}}})
   next()
  })
  
  const Tour = mongoose.model('Tour', tourSchema);

  module.exports=Tour

