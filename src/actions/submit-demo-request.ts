"use server";

import { headers } from "next/headers";

import { sendDemoRequestEmails } from "@/src/lib/mail";
import { checkRateLimit } from "@/src/lib/rate-limit";
import { demoRequestSchema, type ActionState, type DemoRequestInput } from "@/src/lib/schema";
import { sanitizeString } from "@/src/lib/utils";

function sanitizePayload(input: DemoRequestInput): DemoRequestInput {
  return {
    ...input,
    businessName: sanitizeString(input.businessName),
    businessType: sanitizeString(input.businessType),
    city: sanitizeString(input.city),
    contactName: sanitizeString(input.contactName),
    phone: sanitizeString(input.phone),
    email: sanitizeString(input.email),
    instagram: sanitizeString(input.instagram ?? ""),
    tiktok: sanitizeString(input.tiktok ?? ""),
    facebook: sanitizeString(input.facebook ?? ""),
    website: sanitizeString(input.website ?? ""),
    details: sanitizeString(input.details),
    honey: ""
  };
}

export async function submitDemoRequest(input: DemoRequestInput): Promise<ActionState> {
  if (input.honey) {
    return {
      status: "success",
      message: "ok"
    };
  }

  const ip =
    headers().get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers().get("x-real-ip") ??
    "anonymous";
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return {
      status: "error",
      message:
        input.locale === "ro"
          ? "Ai trimis deja o cerere recent. Incearca din nou peste cateva minute."
          : "You recently submitted a request. Please try again in a few minutes."
    };
  }

  const sanitized = sanitizePayload(input);
  const parsed = demoRequestSchema.safeParse(sanitized);

  if (!parsed.success) {
    return {
      status: "error",
      message: input.locale === "ro" ? "Verificarea campurilor a esuat." : "Validation failed.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    await sendDemoRequestEmails(parsed.data);

    return {
      status: "success",
      message: "Request sent."
    };
  } catch (error) {
    console.error("[submitDemoRequest]", error);

    return {
      status: "error",
      message:
        input.locale === "ro"
          ? "Nu am putut trimite cererea acum."
          : "We could not send your request right now."
    };
  }
}
