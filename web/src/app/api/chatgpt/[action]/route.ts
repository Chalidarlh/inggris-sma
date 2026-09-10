import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  createMaterial,
  createMaterialSchema,
  getPendingMaterials,
  getPendingMaterialsSchema,
  publishMaterial,
  publishMaterialSchema,
  gradeWritingSubmission,
  gradeWritingSchema,
  approveGrade,
  approveGradeSchema,
} from "@/lib/mcp-logic/tools";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ action: string }> | { action: string } }
) {
  try {
    // Menangani perubahan Next.js 15+ di mana params bisa berupa Promise
    const resolvedParams = await Promise.resolve(context.params);
    const action = resolvedParams.action;

    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    let result;

    switch (action) {
      case "create_material": {
        const input = createMaterialSchema.parse(body);
        result = await createMaterial(input);
        break;
      }
      case "get_pending_materials": {
        const input = getPendingMaterialsSchema.parse(body);
        result = await getPendingMaterials(input);
        break;
      }
      case "publish_material": {
        const input = publishMaterialSchema.parse(body);
        result = await publishMaterial(input);
        break;
      }
      case "grade_writing_submission": {
        const input = gradeWritingSchema.parse(body);
        result = await gradeWritingSubmission(input);
        break;
      }
      case "approve_grade": {
        const input = approveGradeSchema.parse(body);
        result = await approveGrade(input);
        break;
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 404 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`[ChatGPT API Error]`, error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
