import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IBranch extends Document {
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
    {
        name: { type: String, required: true },
        url: { type: String, required: true },
    },
    { timestamps: true }
);

const Branch = models.Branch || model<IBranch>("Branch", BranchSchema);
export default Branch;
