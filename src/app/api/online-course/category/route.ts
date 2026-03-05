import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CourseCategory from "@/models/CourseCategory";

export async function GET() {
    try {
        await dbConnect();
        const categories = await CourseCategory.find().sort({ created_at: -1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const category = await CourseCategory.create(body);
        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { _id, ...updateData } = body;
        if (!_id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const updated = await CourseCategory.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await CourseCategory.findByIdAndDelete(id);
        return NextResponse.json({ message: "Category deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
