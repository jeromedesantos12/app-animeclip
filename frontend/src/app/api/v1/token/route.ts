import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { PayloadType } from "@/types/payload";
import { appError } from "@/lib/error";

export async function GET() {
  try {
    const cookie = cookies();
    const token = (await cookie).get("token")?.value;
    if (token === undefined) {
      throw appError("Token not found in cookies", 401);
    }
    const payload = verifyToken(token);
    return NextResponse.json(
      {
        status: "success",
        message: "Token successfully verified",
        data: payload as PayloadType,
      },
      { status: 200 }
    );
  } catch (err) {
    const errorMessage =
      (err as Error).message || "Token is invalid or expired";
    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
