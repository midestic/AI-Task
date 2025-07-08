export async function POST(req: Request) {
  const { prompt, tone } = await req.json();

  if (!prompt || !tone) {
    return new Response(JSON.stringify({ error: "Missing prompt or tone" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const textToSpeak = `Here is a ${tone.toLowerCase()} description of ${prompt}.`;

  const response = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: textToSpeak,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("ElevenLabs Error:", error);
    return new Response(JSON.stringify({ error: "Audio generation failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const audioUrl = `data:audio/mpeg;base64,${base64}`;

  return new Response(JSON.stringify({ url: audioUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
