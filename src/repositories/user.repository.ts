import { Model, UpdateQuery, QueryFilter } from "mongoose";
import { IUser, User } from "../models/user.model";

export class UserRepository {
  constructor(private model: Model<IUser> = User) {}

  async getById(id: string) {
    return this.model.findById(id).lean().exec();
  }

  async findOne(filter: QueryFilter<IUser>) {
    return this.model.findOne(filter).lean().exec();
  }

  async list(filter: QueryFilter<IUser>, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit).lean().exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return { data, total, page, limit };
  }

  async updateById(id: string, update: UpdateQuery<IUser>) {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .lean()
      .exec();
  }

  async deleteById(id: string) {
    return this.model.findByIdAndDelete(id).lean().exec();
  }
}

export const userRepository = new UserRepository();
