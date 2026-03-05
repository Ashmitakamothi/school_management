import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import FeeGroup from "@/models/FeeGroup";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;
    try {
        const body = await req.json();
        const updatedGroup = await FeeGroup.findByIdAndUpdate(id, body, { new: true });
        if (!updatedGroup) {
            return NextResponse.json({ error: "Fee Group not found" }, { status: 404 });
        }
        return NextResponse.json(updatedGroup);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Fee Group name already exists" }, { status: 400 });
        }
        console.error("FeeGroup PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;
    try {
        const deletedGroup = await FeeGroup.findByIdAndDelete(id);
        if (!deletedGroup) {
            return NextResponse.json({ error: "Fee Group not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Fee Group deleted successfully" });
    } catch (error) {
        console.error("FeeGroup DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
