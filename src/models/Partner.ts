import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IPartner extends Document {
  name: string;
  apiKey: string;
  apiKeyPrefix: string;
  isActive: boolean;
}

interface IPartnerModel extends Model<IPartner> {
  findByRawApiKey(rawKey: string): Promise<IPartner | null>;
}

const PartnerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    apiKey: { type: String, required: true },
    apiKeyPrefix: { type: String, required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

PartnerSchema.index({ isActive: 1 });

PartnerSchema.statics.findByRawApiKey = async function (rawKey: string): Promise<IPartner | null> {
  const prefix = rawKey.slice(0, 8);
  const candidates = await this.find({ apiKeyPrefix: prefix, isActive: true });
  for (const partner of candidates) {
    if (await bcrypt.compare(rawKey, partner.apiKey)) return partner;
  }
  return null;
};

export default mongoose.model<IPartner, IPartnerModel>("Partner", PartnerSchema);
