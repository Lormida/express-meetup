import { UserDocument } from "../model/user.model";

export class UserDto {
  email: string;
  id: string;
  role: string[]

  constructor(model: UserDocument) {
    this.email = model.email;
    this.id = model._id;
    this.role = model.role;
  }
}
