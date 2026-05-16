"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import ResultCard from "@/components/ResultCard";

interface Result {
  crop: string;
  disease: string;
  confidence: number;
  is_healthy: boolean;
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File, prev: string) => {
    setImage(file);
    setPreview(prev);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", image);
      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black-base">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-5 pb-12 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-mid/10 blur-3xl pointer-events-none" />

        <p className="text-green-bright text-xs tracking-[0.3em] uppercase mb-4">
          AI — Powered Detection
        </p>
        <h1
          className="font-display leading-[0.9] mb-6"
          style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
        >
          <span className="text-green-neon">Detect</span>{" "}
          <span className="text-[#e8f5e8]">Plant</span>
          <br />
          <span className="text-[#e8f5e8]">Disease</span>{" "}
          <span className="text-green-mid">Instantly</span>
        </h1>
        <p className="text-[#7da87d] max-w-md mx-auto mb-8 leading-relaxed text-sm">
          Upload a photo of any leaf and our model will instantly identify the
          crop and diagnose any disease with 99%+ accuracy.
        </p>
        <Link
          href="/supported"
          className="inline-block px-5 py-2 border border-green-mid rounded-full text-green-bright text-xs tracking-wider hover:border-green-bright transition-colors"
        >
          View supported plants →
        </Link>
      </section>

      {/* Upload */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <ImageUploader onImageSelect={handleImageSelect} />

        {preview && (
          <div className="mt-6 rounded-xl overflow-hidden border border-green-dark">
            <img
              src={preview}
              alt="Uploaded leaf"
              className="w-full max-h-80 object-cover"
            />
          </div>
        )}

        {image && (
          <button
            onClick={handlePredict}
            disabled={loading}
            className={`
              w-full mt-6 py-4 rounded-xl font-display text-xl tracking-widest transition-all duration-300
              ${
                loading
                  ? "bg-green-dark text-[#7da87d] cursor-not-allowed"
                  : "bg-gradient-to-r from-green-mid to-green-bright text-black-base hover:opacity-90 cursor-pointer"
              }
            `}
          >
            {loading ? "Analyzing Leaf..." : "Analyze Leaf →"}
          </button>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-400 text-sm">
            ⚠ {error}
          </div>
        )}

        {result && <ResultCard result={result} />}
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-6 border-t border-green-dim text-[#7da87d] text-xs">
        LeafScan — Built with PyTorch + Next.js · 99% accuracy on 29 plant
        diseases
      </footer>
    </main>
  );
}
