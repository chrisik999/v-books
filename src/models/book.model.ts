import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBook extends Document {
  author: string;
  isbn: string;
  price: number;
  uploadedBy: mongoose.Types.ObjectId;
  genre?: string;
  imagePath?: string;
  pdfPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, index: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    genre: { type: String, trim: true },
    imagePath: { type: String },
    pdfPath: { type: String },
  },
  { timestamps: true }
);

export const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
