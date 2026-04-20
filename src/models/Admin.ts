import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  comparePassword(plain: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

AdminSchema.pre<IAdmin>("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

AdminSchema.methods.comparePassword = function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model<IAdmin>("Admin", AdminSchema);
