import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
async function sendWithRetry(chat, userMessage, retries = 3, delayMs = 1500) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await chat.sendMessage({ message: userMessage });
        } catch (error) {
            const isTransient = error.status === 503 || error.status === 429;
            if (isTransient && attempt < retries) {
                console.log(`\n⏳ Server busy. Retrying in ${delayMs / 1000}s...`);
                await new Promise((res) => setTimeout(res, delayMs));
                delayMs *= 2;
            } else {
                throw error;
            }
        }
    }
}

async function startChat() {
    const rl = readline.createInterface({ input, output });

    console.log("Ask any question (type 'exit' to quit):\n");

    try {
        const chat = ai.chats.create({
            model: "gemini-3.6-flash"
        });

        while (true) {
            const question = await rl.question("You: ");

            if (!question.trim()) continue;
            if (["exit", "quit", "q"].includes(question.trim().toLowerCase())) {
                break;
            }

            console.log("\nThinking...");
            try {
                const response = await sendWithRetry(chat, question);
                console.log(`AI: ${response.text}\n`);
            } catch (error) {
                console.error("❌ Error:", error.message || error, "\n");
            }
        }
    } catch (err) {
        console.error("Failed to start session:", err.message || err);
    } finally {
        rl.close();
    }
}

startChat();