import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Sitemaker.UA — Створюємо сайти, що продають";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(filename: string) {
  const path = join(process.cwd(), "src/app/_fonts", filename);
  return readFile(path);
}

export default async function Image() {
  const [serif, serifItalic] = await Promise.all([
    loadFont("InstrumentSerif-Regular.ttf"),
    loadFont("InstrumentSerif-Italic.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f8f5f0",
          color: "#1f1b2e",
          fontFamily: "Serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -180,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(184,164,227,0.55), rgba(168,218,196,0.25) 55%, rgba(248,245,240,0) 75%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -160,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(255,181,167,0.4), rgba(248,245,240,0) 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "#1f1b2e",
              color: "#f8f5f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            ↗
          </div>
          <div
            style={{
              fontSize: 44,
              letterSpacing: -0.5,
              display: "flex",
            }}
          >
            Sitemaker
            <span style={{ color: "#7c5cff" }}>.UA</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 104,
              lineHeight: 1.05,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            Створюємо
          </div>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1.05,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            <span style={{ fontStyle: "italic", color: "#7c5cff" }}>
              сайти,
            </span>
            <span>&nbsp;що продають</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#6b6577",
              maxWidth: 880,
              lineHeight: 1.4,
              display: "flex",
              marginTop: 12,
            }}
          >
            Веб-студія повного циклу. Дизайн, код, SEO, хостинг — від ідеї до запуску.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            fontSize: 26,
            color: "#6b6577",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#a8dac4",
                }}
              />
              Україна
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#b8a4e3",
                }}
              />
              Європа
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ffb5a7",
                }}
              />
              Від 5 000 грн
            </span>
          </div>
          <div
            style={{
              padding: "16px 32px",
              borderRadius: 999,
              background: "#1f1b2e",
              color: "#f8f5f0",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 24,
            }}
          >
            sitemaker-ua.vercel.app →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Serif", data: serif, style: "normal", weight: 400 },
        { name: "Serif", data: serifItalic, style: "italic", weight: 400 },
      ],
    },
  );
}
