import { UserDocument } from '../model/user.model'
import { UserRole } from '../schema/user/user.schema'

export class UserDTO {
  id: string
  email: string
  name: string
  roles: [{ value: keyof typeof UserRole }]
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
