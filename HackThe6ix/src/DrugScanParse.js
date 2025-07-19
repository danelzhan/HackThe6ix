import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Convert Base64 string to Blob
function base64ToBlob(base64, mime = "image/png") {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
}

async function blobToUint8Array(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

export async function main(image) {
    console.log("clicked");
    // If image is a base64 string, convert to Blob first
    let blob;
    if (typeof image === "string") {
        blob = base64ToBlob(image);
    } else {
        blob = image;
    }
    const imageBytes = await blobToUint8Array(blob);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    { text: "Describe this image." },
                    { inline_data: { mime_type: "image/png", data: imageBytes } }
                ]
            }
        ]
    });
    console.log(response.text);
}