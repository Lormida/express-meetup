import { FilterQuery } from 'mongoose'
interface TQueryObject {
  sort?: string
  fields?: string
  page?: string
  limit?: string
}

export class APIFeatures<T> {
  constructor(public query: FilterQuery<T>, public queryObject: TQueryObject) {}

  filter() {
    const queryObj = { ...this.queryObject }
    console.log('queryObj', queryObj)

    const excludedFields = ['page', 'sort', 'limit', 'fields']
    //@ts-expect-error fix later
    excludedFields.forEach((el) => delete queryObj[el])

    //  Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    console.log('queryString:', queryStr)

    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  sort() {
    // sort = <field 1>,<field 2>,..,<field N>
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }

    return this
  }

  paginate() {
    const page = Number(this.queryObject.page) * 1 || 1
    const limit = Number(this.queryObject.limit) * 1 || 100
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}
