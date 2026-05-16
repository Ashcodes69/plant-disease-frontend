interface Result {
  crop: string;
  disease: string;
  confidence: number;
  is_healthy: boolean;
}

export default function ResultCard({ result }: { result: Result }) {
  return (
    <div
      className={`
      relative overflow-hidden rounded-2xl p-6 mt-6
      bg-green-dim/90 border
      ${result.is_healthy ? "border-green-bright" : "border-red-500"}
    `}
    >
      {/* Top glow line */}
      <div
        className={`
        absolute top-0 left-0 right-0 h-px
        ${
          result.is_healthy
            ? "bg-gradient-to-r from-transparent via-green-neon to-transparent"
            : "bg-gradient-to-r from-transparent via-red-500 to-transparent"
        }
      `}
      />

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <p className="text-[#7da87d] text-xs uppercase tracking-widest mb-1">
            Crop Detected
          </p>
          <h2 className="font-display text-5xl text-green-neon leading-none">
            {result.crop}
          </h2>
        </div>

        <span
          className={`
          px-4 py-1.5 rounded-full text-sm font-medium border
          ${
            result.is_healthy
              ? "bg-green-bright/20 text-green-neon border-green-bright"
              : "bg-red-500/20 text-red-400 border-red-500"
          }
        `}
        >
          {result.is_healthy ? "✓ Healthy" : "⚠ Diseased"}
        </span>
      </div>

      {/* Disease */}
      <div className="mt-6 p-4 bg-black/30 rounded-xl">
        <p className="text-[#7da87d] text-xs uppercase tracking-widest mb-1">
          Diagnosis
        </p>
        <p className="text-[#e8f5e8] text-xl font-medium">{result.disease}</p>
      </div>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-[#7da87d] text-sm">Confidence</span>
          <span className="text-green-neon text-sm font-mono">
            {result.confidence}%
          </span>
        </div>
        <div className="bg-green-dim rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-mid to-green-neon rounded-full transition-all duration-1000"
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}
