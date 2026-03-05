import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import Branch from "@/models/Branch";

export async function GET() {
    await dbConnect();
    try {
        const branches = await Branch.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(branches);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const branch = await Branch.create(body);
        return NextResponse.json(branch, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create branch" }, { status: 500 });
    }
}
