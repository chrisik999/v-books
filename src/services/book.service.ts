import { Book, IBook } from "../models/book.model";

export async function createBook(data: Partial<IBook>): Promise<IBook> {
  const doc = await Book.create(data);
  return doc;
}

export async function listBooks(query: { page?: number; limit?: number }): Promise<{ data: any[]; total: number; page: number; limit: number }>{
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Book.find()
      .skip(skip)
      .limit(limit)
      .populate({ path: "uploadedBy", select: "firstName lastName" })
      .lean(),
    Book.countDocuments(),
  ]);
  return { data, total, page, limit };
}

export async function getBookById(id: string): Promise<IBook | null> {
  return Book.findById(id).populate({ path: "uploadedBy", select: "firstName lastName" }).exec();
}

export async function updateBookById(id: string, updates: Partial<IBook>): Promise<IBook | null> {
  return Book.findByIdAndUpdate(id, { $set: updates }, { new: true }).exec();
}

export async function deleteBookById(id: string): Promise<IBook | null> {
  return Book.findByIdAndDelete(id).exec();
}

export async function deleteBooksByIds(ids: string[]): Promise<{ deletedCount: number }>{
  const res = await Book.deleteMany({ _id: { $in: ids } }).exec();
  return { deletedCount: res.deletedCount || 0 };
}
