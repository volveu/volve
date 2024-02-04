import { z } from "zod";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & object;

type Id = string;
type Name = string;
type AboutMe = string | null;
type PhoneNumber = string | null;
type Email = string;
type Image = string | null;
type Password = string;
type UserRole = "USER" | "ADMIN";
type User = {
  id: Id;
  name: Name;
  aboutMe: AboutMe;
  phoneNum: PhoneNumber;
  email: Email;
  image: Image;
  password: Password;
  role: UserRole;
};

// zod object does stricter runtime validation of types compared to
// typescript's type in `import { type User } from "@prisma-db-psql/client`
// --- requires manual updating when schema changes
const id_z = z.string().min(1);
const name_z = z.string().min(1).max(100);
const aboutMe_z = z.string().max(300).nullable();
const phoneNum_z = z.string().nullable();
const email_z = z.string().email().min(1).max(100);
const emailVerified_z = z.date().nullable();
const image_z = z.string().nullable();
const password_z = z.string().min(6);
const role_z = z.enum(["USER", "ADMIN"]).nullable();
const user_z = z.object({
  id: id_z,
  name: name_z,
  email: email_z,
  aboutMe: aboutMe_z,
  phoneNum: phoneNum_z,
  password: password_z,
  image: image_z,
  role: role_z,
});

export type { User, UserRole, Id, Name, AboutMe, PhoneNumber, Email, Password };
export {
  user_z,
  id_z,
  name_z,
  aboutMe_z,
  phoneNum_z,
  email_z,
  emailVerified_z,
  image_z,
  password_z,
  role_z,
};
