import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { url, language = "English" } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let rawText = "";

    // 1. Extract Text
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      try {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
        const videoId = match ? match[1] : null;
        
        if (!videoId) {
           return NextResponse.json({ error: "Invalid YouTube URL format." }, { status: 400 });
        }
        
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        rawText = transcript.map(t => t.text).join(" ");
      } catch (e: any) {
        console.error("Transcript Error:", e.message);
        return NextResponse.json({ 
          error: `Transcript Error: ${e.message || "Ensure the video has CC enabled."} (Shorts often do not have CC).` 
        }, { status: 400 });
      }
    } else if (url.includes("instagram.com/reel") || url.includes("instagram.com/p")) {
      // For MVP: Check for a RapidAPI or Apify key, if not present, use a mock caption for testing.
      if (process.env.INSTAGRAM_SCRAPER_API_KEY) {
        // Implement real scraper API call here
        rawText = "Mocked API response because real implementation depends on the exact API chosen.";
      } else {
        console.warn("No INSTAGRAM_SCRAPER_API_KEY found. Using mock data for Instagram Reel.");
        rawText = `
        Here is a quick and healthy Avocado Toast recipe! 
        You'll need 1 ripe avocado, 2 slices of sourdough bread, a pinch of salt, 1 tablespoon of olive oil, and some chili flakes.
        First, toast your sourdough bread until golden brown.
        Next, mash the avocado in a bowl with a fork. Spread the mashed avocado evenly onto the toasted bread.
        Drizzle the olive oil on top, and finish with a sprinkle of salt and chili flakes! Enjoy!
        `;
      }
    } else {
       return NextResponse.json({ 
         error: "Currently, only YouTube and Instagram links are supported." 
       }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: "Server Error: GEMINI_API_KEY is not configured in the environment variables." 
      }, { status: 500 });
    }

    // 2. Process with Gemini AI
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
    You are an expert culinary AI. 
    Extract the recipe from the following video transcript. 
    IMPORTANT: Always translate and output the extracted recipe (title, ingredients, and steps) in ${language}, regardless of the language used in the transcript.
    Format the output strictly as a JSON object with this exact structure:
    {
      "title": "A catchy title for the recipe",
      "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
      "steps": ["Step 1 instructions", "Step 2 instructions"]
    }
    
    If the transcript doesn't seem to contain a recipe, return:
    {
      "error": "No recipe found in the video."
    }

    Transcript:
    ${rawText}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const parsedData = JSON.parse(text);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to process the recipe. " + error.message }, { status: 500 });
  }
}
