import { IBook } from "../models/book.model";
import { BookRepository } from "../repositories/book.repository";

export async function createBook(data: Partial<IBook>): Promise<IBook> {
  const doc = await BookRepository.create(data);
  return doc as IBook;
}

export async function listBooks(query: {
  page?: number;
  limit?: number;
}): Promise<{ data: any[]; total: number; page: number; limit: number }> {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    BookRepository.list({}, page, limit),
    BookRepository.count({}),
  ]);
  return { data, total, page, limit };
}

export async function listBooksByUser(
  userId: string,
  query: { page?: number; limit?: number }
): Promise<{ data: any[]; total: number; page: number; limit: number }> {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const [data, total] = await Promise.all([
    BookRepository.list({ uploadedBy: userId } as any, page, limit),
    BookRepository.count({ uploadedBy: userId } as any),
  ]);
  return { data, total, page, limit };
}

export async function getBookById(id: string): Promise<IBook | null> {
  return BookRepository.findById(id) as any;
}

export async function updateBookById(
  id: string,
  updates: Partial<IBook>
): Promise<IBook | null> {
  return BookRepository.updateById(id, { $set: updates } as any) as any;
}

export async function deleteBookById(id: string): Promise<IBook | null> {
  return BookRepository.deleteById(id) as any;
}

export async function deleteBooksByIds(
  ids: string[]
): Promise<{ deletedCount: number }> {
  const res = await BookRepository.deleteManyByIds(ids);
  return { deletedCount: res.deletedCount || 0 };
}
