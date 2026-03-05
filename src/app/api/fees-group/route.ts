import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import FeeGroup from "@/models/FeeGroup";

export async function GET() {
    await dbConnect();
    try {
        const groups = await FeeGroup.find().lean();
        return NextResponse.json(groups);
    } catch (error) {
        console.error("FeeGroup GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const newGroup = await FeeGroup.create(body);
        return NextResponse.json(newGroup, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Fee Group name already exists" }, { status: 400 });
        }
        console.error("FeeGroup POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
