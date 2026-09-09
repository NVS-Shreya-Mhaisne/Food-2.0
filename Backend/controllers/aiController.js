import { GoogleGenAI } from "@google/genai";
import foodModel from "../models/foodModels.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Helper for retrying on temporary demand spikes (503/429)
async function generateWithRetry(chat, message, retries = 3, delayMs = 1500) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await chat.sendMessage({ message });
        } catch (error) {
            const isTransient = error.status === 503 || error.status === 429;
            if (isTransient && attempt < retries) {
                console.warn(`[Gemini API] Busy status (${error.status}). Retrying in ${delayMs / 1000}s...`);
                await new Promise((res) => setTimeout(res, delayMs));
                delayMs *= 2;
            } else {
                throw error;
            }
        }
    }
}

export const chatWithAi = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        let allFoods = [];
        let menuSummary = "";
        try {
            allFoods = await foodModel.find({}).select("name price category description image restaurantName");
            if (allFoods && allFoods.length > 0) {
                menuSummary = `Current Available Dishes on Cravely Menu:\n` +
                    allFoods.map(f => `- ${f.name} (₹${f.price}) [Category: ${f.category || 'Special'}] - ${f.description || ''}`).join('\n');
            }
        } catch (dbErr) {
            console.warn("Could not load foods for AI context:", dbErr.message);
        }

        const systemInstruction = `You are Cravely AI, an expert culinary nutritionist and intelligent food assistant for the Cravely food ordering platform.
You assist customers with meal planning, diet recommendations (high-protein, keto, low-calorie, vegan), food pairings, and finding dishes from the real menu.

${menuSummary ? `\nHere is the real restaurant menu context you can reference:\n${menuSummary}\n` : ''}

Guidelines:
1. Provide helpful, appetizing, and practical food suggestions.
2. Keep text responses conversational, clean, and nicely formatted.
3. If the user is asking for diet suggestions (e.g., high protein, low calorie, keto, dinner for 2, combos) or asking for recommendations from the menu:
   - Provide a brief conversational breakdown explaining the meal and nutritional benefits.
   - At the VERY END of your response, append a structured JSON block enclosed in \`\`\`json:bundle ... \`\`\` containing:
   \`\`\`json:bundle
   {
     "bundleTitle": "Curated Meal Bundle Name",
     "totalCalories": "620 kcal",
     "totalProtein": "44g",
     "dietTag": "High Protein",
     "servings": 2,
     "recommendedItems": [
       {
         "name": "Exact Name of Dish from Menu",
         "reason": "Why this fits the requirement",
         "estimatedCalories": "310 kcal",
         "estimatedProtein": "22g"
       }
     ]
   }
   \`\`\`
4. When selecting dishes, ALWAYS pick the exact names from the Available Dishes list above so they match the live database.
5. If the query is just a generic question or greeting, answer naturally without the json:bundle block.`;

        const formattedHistory = [];
        if (Array.isArray(history)) {
            for (const item of history.slice(-8)) {
                if (item.sender === 'user' && item.text) {
                    formattedHistory.push({
                        role: 'user',
                        parts: [{ text: item.text }]
                    });
                } else if (item.sender === 'bot' && item.text) {
                    formattedHistory.push({
                        role: 'model',
                        parts: [{ text: item.text }]
                    });
                }
            }
        }

        const chat = ai.chats.create({
            model: "gemini-3.6-flash",
            history: formattedHistory,
            config: {
                systemInstruction
            }
        });

        const aiResponse = await generateWithRetry(chat, message);
        let rawReply = aiResponse.text || "I'm sorry, I couldn't generate a response. Please try again.";

        // Extract structured bundle JSON if present
        let mealBundle = null;
        let cleanedReply = rawReply;
        const bundleRegex = /```json:bundle\s*([\s\S]*?)\s*```/;
        const bundleMatch = rawReply.match(bundleRegex);

        if (bundleMatch) {
            try {
                const parsed = JSON.parse(bundleMatch[1]);
                cleanedReply = rawReply.replace(bundleRegex, '').trim();

                // Enrich bundle items with real database dish details
                if (parsed.recommendedItems && Array.isArray(parsed.recommendedItems)) {
                    const enrichedItems = [];
                    for (const recItem of parsed.recommendedItems) {
                        const dbDish = allFoods.find(f => 
                            f.name.toLowerCase().trim() === (recItem.name || '').toLowerCase().trim() ||
                            f.name.toLowerCase().includes((recItem.name || '').toLowerCase())
                        );
                        if (dbDish) {
                            enrichedItems.push({
                                _id: dbDish._id,
                                name: dbDish.name,
                                price: dbDish.price,
                                image: dbDish.image,
                                category: dbDish.category,
                                restaurantName: dbDish.restaurantName,
                                reason: recItem.reason,
                                estimatedCalories: recItem.estimatedCalories,
                                estimatedProtein: recItem.estimatedProtein
                            });
                        }
                    }

                    if (enrichedItems.length > 0) {
                        const calculatedTotal = enrichedItems.reduce((sum, item) => sum + (item.price || 0), 0);
                        mealBundle = {
                            bundleTitle: parsed.bundleTitle || "Chef's Recommended Combo",
                            totalCalories: parsed.totalCalories || "550 kcal",
                            totalProtein: parsed.totalProtein || "30g",
                            dietTag: parsed.dietTag || "Custom Meal Plan",
                            servings: parsed.servings || 1,
                            totalPrice: calculatedTotal,
                            items: enrichedItems
                        };
                    }
                }
            } catch (jsonErr) {
                console.warn("Could not parse json:bundle block:", jsonErr.message);
            }
        }

        // Also identify individual matching dishes mentioned anywhere in reply
        const matchedDishes = (allFoods || []).filter(dish => {
            if (!dish.name) return false;
            const regex = new RegExp(`\\b${dish.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(rawReply);
        }).slice(0, 4);

        return res.json({
            success: true,
            reply: cleanedReply,
            suggestedDishes: matchedDishes,
            mealBundle: mealBundle
        });

    } catch (error) {
        console.error("AI Chat Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to process AI request"
        });
    }
};

// Multimodal Food Image Analyzer
export const analyzeFoodImage = async (req, res) => {
    try {
        const { imageBase64, mimeType = "image/jpeg" } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ success: false, message: "Image base64 data is required" });
        }

        let allFoods = [];
        let menuSummary = "";
        try {
            allFoods = await foodModel.find({}).select("name price category description image restaurantName");
            if (allFoods && allFoods.length > 0) {
                menuSummary = `Available Menu Dishes:\n` +
                    allFoods.map(f => `- ${f.name} (₹${f.price}) [Category: ${f.category || 'Special'}]`).join('\n');
            }
        } catch (dbErr) {
            console.warn("Could not load foods for vision context:", dbErr.message);
        }

        const promptText = `Examine this food photo.
1. Identify what food / dish this is.
2. Estimate the nutritional content: calories, protein, carbs, fat, and dietary tags (e.g. Vegetarian, Non-Veg, High-Protein, Vegan).
3. From our restaurant menu below, find the top 1 to 3 closest matching dishes that the user can order right now.
${menuSummary ? `\nOur Menu Context:\n${menuSummary}\n` : ''}

Respond with:
1. A 2-3 sentence overview of the identified dish and nutritional breakdown.
2. End with a JSON block in \`\`\`json:bundle ... \`\`\` format:
\`\`\`json:bundle
{
  "bundleTitle": "Closest Menu Match",
  "totalCalories": "Estimated Total",
  "totalProtein": "Estimated Protein",
  "dietTag": "Dietary Classification",
  "recommendedItems": [
    {
      "name": "Exact matching dish name from our menu",
      "reason": "Why this matches your image",
      "estimatedCalories": "Calories",
      "estimatedProtein": "Protein"
    }
  ]
}
\`\`\``;

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: promptText },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }
            ]
        });

        let rawReply = response.text || "I was able to analyze the food image.";
        let mealBundle = null;
        let cleanedReply = rawReply;
        const bundleRegex = /```json:bundle\s*([\s\S]*?)\s*```/;
        const bundleMatch = rawReply.match(bundleRegex);

        if (bundleMatch) {
            try {
                const parsed = JSON.parse(bundleMatch[1]);
                cleanedReply = rawReply.replace(bundleRegex, '').trim();

                if (parsed.recommendedItems && Array.isArray(parsed.recommendedItems)) {
                    const enrichedItems = [];
                    for (const recItem of parsed.recommendedItems) {
                        const dbDish = allFoods.find(f => 
                            f.name.toLowerCase().trim() === (recItem.name || '').toLowerCase().trim() ||
                            f.name.toLowerCase().includes((recItem.name || '').toLowerCase())
                        );
                        if (dbDish) {
                            enrichedItems.push({
                                _id: dbDish._id,
                                name: dbDish.name,
                                price: dbDish.price,
                                image: dbDish.image,
                                category: dbDish.category,
                                restaurantName: dbDish.restaurantName,
                                reason: recItem.reason,
                                estimatedCalories: recItem.estimatedCalories,
                                estimatedProtein: recItem.estimatedProtein
                            });
                        }
                    }

                    if (enrichedItems.length > 0) {
                        mealBundle = {
                            bundleTitle: parsed.bundleTitle || "Visual Menu Match",
                            totalCalories: parsed.totalCalories || "480 kcal",
                            totalProtein: parsed.totalProtein || "25g",
                            dietTag: parsed.dietTag || "Visual Discovery",
                            servings: 1,
                            totalPrice: enrichedItems.reduce((sum, item) => sum + (item.price || 0), 0),
                            items: enrichedItems
                        };
                    }
                }
            } catch (err) {
                console.warn("Could not parse vision bundle:", err);
            }
        }

        const matchedDishes = (allFoods || []).filter(dish => {
            if (!dish.name) return false;
            const regex = new RegExp(`\\b${dish.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(rawReply);
        }).slice(0, 3);

        return res.json({
            success: true,
            reply: cleanedReply,
            suggestedDishes: matchedDishes,
            mealBundle: mealBundle
        });

    } catch (error) {
        console.error("AI Vision Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to analyze food image"
        });
    }
};
