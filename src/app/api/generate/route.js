import { OpenAI } from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY, 
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await client.images.generate({
      model: "black-forest-labs/flux-schnell",
      prompt,
      response_format: "b64_json",
      response_extension: "png",
    });
    console.log();
    
    return Response.json({ image: response.data[0].b64_json });
  } catch (err) {
    console.error("Image generation error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate image." }), {
      status: 500,
    });
  }
}
