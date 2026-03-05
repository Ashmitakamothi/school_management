import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeeMaster extends Document {
    fee_group: mongoose.Types.ObjectId;
    fee_type: mongoose.Types.ObjectId;
    due_date?: Date;
    amount: number;
    fine_type: "none" | "fixAmount" | "percentage" | "cumulative";
    fine_percentage?: number;
    fine_amount?: number;
}

const FeeMasterSchema: Schema = new Schema({
    fee_group: { type: Schema.Types.ObjectId, ref: "FeeGroup", required: true },
    fee_type: { type: Schema.Types.ObjectId, ref: "FeeType", required: true },
    due_date: { type: Date },
    amount: { type: Number, required: true },
    fine_type: {
        type: String,
        enum: ["none", "fixAmount", "percentage", "cumulative"],
        default: "none"
    },
    fine_percentage: { type: Number },
    fine_amount: { type: Number },
}, { timestamps: true });

// Ensure unique combination of group and type if necessary (Optional based on requirements)
// FeeMasterSchema.index({ fee_group: 1, fee_type: 1 }, { unique: true });

const FeeMaster: Model<IFeeMaster> = mongoose.models.FeeMaster || mongoose.model<IFeeMaster>("FeeMaster", FeeMasterSchema);
export default FeeMaster;
