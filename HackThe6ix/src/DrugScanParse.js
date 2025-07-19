import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function main() {
    console.log("Image Sent")
    const capturedImage = localStorage.getItem("capturedImage").replace(/^data:image\/png;base64,/, "");;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: capturedImage,
                },
            },
            { text: "The image should be a picture of a medication. From the image, if possible, find the following information and list it in json format: 'drug name', 'din', 'dosage'. If you cannot identify any of the information, return the error message: 'Error: Medication not recognized', if only some information cannot be recognized, you can make the unrecognized information the empty string" },
        ]
    });
    console.log(response.text);
}