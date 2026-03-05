import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import FeeType from "@/models/FeeType";

export async function GET() {
    await dbConnect();
    try {
        const types = await FeeType.find().lean();
        return NextResponse.json(types);
    } catch (error) {
        console.error("FeeType GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const newType = await FeeType.create(body);
        return NextResponse.json(newType, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Fee Code already exists" }, { status: 400 });
        }
        console.error("FeeType POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
