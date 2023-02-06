import { UserDocument } from "../model/user.model";

export class UserDto {
  email: string;
  id: string;
  roles: string[]

  constructor(model: UserDocument) {
    this.email = model.email;
    this.id = model._id;
    this.roles = model.roles;
  }
}
