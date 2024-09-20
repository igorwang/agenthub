import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = generateApiKey();

  return NextResponse.json({ apiKey }, { status: 201 });
}

function generateApiKey(): string {
  const prefix = "sk-";
  const randomBytes = crypto.randomBytes(24);
  const base64 = randomBytes.toString("base64");
  const urlSafe = base64
    .replace(/[+/]/g, (m) => (m === "+" ? "-" : "_"))
    .replace(/=/g, "");
  return `${prefix}${urlSafe}`;
}
