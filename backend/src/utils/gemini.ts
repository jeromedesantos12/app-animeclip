import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";
const prompt = `
  Anda adalah pakar identifikasi anime. Tugas Anda adalah menganalisis gambar cuplikan (screenshot) anime yang saya berikan, dan mengembalikan semua informasi terkait dalam format JSON yang spesifik.

  **Instruksi Ketat:**
  1.  **Bahasa:**   Output Anda harus dalam bahasa Indonesia.
  2.  **Format Wajib:** Keluaran Anda HANYA boleh berupa satu objek JSON MURNI. JANGAN sertakan teks, penjelasan, atau blok kode (seperti json) di luar objek JSON tersebut.
  3.  **Tipe Data Wajib:**
      * **title, episode_title, summary:** Harus berupa STRING.
      * **episode_no:** Harus berupa NUMBER (Integer atau Float).
      * **clip_time:** Harus berupa **STRING** dalam format durasi **MM:SS** (Menit:Detik). Contoh: '03:45' atau '11:00'.

  **Skema JSON Output (Gunakan Tipe Data Murni/Raw):**
  {
    "title": "Nama Lengkap Judul Anime",
    "episode_no": 4, // Angka MURNI, tanpa tanda kutip STRING
    "episode_title": "Judul Episode",
    "clip_time": "11:00", // <--- PERUBAHAN DI SINI: String MM:SS
    "summary": "Ringkasan singkat tentang adegan ini, maksimal 2 kalimat"
  }
`;

function fileToGenerativePart(
  buffer: { toString: (arg0: string) => any },
  mimeType: any
) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

export async function generateContent(
  buffer: { toString: (arg0: string) => any },
  mimeType: any
) {
  return await ai.models.generateContent({
    model: model,
    contents: [fileToGenerativePart(buffer, mimeType), prompt],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          episode_no: {
            type: "NUMBER",
            description:
              "Nomor episode dalam format angka (integer atau float), misal 1.0 atau 12.5.",
          },
          episode_title: { type: "STRING" },
          clip_time: {
            type: "STRING",
            description:
              "Waktu cuplikan dalam format string durasi MM:SS. Contoh: '11:00'.",
          },
          summary: { type: "STRING" },
        },
        required: [
          "title",
          "episode_no",
          "episode_title",
          "clip_time",
          "summary",
        ],
      },
    },
  });
}
