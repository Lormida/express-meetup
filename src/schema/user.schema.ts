import { object, string, array, TypeOf } from "zod";

const payload = {
  body: object({
    email: string({
      required_error: "Email is required field"
    }).email({ message: "Invalid email address" }),
    nickname: string({
      required_error: "A meetup must have a description",
    })
      .min(3, "Nickname should be at least 2 characters long")
      .max(30, "Nickname should be less than 30 characters long"),
    password: string({
      required_error: "Password is required field",
    })
      .min(6, "Password should be at least 6 characters long")
      .max(20, "Password should be less than 20 characters long"),
    role: array(string({
      required_error: "A meetup must have role",
    })).min(1),
  }),
};


export const createUserSchema = object({
  ...payload,
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
