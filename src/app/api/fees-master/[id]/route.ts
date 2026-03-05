import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import FeeMaster from "@/models/FeeMaster";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = await params;
    try {
        const body = await req.json();
        const updated = await FeeMaster.findByIdAndUpdate(id, body, { new: true });
        if (!updated) {
            return NextResponse.json({ error: "Fee Master not found" }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("FeeMaster PUT Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = await params;
    try {
        const deleted = await FeeMaster.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Fee Master not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("FeeMaster DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
