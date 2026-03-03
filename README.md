# Weberra Landing Page

Premium, Romania-focused landing page built with Next.js App Router, TypeScript, Tailwind, shadcn-style UI components, `next-intl`, `next-themes`, CSS-based motion, Resend email delivery, and unsigned Cloudinary uploads.

## Stack

- Next.js 14+ with App Router
- TypeScript
- TailwindCSS
- shadcn-style component structure
- `next-intl` for RO/EN
- `next-themes` for light/dark/system
- CSS-based reveal and hover motion
- Resend for owner email + auto-reply
- Cloudinary unsigned uploads for optional image attachments

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env values:

```bash
cp .env.example .env.local
```

3. Fill these variables:

- `OWNER_INBOX`: where demo requests should arrive
- `RESEND_API_KEY`: Resend API key
- `RESEND_FROM`: verified sender, or `onboarding@resend.dev` while testing
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: unsigned preset for image uploads
- `NEXT_PUBLIC_SITE_URL`: canonical site URL

4. Start development:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Cloudinary Setup

1. Create an unsigned upload preset in Cloudinary.
2. Restrict it to images only if desired.
3. Use that preset value in `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

The form uploads up to 6 images directly from the browser and sends the resulting URLs by email.

## Email Flow

On submit, the server action:

- validates and sanitizes the request
- applies a simple in-memory per-IP cooldown
- sends the full request to `OWNER_INBOX`
- sends an automatic confirmation email to the requester in RO or EN

## Routes

- `/` default Romanian landing page
- `/en` English landing page
- `/demo-website-presentation`
- `/en/demo-website-presentation`
- `/privacy`
- `/terms`
- `/en/privacy`
- `/en/terms`

## SEO

Included:

- localized metadata
- Open Graph / Twitter metadata
- canonical + language alternates
- `robots.ts`
- `sitemap.ts`
- JSON-LD for `Organization`, `WebSite`, and `Service`
- localized, Romania-focused keyword targeting in copy and metadata

## Deployment

This project is Vercel-ready.

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add the same environment variables from `.env.local`.
4. Deploy.

## Notes

- The showcase section is structured for premium MP4 demo clips, but currently uses polished mock frames so the page works without bundled media assets.
- The anti-spam cooldown is in-memory. For multi-instance production scaling, replace it with a shared store such as Upstash Redis or KV.
