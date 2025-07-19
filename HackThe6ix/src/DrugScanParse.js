import { GoogleGenAI } from "@google/genai";
import { Drug } from "./Objects.js"

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function main() {

    testFetchBackend()
    
    console.log("Image Sent");
    const capturedImage = localStorage.getItem("capturedImage").replace(/^data:image\/png;base64,/, "");
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: capturedImage,
                },
            },
            { text: "The image should be a picture of a medication. From the image, if possible, return only the din number with no formatting, only the number" },
        ]
    });
    console.log(response.text);

    const din = response.text;
    const drugProductData = await fetchDrugProduct(din);
    const id = drugProductData[0]?.drug_code;
    const drugFormData = await fetchDrugForm(id);
    const drugIngredientData = await fetchDrugIngredient(id);

    const drug = new Drug(
        drugProductData[0]?.brand_name || "",
        drugIngredientData[0]?.ingredient_name || "",
        Number(drugProductData[0]?.drug_identification_number) || "",
        drugFormData[0]?.pharmaceutical_form_name || "",
        "", // dosage
        "", // frequency
        "", // category
        "", // start_date
        "", // end_date
        ""  // notes
    );

    return drug;

    async function fetchDrugProduct(din) {
        const url = `https://health-products.canada.ca/api/drug/drugproduct/?din=${din}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }

    async function fetchDrugForm(id) {
        const url = `https://health-products.canada.ca/api/drug/form/?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }

    async function fetchDrugIngredient(id) {
        const url = `https://health-products.canada.ca/api/drug/activeingredient/?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }

}