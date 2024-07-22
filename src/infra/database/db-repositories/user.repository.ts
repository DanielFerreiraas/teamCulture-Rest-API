import { Collection, Db, ObjectId } from "mongodb";
import { PasswordFacade } from "../../adapters/hashPassword/bcrypt/hash-password.adapter";
import { serverError } from "../../settings/utils/helpers";

const collectionName = "users";

export interface UserInput {
  email: string;
  name: string;
  password: string;
  roles: ObjectId[];
}

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles: ObjectId[];
}

export class UserRepository {
  private db: Db;
  private collection: Collection<User>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection(collectionName);
  }

  async create(user: User): Promise<void> {
    try {
      const hashedPassword = PasswordFacade.hash(user.password);
      user.password = hashedPassword;
      user.createdAt = new Date();
      user.updatedAt = new Date();

      await this.collection.insertOne(user);
    } catch (error) {
      serverError("Error create user");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.collection.findOne({ email });
    } catch (error) {
      serverError("Error search user");
      return null;
    }
  }

  async findMany(
    page: number,
    pageSize: number
  ): Promise<{ total: number; data: User[] } | null> {
    try {
      const total = await this.collection.countDocuments();
      const data = await this.collection
        .find({}, { projection: { password: 0 } })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      return { total, data };
    } catch (error) {
      serverError("Error search users");
      return null;
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      const user = await this.collection.findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
      );

      if (!user) {
        return null;
      }

      if (!user.roles) {
        user.roles = [];
      }

      return user;
    } catch (error) {
      serverError("Error search user");
      return null;
    }
  }

  async update(id: string, updatedUser: Partial<User>): Promise<void> {
    try {
      delete updatedUser.password;
      updatedUser.updatedAt = new Date();

      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedUser }
      );
    } catch (error) {
      serverError("Error update user");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      serverError("Error delete user");
    }
  }

  async comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean> {
    try {
      return PasswordFacade.compare(candidatePassword, userPassword);
    } catch (error) {
      serverError("Error compare user password");
      return false;
    }
  }
}
