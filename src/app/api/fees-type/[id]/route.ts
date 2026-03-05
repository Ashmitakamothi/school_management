import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import FeeType from "@/models/FeeType";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;
    try {
        const body = await req.json();
        const updatedType = await FeeType.findByIdAndUpdate(id, body, { new: true });
        if (!updatedType) {
            return NextResponse.json({ error: "Fee Type not found" }, { status: 404 });
        }
        return NextResponse.json(updatedType);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Fee Code already exists" }, { status: 400 });
        }
        console.error("FeeType PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;
    try {
        const deletedType = await FeeType.findByIdAndDelete(id);
        if (!deletedType) {
            return NextResponse.json({ error: "Fee Type not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Fee Type deleted successfully" });
    } catch (error) {
        console.error("FeeType DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
