import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt");
  const seed = searchParams.get("seed") || Math.floor(Math.random() * 1000000);

  // const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&model=flux&nologo=true`;
  const pollinationsUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;

  try {
    // const response = await fetch(pollinationsUrl);
    const response = await fetch(pollinationsUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
      },
    });
    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}