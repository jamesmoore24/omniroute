import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  console.log("POST request received for image upload");
  try {
    const formData = await req.formData();
    console.log("FormData received:", formData);

    const file = formData.get("image") as File | null;
    console.log("File object:", file);

    if (!file) {
      console.log("No file received in the request");
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    console.log("File name:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size);

    const arrayBuffer = await file.arrayBuffer();
    console.log("ArrayBuffer size:", arrayBuffer.byteLength);

    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    console.log("Base64 image length:", base64Image.length);

    console.log("Sending request to Imgur API");
    const { data } = await axios.post(
      "https://api.imgur.com/3/image",
      { image: base64Image, type: "base64" },
      { headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` } }
    );

    return NextResponse.json({
      url: data.data.link,
      deletehash: data.data.deletehash,
    });
  } catch (error) {
    console.error("Error in image upload:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
