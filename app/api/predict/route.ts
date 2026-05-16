import classes from "@/models/classes.json";
import { NextRequest, NextResponse } from "next/server";
import * as ort from "onnxruntime-node";
import sharp from "sharp";
import path from "path";

const MEAN = [0.4701, 0.4961, 0.4185];
const STD = [0.1979, 0.1747, 0.214];

let session: ort.InferenceSession | null = null;

async function getSession() {
  if (!session) {
    const modelPath = path.join(
      process.cwd(),
      "models",
      "plant_disease_model.onnx",
    );
    session = await ort.InferenceSession.create(modelPath);
  }
  return session;
}

async function preprocessImage(buffer: Buffer): Promise<ort.Tensor> {
  const { data, info } = await sharp(buffer)
    .resize(224, 224)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Float32Array(channels * width * height);

  for (let i = 0; i < width * height; i++) {
    pixels[0 * width * height + i] =
      (data[i * channels + 0] / 255 - MEAN[0]) / STD[0];
    pixels[1 * width * height + i] =
      (data[i * channels + 1] / 255 - MEAN[1]) / STD[1];
    pixels[2 * width * height + i] =
      (data[i * channels + 2] / 255 - MEAN[2]) / STD[2];
  }
  return new ort.Tensor("float32", pixels, [1, 3, height, width]);
}

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / sum);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tensor = await preprocessImage(buffer);
    const sess = await getSession();
    const feeds = { input: tensor };
    const results = await sess.run(feeds);

    const outputData = Array.from(results["output"].data as Float32Array);
    const probs = softmax(outputData);
    const predIdx = probs.indexOf(Math.max(...probs));
    const confidence = parseFloat((probs[predIdx] * 100).toFixed(2));

    const predicted = classes[predIdx];
    const [crop, disease] = predicted.split("_");

    return NextResponse.json({
      crop,
      disease,
      confidence,
      is_healthy: disease.toLowerCase() === "healthy",
    });
  } catch (err) {
    console.error("Prediction error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
