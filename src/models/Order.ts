import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  region: string;
  fullAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'created' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  captainId: mongoose.Types.ObjectId | null;
  partnerId: mongoose.Types.ObjectId | null;
  externalReference: string | null;
}

const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  region: { type: String, required: true },
  fullAddress: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['created', 'assigned', 'picked_up', 'delivered', 'cancelled'],
    default: 'created'
  },
  captainId: { type: Schema.Types.ObjectId, ref: 'Captain', default: null },
  partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', default: null },
  externalReference: { type: String, default: null }
}, {
  timestamps: true
});

OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ region: 1 });
OrderSchema.index({ captainId: 1 });
OrderSchema.index({ partnerId: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderNumber: 'text', customerName: 'text', customerPhone: 'text' });
OrderSchema.index({ partnerId: 1, externalReference: 1 }, { unique: true, sparse: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
