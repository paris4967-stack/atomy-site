exports.handler = async function(event, context) {

  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // OPTIONS 요청 처리 (브라우저 사전 요청)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // POST 요청만 허용
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const SYSTEM_PROMPT = "You are a friendly and knowledgeable AI assistant for Yoon Dahye, an Atomy network marketing member based in Korea. Your role is to answer questions about Atomy in a warm, honest, and enthusiastic way. Key facts: Atomy is a Korean network marketing company in 27 countries with 16M+ members. It sells K-Beauty skincare, oral care, home care, HemoHIM supplements, fresh food, electronics. Joining is 100% free — zero join fee, no autoship, no monthly fees. Members earn cashback via PV from their shopping and their network. Binary structure: two lines (A and B), PV never expires, accumulates globally. 70% revenue shared: 44% support bonus weekly, 20% rank bonus, 6% education bonus. Ranks: Sales Master (~$1,500-3,000/mo), Diamond Master (~$3,000-6,000/mo), Sharon Rose Master ($6,000+/mo). Network inheritable across 3 generations. Sponsor: Yoon Dahye, WhatsApp: https://wa.me/821034338945, Blog: https://atomygd.blogspot.com. Keep answers concise (2-4 sentences). Always offer to help further or suggest contacting Yoon Dahye on WhatsApp. For joining direct to: https://join.atomy.com/global/main. Respond ONLY in English.";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,  // ← API 키는 여기서 환경변수로 안전하게
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server error", detail: error.message })
    };
  }
};