import { NextRequest, NextResponse } from "next/server";

const HF_API = "https://ashcodes0007-plant-disease-api.hf.space/predict";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file)
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    if (!file.type.startsWith("image/"))
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );

    const hfForm = new FormData();
    hfForm.append("file", file);

    const res = await fetch(HF_API, { method: "POST", body: hfForm });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Prediction error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
