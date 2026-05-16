import classesJson from "@/models/classes.json";

// Build crop → diseases map from classes.json
function buildClassMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const label of classesJson) {
    const [crop, disease] = label.split("_");
    if (!map[crop]) map[crop] = [];
    map[crop].push(disease);
  }
  return map;
}

export default function SupportedPage() {
  const CLASSES = buildClassMap();
  const totalDiseases = Object.values(CLASSES).flat().length;

  return (
    <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <p className="text-green-bright text-xs tracking-[0.3em] uppercase mb-2">
        Coverage
      </p>
      <h1
        className="font-display text-green-neon mb-2"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        Supported Plants
      </h1>
      <p className="text-[#7da87d] mb-12 text-sm">
        Our model supports {Object.keys(CLASSES).length} crops and{" "}
        {totalDiseases} conditions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(CLASSES).map(([crop, diseases]) => (
          <div
            key={crop}
            className="bg-green-dim/80 border border-green-dark rounded-2xl p-6 hover:border-green-mid transition-colors duration-300"
          >
            <h2 className="font-display text-2xl text-green-neon mb-4">
              {crop}
            </h2>
            <ul className="flex flex-col gap-2">
              {diseases.map((disease) => (
                <li key={disease} className="flex items-center gap-2 text-sm">
                  <span
                    className={
                      disease === "Healthy"
                        ? "text-green-bright"
                        : "text-green-mid"
                    }
                  >
                    {disease === "Healthy" ? "✓" : "•"}
                  </span>
                  <span
                    className={
                      disease === "Healthy"
                        ? "text-green-bright"
                        : "text-[#7da87d]"
                    }
                  >
                    {disease}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
