import { z } from "zod";

const optionalLink = z.string().trim().max(200).optional().or(z.literal(""));

export const demoRequestSchema = z.object({
  locale: z.enum(["ro", "en"]),
  businessName: z.string().trim().min(2).max(120),
  businessType: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(160),
  instagram: optionalLink,
  tiktok: optionalLink,
  facebook: optionalLink,
  website: optionalLink,
  details: z.string().trim().min(20).max(2000),
  consent: z.literal(true),
  honey: z.string().max(0).optional().or(z.literal(""))
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof DemoRequestInput, string[]>>;
};
