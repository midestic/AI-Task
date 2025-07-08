export async function POST(req: Request) {
  try {
    const { prompt, tone } = await req.json();

    if (!prompt || !tone) {
      return new Response(JSON.stringify({ error: "Missing prompt or tone" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const coherePrompt = `Write a ${tone} marketing headline and caption for: ${prompt}`;

    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: coherePrompt,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const text = data.generations?.[0]?.text?.trim() || "No response";

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Cohere API Error:", err);
    return new Response(JSON.stringify({ error: "Text generation failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
