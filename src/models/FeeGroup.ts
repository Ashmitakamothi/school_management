import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeeGroup extends Document {
    name: string;
    description?: string;
}

const FeeGroupSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
});

const FeeGroup: Model<IFeeGroup> = mongoose.models.FeeGroup || mongoose.model<IFeeGroup>("FeeGroup", FeeGroupSchema);
export default FeeGroup;
