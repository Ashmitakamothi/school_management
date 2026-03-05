import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import FeeMaster from "@/models/FeeMaster";
import FeeGroup from "@/models/FeeGroup";
import FeeType from "@/models/FeeType";

export async function GET() {
    await dbConnect();
    try {
        // We need to ensure models are registered for population
        // Importing them above usually handles this in Next.js
        const masters = await FeeMaster.find()
            .populate("fee_group", "name")
            .populate("fee_type", "name")
            .lean();
        return NextResponse.json(masters);
    } catch (error) {
        console.error("FeeMaster GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();

        // Validation (simplified, expanded in UI)
        if (!body.fee_group || !body.fee_type || !body.amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newMaster = await FeeMaster.create(body);
        return NextResponse.json(newMaster, { status: 201 });
    } catch (error: any) {
        console.error("FeeMaster POST Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
