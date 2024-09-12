import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Team OmniRoute.ai" <noreply@omniroute.ai>',
      to: email,
      subject: "Welcome to the OmniRoute.ai Waitlist",
      text: "Thank you for signing up to the OmniRoute.ai waitlist. We will keep you updated on our progress. You will be notified when we launch.",
      html: "<p>Thank you for signing up to the OmniRoute.ai waitlist. We will keep you updated on our progress. You will be notified when we launch.</p>",
    });

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Add email to Google Spreadsheet
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID || "",
      serviceAccountAuth
    );
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      Email: email,
      SignupDate: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Signup successful" }, { status: 200 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
