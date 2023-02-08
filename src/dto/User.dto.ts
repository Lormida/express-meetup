import { UserDocument } from '../model/user.model'

export class UserDto {
  id: string
  email: string
  name: string
  roles: [{ value: 'USER' | 'ADMIN' }]
  createdAt: Date
  updatedAt: Date

  constructor(model: UserDocument) {
    this.id = model._id
    this.email = model.email
    this.name = model.name
    this.roles = model.roles
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
  }
}
