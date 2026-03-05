import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import Branch from "@/models/Branch";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = await params;
    try {
        const body = await req.json();
        const branch = await Branch.findByIdAndUpdate(id, body, { new: true });
        if (!branch) return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        return NextResponse.json(branch);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update branch" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = await params;
    try {
        await Branch.findByIdAndDelete(id);
        return NextResponse.json({ message: "Branch deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete branch" }, { status: 500 });
    }
}
