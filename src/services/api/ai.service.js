export const getImageCaptionUsingAI = async (payload) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch image caption");
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const getImageNameUsingAI = async (payload) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Server busy. Failed to fetch image name.");
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const getImageDescriptionUsingAI = async (payload) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Server busy. Failed to fetch image description.");
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const predictNFTRarity = async (payload) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<s>[INST] Based on this NFT image caption: "${payload.caption}" and description: "${payload.description}", 
            rate its potential rarity and value on a scale of 1-100. Explain why in 3 short bullet points.
            Format as JSON with fields: score, reasons (array of 3 strings). [/INST]`,
          parameters: { max_new_tokens: 250, temperature: 0.7 },
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to predict NFT rarity");
    } else {
      const data = await response.json();

      // Parse the AI response to extract structured data
      try {
        const responseText = data[0]?.generated_text || "";
        const cleanText = responseText
          .replace(/<s>\[INST\].*?\[\/INST\]\s*/gs, "")
          .trim();

        // Try to find JSON in the response
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          return {
            score: parsedData.score || 50,
            reasons: parsedData.reasons || [],
          };
        }

        // Fallback parsing if JSON isn't found
        const scoreMatch = cleanText.match(/score[:\s]+(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;

        const reasonsMatch = cleanText.match(/reasons[:\s]+([\s\S]+)/i);
        let reasons = [];
        if (reasonsMatch) {
          reasons = reasonsMatch[1]
            .split(/[\n•\-]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .slice(0, 3);
        }

        return {
          score,
          reasons:
            reasons.length > 0
              ? reasons
              : [
                  "Unique artistic elements",
                  "Market demand for this style",
                  "Limited supply potential",
                ],
        };
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        return {
          score: 50,
          reasons: [
            "Unique artistic elements",
            "Market demand for this style",
            "Limited supply potential",
          ],
        };
      }
    }
  } catch (error) {
    console.error("Error predicting NFT rarity:", error);
    throw error;
  }
};
