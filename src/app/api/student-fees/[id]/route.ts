import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";
import FeeMaster from "@/models/FeeMaster";
import FeePayment from "@/models/FeePayment";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const studentId = params.id;

        // Fetch student details
        const student = await Student.findById(studentId);
        if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

        // Fetch assigned Fees (Currently based on Class, but could be specific assignments)
        // For simplicity: All FeeMasters matching student's class (or global if we had that logic)
        // In a real system, you'd have a StudentFeeMaster assignment model.
        // Let's assume for now we list all masters and show status.
        const allMasters = await FeeMaster.find()
            .populate("fee_group")
            .populate("fee_type");

        // Fetch payments made by this student
        const payments = await FeePayment.find({ student: studentId });

        return NextResponse.json({
            student,
            masters: allMasters,
            payments
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch student fee status" }, { status: 500 });
    }
}
