import { NextRequest, NextResponse } from "next/server";

// System prompt for the AI to understand the boutique context
const SYSTEM_PROMPT = `You are a helpful AI assistant for Fatima Zehra Boutique, an e-commerce platform specializing in premium ladies suits, shalwar qameez, and designer wear.

Product Categories Available:
1. Fancy Suits - Premium embroidered suits (Rs 3,499 - 7,999)
2. Shalwar Qameez - Traditional and modern designs (Rs 1,599 - 3,499)
3. Cotton Suits - Comfortable everyday wear (Rs 1,499 - 2,399)
4. Designer Brands - Luxury collection (Rs 6,799 - 9,999)

Your responsibilities:
- Help customers find the perfect suit based on their needs
- Answer questions about products, prices, materials, and sizes
- Provide styling advice and recommendations
- Assist with sizing information
- Be warm, friendly, and helpful
- Always maintain a professional tone
- Use customer-friendly language
- Include relevant emojis occasionally for warmth

When discussing products, mention:
- Category name
- Price range
- Key features
- Material composition
- Available sizes

Always be enthusiastic about helping customers find their perfect suit!`;

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
}

/**
 * POST /api/chat
 * Handles chat messages and returns AI responses
 * Uses OpenAI API key from environment variables
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest;
    const { message, conversationHistory = [] } = body;

    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY || "";

    if (!apiKey) {
      console.warn("OpenAI API key not found in environment variables");
      // Return a helpful message if API key is missing
      return NextResponse.json(
        {
          message:
            "Thanks for your interest! Our AI assistant is temporarily unavailable, but our team is here to help. Please contact our support team at support@fatimazehra.com for assistance.",
          fallback: true,
        },
        { status: 200 }
      );
    }

    // Build conversation history for context
    const messages: any[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...conversationHistory
        .slice(-5) // Keep last 5 messages for context
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      {
        role: "user",
        content: message,
      },
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);

      // Return fallback response if API fails
      return NextResponse.json(
        {
          message:
            "I'm having trouble processing your request right now. Please try again in a moment or contact our support team.",
          fallback: true,
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const assistantMessage =
      data.choices[0]?.message?.content ||
      "Thank you for your message! We'll get back to you shortly.";

    return NextResponse.json(
      {
        message: assistantMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      {
        message:
          "I'm having trouble connecting right now. Please try again later!",
        fallback: true,
      },
      { status: 200 }
    );
  }
}

/**
 * GET /api/chat
 * Returns system info about the chat API
 */
export async function GET() {
  return NextResponse.json({
    status: "Chat API is active",
    categories: ["Fancy Suits", "Shalwar Qameez", "Cotton Suits", "Designer Brands"],
    priceRange: "Rs 1,500 - Rs 10,000",
    ai: "OpenAI GPT-3.5-turbo",
  });
}
