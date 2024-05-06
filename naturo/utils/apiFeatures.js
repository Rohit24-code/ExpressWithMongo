class APIFeatures {
    constructor(query, queryFromRoute) {
      this.query = query;
      this.queryString = queryFromRoute;
    }
  
    filter() {
      let reqQuery = { ...this.queryString };
  
      const excludeQuery = ['limit', 'offset', 'page', 'sort'];
  
      excludeQuery.forEach((element) => delete reqQuery[element]);
  
      // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals("easy")
  
      // 21B. Advance Filter
      let stringQuery = JSON.stringify(reqQuery);
      reqQuery = stringQuery.replace(
        /\b(lt|lte|gt|gte)\b/g,
        (word) => `$${word}`,
      );
  
      this.query = this.query.find(JSON.parse(reqQuery));
  
      return this;
      // let query = Tour.find(JSON.parse(reqQuery));
    }
  
    sort() {
      if (this.queryString.sort) {
        let sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        //   // console.log(req.query.fields)
        let fields = req.query.fields.split(',').join(' ');
        // console.log(fields,"fields")
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    paginate() {
      if (this.queryString.page || this.queryString.limit) {
        let page = this.queryString.page * 1 || 1;
        let limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        console.log(limit, skip, 'limit,skip');
        this.query = this.query.skip(skip).limit(limit);
      }
      return this;
    }
  }

  module.exports= APIFeatures