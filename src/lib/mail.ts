import { Resend } from "resend";

import type { DemoRequestInput } from "@/src/lib/schema";
import { escapeHtml, formatMultiline } from "@/src/lib/utils";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function requireMailConfig() {
  if (!resend) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  if (!process.env.OWNER_INBOX) {
    throw new Error("Missing OWNER_INBOX.");
  }

  return {
    client: resend,
    ownerInbox: process.env.OWNER_INBOX,
    from: process.env.RESEND_FROM ?? "Weberra <onboarding@resend.dev>"
  };
}

function buildOwnerHtml(data: DemoRequestInput) {
  const links = [
    ["Instagram", data.instagram],
    ["TikTok", data.tiktok],
    ["Facebook", data.facebook],
    ["Website", data.website]
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<li><strong>${label}:</strong> <a href="${escapeHtml(value as string)}">${escapeHtml(
          value as string
        )}</a></li>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2>Cerere noua pentru demo website</h2>
      <p><strong>Afacere:</strong> ${escapeHtml(data.businessName)}</p>
      <p><strong>Tip:</strong> ${escapeHtml(data.businessType)}</p>
      <p><strong>Oras:</strong> ${escapeHtml(data.city)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(data.contactName)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(
        data.email
      )}</a></p>
      <p><strong>Limba formularului:</strong> ${escapeHtml(data.locale.toUpperCase())}</p>
      <h3>Prezenta online</h3>
      <ul>${links || "<li>Nu au fost oferite linkuri.</li>"}</ul>
      <h3>Detalii si preferinte</h3>
      <p>${formatMultiline(escapeHtml(data.details))}</p>
    </div>
  `;
}

function buildAutoReplyHtml(data: DemoRequestInput) {
  if (data.locale === "en") {
    return `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Your free website demo request is in</h2>
        <p>Hi ${escapeHtml(data.contactName)},</p>
        <p>We received the request for <strong>${escapeHtml(data.businessName)}</strong>.</p>
        <p>Next: we review the brief, build a premium homepage concept, then send the demo and recommended structure within 24 hours.</p>
        <p>No payment. No obligation. If anything is unclear, we may reply by email or phone.</p>
        <p>Weberra</p>
      </div>
    `;
  }

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2>Am primit cererea ta pentru demo-ul gratuit</h2>
      <p>Salut, ${escapeHtml(data.contactName)}.</p>
      <p>Am inregistrat cererea pentru <strong>${escapeHtml(data.businessName)}</strong>.</p>
      <p>Urmatorul pas: analizam brief-ul, construim un concept premium de homepage si iti trimitem demo-ul plus structura recomandata in maximum 24 de ore.</p>
      <p>Fara plata. Fara obligatii. Daca avem nevoie de o clarificare, revenim pe email sau telefon.</p>
      <p>Weberra</p>
    </div>
  `;
}

export async function sendDemoRequestEmails(data: DemoRequestInput) {
  const { client, ownerInbox, from } = requireMailConfig();

  const subject = `Demo Request: ${data.businessName} | ${data.businessType} | ${data.city}`;

  await client.emails.send({
    from,
    to: ownerInbox,
    replyTo: data.email,
    subject,
    html: buildOwnerHtml(data)
  });

  await client.emails.send({
    from,
    to: data.email,
    subject:
      data.locale === "en"
        ? "Your free website demo request was received"
        : "Cererea ta pentru demo-ul gratuit a fost primita",
    html: buildAutoReplyHtml(data)
  });
}
