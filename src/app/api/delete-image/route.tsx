// src/app/api/delete-image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { deletehash } = await req.json();

    if (!deletehash) {
      return NextResponse.json(
        { error: "No deletehash provided." },
        { status: 400 }
      );
    }

    // Delete from Imgur using fetch
    const response = await fetch(
      `https://api.imgur.com/3/image/${deletehash}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ message: "Image deleted successfully." });
    } else {
      throw new Error("Imgur deletion failed.");
    }
  } catch (error) {
    console.error("Error deleting image from Imgur:", error);
    return NextResponse.json(
      { error: "Image deletion failed." },
      { status: 500 }
    );
  }
}
