import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import FeeDiscount from "@/models/FeeDiscount";

export async function GET() {
    await dbConnect();
    try {
        const discounts = await FeeDiscount.find().lean();
        return NextResponse.json(discounts);
    } catch (error) {
        console.error("FeeDiscount GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const newDiscount = await FeeDiscount.create(body);
        return NextResponse.json(newDiscount, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Discount Code already exists" }, { status: 400 });
        }
        console.error("FeeDiscount POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
