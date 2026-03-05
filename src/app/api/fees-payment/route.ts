import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FeePayment from "@/models/FeePayment";

export async function GET() {
    try {
        await dbConnect();
        const payments = await FeePayment.find().populate("student").populate("fee_master");
        return NextResponse.json(payments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const payment = await FeePayment.create(body);
        return NextResponse.json(payment, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create payment" }, { status: 500 });
    }
}
