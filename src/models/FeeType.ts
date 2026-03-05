import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeeType extends Document {
    name: string;
    fees_code: string;
    description?: string;
}

const FeeTypeSchema: Schema = new Schema({
    name: { type: String, required: true },
    fees_code: { type: String, required: true, unique: true },
    description: { type: String },
});

const FeeType: Model<IFeeType> = mongoose.models.FeeType || mongoose.model<IFeeType>("FeeType", FeeTypeSchema);
export default FeeType;
