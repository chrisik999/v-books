import { QueryFilter, UpdateQuery } from "mongoose";
import { Book, IBook } from "../models/book.model";

export const BookRepository = {
  create: (data: Partial<IBook>) => Book.create(data),

  findById: (id: string) =>
    Book.findById(id)
      .populate({ path: "uploadedBy", select: "firstName lastName" })
      .exec(),

  findOne: (filter: QueryFilter<IBook>) =>
    Book.findOne(filter)
      .populate({ path: "uploadedBy", select: "firstName lastName" })
      .exec(),

  list: (filter: QueryFilter<IBook> = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "uploadedBy", select: "firstName lastName" })
      .exec();
  },

  count: (filter: QueryFilter<IBook> = {}) =>
    Book.countDocuments(filter).exec(),

  findMany: (filter: QueryFilter<IBook>) => Book.find(filter).exec(),

  updateById: (id: string, updates: UpdateQuery<IBook>) =>
    Book.findByIdAndUpdate(id, updates, { new: true })
      .populate({ path: "uploadedBy", select: "firstName lastName" })
      .exec(),

  deleteById: (id: string) => Book.findByIdAndDelete(id).exec(),

  deleteMany: (filter: QueryFilter<IBook>) => Book.deleteMany(filter).exec(),

  deleteManyByIds: (ids: string[]) =>
    Book.deleteMany({ _id: { $in: ids } }).exec(),
};
