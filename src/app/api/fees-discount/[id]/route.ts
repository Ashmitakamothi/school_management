import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import FeeDiscount from "@/models/FeeDiscount";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;
    try {
        const body = await req.json();
        const updatedDiscount = await FeeDiscount.findByIdAndUpdate(id, body, { new: true });
        if (!updatedDiscount) {
            return NextResponse.json({ error: "Fee Discount not found" }, { status: 404 });
        }
        return NextResponse.json(updatedDiscount);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Discount Code already exists" }, { status: 400 });
        }
        console.error("FeeDiscount PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;
    try {
        const deletedDiscount = await FeeDiscount.findByIdAndDelete(id);
        if (!deletedDiscount) {
            return NextResponse.json({ error: "Fee Discount not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Fee Discount deleted successfully" });
    } catch (error) {
        console.error("FeeDiscount DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
