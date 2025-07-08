export async function POST(req: Request) {
  const { prompt, tone } = await req.json();

  if (!prompt || !tone) {
    return new Response(JSON.stringify({ error: "Missing prompt or tone" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const imagePrompt = `${tone} style illustration of ${prompt}`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/sdxl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        body: JSON.stringify({ inputs: imagePrompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Hugging Face API error:", errorText);

      return new Response(
        JSON.stringify({
          error: "Image generation failed.",
          fallback: true,
          url: "https://via.placeholder.com/512x512?text=Image+Unavailable", // 📷 fallback image
          message:
            "Sorry, we couldn't generate the image. Please try again later.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return new Response(JSON.stringify({ url: imageUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Unexpected Error:", err);

    return new Response(
      JSON.stringify({
        error: "Unexpected server error.",
        fallback: true,
        url: "https://via.placeholder.com/512x512?text=Server+Error",
        message: "Something went wrong. Try again in a moment.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
