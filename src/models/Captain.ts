import mongoose, { Schema, Document } from "mongoose";

export interface ICaptain extends Document {
  name: string;
  phone: string;
  vehicleType: "bike" | "car" | "van";
  status: "active" | "inactive";
  availability: "online" | "offline";
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
}

const CaptainSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    vehicleType: { type: String, enum: ["bike", "car", "van"], required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    availability: { type: String, enum: ["online", "offline"], default: "offline" },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  },
);

CaptainSchema.index({ phone: 1 }, { unique: true });
CaptainSchema.index({ status: 1 });
CaptainSchema.index({ availability: 1 });
CaptainSchema.index({ vehicleType: 1 });

export default mongoose.model<ICaptain>("Captain", CaptainSchema);
