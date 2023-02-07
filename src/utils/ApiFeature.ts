import { FilterQuery } from 'mongoose'

interface TQueryObject {
  sort?: string
  fields?: string
  page?: string
  limit?: string
  partialSearch: string
}

export class APIFeatures<T> {
  excludedFields = ['page', 'sort', 'limit', 'fields']

  constructor(public query: FilterQuery<T>, public queryObject: TQueryObject) {}

  filter = () => {
    const queryObj = { ...this.queryObject }
    //@ts-expect-error fix later
    this.excludedFields.forEach((el) => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    const queryStrParsed = JSON.parse(queryStr)

    if (queryObj.partialSearch && JSON.parse(queryObj.partialSearch)) {
      Object.keys(queryStrParsed).forEach((key) => {
        queryStrParsed[key] = { $regex: queryStrParsed[key] }
      })
    }

    this.query = this.query.find(queryStrParsed)

    return this
  }

  sort = () => {
    this.query = this.queryObject.sort
      ? this.query.sort(this.queryObject.sort.split(',').join(' '))
      : this.query.sort('-createdAt')

    return this
  }

  limitFields = () => {
    this.query = this.queryObject.fields
      ? this.query.select(this.queryObject.fields.split(',').join(' '))
      : this.query.select('-__v')

    return this
  }

  paginate = () => {
    const page = Number(this.queryObject.page) || 1
    const limit = Number(this.queryObject.limit) || 100
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}
