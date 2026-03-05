import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeeDiscount extends Document {
    name: string;
    discount_code: string;
    type: "percentage" | "fixAmount";
    percentage?: number;
    amount?: number;
    use_count: number;
    expiry_date?: Date;
    description?: string;
}

const FeeDiscountSchema: Schema = new Schema({
    name: { type: String, required: true },
    discount_code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["percentage", "fixAmount"], required: true },
    percentage: { type: Number },
    amount: { type: Number },
    use_count: { type: Number, required: true },
    expiry_date: { type: Date },
    description: { type: String },
});

const FeeDiscount: Model<IFeeDiscount> = mongoose.models.FeeDiscount || mongoose.model<IFeeDiscount>("FeeDiscount", FeeDiscountSchema);
export default FeeDiscount;
