// At the same level as pages or app
import { auth } from "./auth";
import React from "react";
import { NextResponse } from "next/server";

export default async function middleware() {
//   console.log('middleware')
//   const session = await auth();
//   console.log(session)
//   const response = NextResponse.next();
//   if (session) {
//     response.headers.set("Authorization", `Bearer ${session.access_token}`);
//   }
//   return response;
}
